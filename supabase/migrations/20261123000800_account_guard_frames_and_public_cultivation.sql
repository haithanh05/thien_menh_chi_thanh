begin;

create or replace view public.sect_public_disciples
with (security_invoker = false)
as
select d.user_id,
       d.full_name,
       d.sect_title,
       d.avatar_url,
       d.active_frame,
       d.quiz_best_score,
       d.quiz_max_combo,
       lower(coalesce(d.email, '')) = 'phamnguyenhaithanh4@gmail.com' as is_owner,
       case
         when lower(coalesce(d.email, '')) = 'phamnguyenhaithanh4@gmail.com' then 'admin'
         else 'disciple'
       end as role,
       d.active_frame as avatar_frame,
       coalesce(c.tu_vi, 0)::integer as tu_vi,
       coalesce(c.tu_vi, 0)::integer as cultivation_points
from public.disciples d
left join public.user_cultivation c on c.user_id = d.user_id;

grant select on public.sect_public_disciples to anon, authenticated;
grant select (user_id) on public.sect_comments to anon, authenticated;

create or replace function public.equip_or_buy_frame(
  p_frame_id text,
  p_cost integer,
  p_is_admin boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_owner boolean := public.is_sect_owner();
  v_price integer;
  v_disciple public.disciples%rowtype;
begin
  if v_user_id is null then raise exception 'Đạo hữu cần đăng nhập.'; end if;
  v_price := case p_frame_id
    when 'jade' then 0
    when 'dragon' then 30
    when 'phoenix' then 60
    when 'thunder' then 100
    when 'lotus' then 180
    else null
  end;
  if v_price is null then raise exception 'Khung viền này không hợp lệ.'; end if;
  if p_cost is distinct from v_price then raise exception 'Chi phí khung viền không hợp lệ.'; end if;

  select * into v_disciple
  from public.disciples
  where user_id = v_user_id
  for update;
  if not found then raise exception 'Không tìm thấy hồ sơ môn đồ.'; end if;

  if not v_owner and not (coalesce(v_disciple.unlocked_frames, '["jade"]'::jsonb) ? p_frame_id) then
    if coalesce(v_disciple.spirit_stones, 0) < v_price then
      raise exception 'Không đủ Linh Thạch để mở khóa khung viền này.';
    end if;
    perform set_config('app.allow_spirit_wallet_write', 'on', true);
    update public.disciples
    set spirit_stones = spirit_stones - v_price,
        unlocked_frames = coalesce(unlocked_frames, '["jade"]'::jsonb) || jsonb_build_array(p_frame_id),
        active_frame = p_frame_id
    where user_id = v_user_id
    returning * into v_disciple;
  else
    update public.disciples
    set unlocked_frames = case
          when coalesce(unlocked_frames, '["jade"]'::jsonb) ? p_frame_id
            then coalesce(unlocked_frames, '["jade"]'::jsonb)
          else coalesce(unlocked_frames, '["jade"]'::jsonb) || jsonb_build_array(p_frame_id)
        end,
        active_frame = p_frame_id
    where user_id = v_user_id
    returning * into v_disciple;
  end if;
  return to_jsonb(v_disciple);
end;
$$;

revoke all on function public.equip_or_buy_frame(text, integer, boolean) from public, anon;
grant execute on function public.equip_or_buy_frame(text, integer, boolean) to authenticated;

create table if not exists public.sect_account_registrations (
  user_id uuid references auth.users(id) on delete cascade,
  device_id text not null,
  ip_address inet not null,
  ip_exempt boolean not null default false,
  pending_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sect_account_registrations_device_id_check
    check (device_id ~ '^[A-Za-z0-9-]{16,80}$')
);

create unique index if not exists sect_account_registrations_device_unique
  on public.sect_account_registrations (device_id);
create unique index if not exists sect_account_registrations_user_unique
  on public.sect_account_registrations (user_id)
  where user_id is not null;
create unique index if not exists sect_account_registrations_ip_unique
  on public.sect_account_registrations (ip_address)
  where not ip_exempt;
create index if not exists sect_account_registrations_pending_idx
  on public.sect_account_registrations (pending_until)
  where user_id is null;

alter table public.sect_account_registrations enable row level security;
revoke all on table public.sect_account_registrations from public, anon, authenticated;

create or replace function public.check_and_register_ip(
  p_ip text,
  p_device_id text,
  p_is_new_signup boolean,
  p_is_admin boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_owner boolean := public.is_sect_owner();
  v_headers jsonb;
  v_ip_text text;
  v_ip inet;
  v_device_id text := btrim(coalesce(p_device_id, ''));
begin
  delete from public.sect_account_registrations
  where user_id is null and pending_until <= now();

  if v_device_id !~ '^[A-Za-z0-9-]{16,80}$' then
    return jsonb_build_object('allowed', false, 'reason', 'Mã thiết bị không hợp lệ.');
  end if;
  if v_user_id is null and not coalesce(p_is_new_signup, false) then
    return jsonb_build_object('allowed', false, 'reason', 'Cần đăng nhập để xác minh thiết bị.');
  end if;

  v_headers := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb;
  v_ip_text := btrim(split_part(coalesce(
    nullif(v_headers ->> 'cf-connecting-ip', ''),
    nullif(v_headers ->> 'x-forwarded-for', ''),
    nullif(v_headers ->> 'x-real-ip', ''),
    ''
  ), ',', 1));
  if v_ip_text = '' then
    return jsonb_build_object('allowed', false, 'reason', 'Không thể xác minh IP từ kết nối Supabase.');
  end if;
  begin
    v_ip := v_ip_text::inet;
  exception when invalid_text_representation then
    return jsonb_build_object('allowed', false, 'reason', 'Địa chỉ IP từ kết nối không hợp lệ.');
  end;

  if exists (
    select 1 from public.sect_account_registrations r
    where r.device_id = v_device_id
      and r.user_id is not null
      and r.user_id is distinct from v_user_id
  ) then
    return jsonb_build_object('allowed', false, 'reason', 'Thiết bị này đã được liên kết với tài khoản khác.');
  end if;
  if not v_owner and exists (
    select 1 from public.sect_account_registrations r
    where r.ip_address = v_ip
      and not r.ip_exempt
      and r.user_id is distinct from v_user_id
      and not (r.user_id is null and r.device_id = v_device_id)
  ) then
    return jsonb_build_object('allowed', false, 'reason', 'IP này đã được liên kết với tài khoản khác.');
  end if;

  if v_user_id is null then
    insert into public.sect_account_registrations
      (user_id, device_id, ip_address, ip_exempt, pending_until, updated_at)
    values
      (null, v_device_id, v_ip, false, now() + interval '24 hours', now())
    on conflict (device_id) do update
      set ip_address = excluded.ip_address,
          pending_until = excluded.pending_until,
          updated_at = now()
      where public.sect_account_registrations.user_id is null
    returning device_id into v_device_id;
    if not found then
      return jsonb_build_object('allowed', false, 'reason', 'Thiết bị đang được liên kết với tài khoản khác.');
    end if;
  else
    delete from public.sect_account_registrations
    where user_id = v_user_id and device_id <> v_device_id;
    insert into public.sect_account_registrations
      (user_id, device_id, ip_address, ip_exempt, pending_until, updated_at)
    values
      (v_user_id, v_device_id, v_ip, v_owner, null, now())
    on conflict (device_id) do update
      set user_id = excluded.user_id,
          ip_address = excluded.ip_address,
          ip_exempt = excluded.ip_exempt,
          pending_until = null,
          updated_at = now()
      where public.sect_account_registrations.user_id is null
         or public.sect_account_registrations.user_id = excluded.user_id
    returning device_id into v_device_id;
    if not found then
      return jsonb_build_object('allowed', false, 'reason', 'Thiết bị đang được liên kết với tài khoản khác.');
    end if;
  end if;

  return jsonb_build_object('allowed', true, 'reason', '');
exception
  when unique_violation then
    return jsonb_build_object('allowed', false, 'reason', 'IP hoặc thiết bị này đã được liên kết với tài khoản khác.');
end;
$$;

revoke all on function public.check_and_register_ip(text, text, boolean, boolean) from public;
grant execute on function public.check_and_register_ip(text, text, boolean, boolean) to anon, authenticated;

create or replace function public.release_ip_registration(p_device_id text)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_headers jsonb;
  v_ip_text text;
  v_ip inet;
begin
  v_headers := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb;
  v_ip_text := btrim(split_part(coalesce(
    nullif(v_headers ->> 'cf-connecting-ip', ''),
    nullif(v_headers ->> 'x-forwarded-for', ''),
    nullif(v_headers ->> 'x-real-ip', ''),
    ''
  ), ',', 1));
  if v_ip_text = '' then return; end if;
  begin
    v_ip := v_ip_text::inet;
  exception when invalid_text_representation then
    return;
  end;
  delete from public.sect_account_registrations
  where user_id is null
    and device_id = p_device_id
    and ip_address = v_ip;
end;
$$;

revoke all on function public.release_ip_registration(text) from public;
grant execute on function public.release_ip_registration(text) to anon, authenticated;

notify pgrst, 'reload schema';

commit;
