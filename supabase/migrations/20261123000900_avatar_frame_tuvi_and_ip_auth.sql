begin;

alter table public.disciples
  add column if not exists avatar_frame text not null default 'default',
  add column if not exists role text not null default 'disciple',
  add column if not exists tu_vi integer not null default 10;

update public.disciples d
set avatar_frame = case
      when coalesce(nullif(d.active_frame, ''), 'jade') = 'jade' then 'default'
      else d.active_frame
    end,
    role = case
      when lower(coalesce(d.email, '')) = 'phamnguyenhaithanh4@gmail.com' then 'admin'
      when d.role = 'admin' then 'admin'
      else 'disciple'
    end,
    tu_vi = case
      when d.role = 'admin' or lower(coalesce(d.email, '')) = 'phamnguyenhaithanh4@gmail.com' then 99999
      else greatest(10, coalesce((
        select c.tu_vi from public.user_cultivation c
        where c.user_id = d.user_id limit 1
      ), d.tu_vi, 10))
    end;

create or replace function public.is_sect_owner()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'phamnguyenhaithanh4@gmail.com'
    or exists (
      select 1 from public.disciples d
      where d.user_id = auth.uid() and d.role = 'admin'
    );
$$;

create or replace function public.guard_disciple_self_updates()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  metadata jsonb := coalesce(auth.jwt() -> 'user_metadata', '{}'::jsonb);
  requested_frame text;
begin
  if public.is_sect_owner() then
    return new;
  end if;
  if current_setting('app.allow_spirit_wallet_write', true) = 'on'
     or current_setting('app.allow_disciple_profile_sync', true) = 'on' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.email := coalesce(auth.jwt() ->> 'email', new.email);
    new.username := nullif(lower(btrim(coalesce(new.username, metadata ->> 'username', ''))), '');
    new.sect_title := 'Ngoại Môn Đệ Tử';
    new.role := 'disciple';
    new.is_banned := false;
    new.spirit_stones := case
      when coalesce(metadata ->> 'starting_spirit_stones', '') ~ '^[0-9]+$'
        then greatest(0, least(20, (metadata ->> 'starting_spirit_stones')::integer))
      else 0
    end;
    new.unlocked_frames := '["jade"]'::jsonb;
    new.active_frame := 'jade';
    new.avatar_frame := 'default';
    new.tu_vi := 10;
    new.quiz_best_score := 0;
    new.quiz_max_combo := 0;
    new.visit_count := greatest(1, least(coalesce(new.visit_count, 1), 1));
    return new;
  end if;

  new.user_id := old.user_id;
  new.email := coalesce(auth.jwt() ->> 'email', old.email);
  new.sect_title := old.sect_title;
  new.role := old.role;
  new.is_banned := old.is_banned;
  new.spirit_stones := old.spirit_stones;
  new.unlocked_frames := old.unlocked_frames;
  new.tu_vi := old.tu_vi;
  requested_frame := case
    when new.avatar_frame is distinct from old.avatar_frame then new.avatar_frame
    when new.active_frame is distinct from old.active_frame then new.active_frame
    else old.active_frame
  end;
  requested_frame := case when requested_frame = 'default' then 'jade' else requested_frame end;
  if coalesce(old.unlocked_frames, '["jade"]'::jsonb) ? requested_frame then
    new.active_frame := requested_frame;
  else
    new.active_frame := old.active_frame;
  end if;
  new.avatar_frame := case when new.active_frame = 'jade' then 'default' else new.active_frame end;
  new.username := old.username;
  new.quiz_best_score := greatest(coalesce(old.quiz_best_score, 0), coalesce(new.quiz_best_score, 0));
  new.quiz_max_combo := greatest(coalesce(old.quiz_max_combo, 0), coalesce(new.quiz_max_combo, 0));
  new.visit_count := greatest(coalesce(old.visit_count, 0), least(coalesce(new.visit_count, 0), coalesce(old.visit_count, 0) + 1));
  return new;
end;
$$;

create or replace function public.sync_disciple_tuvi_from_cultivation()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_points integer;
begin
  select case
    when d.role = 'admin' or lower(coalesce(d.email, '')) = 'phamnguyenhaithanh4@gmail.com'
      then 99999
    else greatest(10, coalesce(new.tu_vi, 10))
  end
  into v_points
  from public.disciples d
  where d.user_id = new.user_id;

  if v_points is not null then
    perform set_config('app.allow_disciple_profile_sync', 'on', true);
    update public.disciples
    set tu_vi = v_points
    where user_id = new.user_id and tu_vi is distinct from v_points;
  end if;
  return new;
end;
$$;

drop trigger if exists user_cultivation_sync_disciple_tu_vi on public.user_cultivation;
create trigger user_cultivation_sync_disciple_tu_vi
after insert or update on public.user_cultivation
for each row execute function public.sync_disciple_tuvi_from_cultivation();

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
       (d.role = 'admin' or lower(coalesce(d.email, '')) = 'phamnguyenhaithanh4@gmail.com') as is_owner,
       d.role,
       d.avatar_frame,
       case
         when d.role = 'admin' or lower(coalesce(d.email, '')) = 'phamnguyenhaithanh4@gmail.com' then 99999
         else greatest(10, coalesce(d.tu_vi, c.tu_vi, 10))
       end::integer as tu_vi,
       case
         when d.role = 'admin' or lower(coalesce(d.email, '')) = 'phamnguyenhaithanh4@gmail.com' then 99999
         else greatest(10, coalesce(d.tu_vi, c.tu_vi, 10))
       end::integer as cultivation_points
from public.disciples d
left join public.user_cultivation c on c.user_id = d.user_id;

grant select on public.sect_public_disciples to anon, authenticated;

drop function if exists public.equip_or_buy_frame(text, integer, boolean);
create or replace function public.equip_or_buy_frame(
  p_frame_id text,
  p_cost integer
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
        active_frame = p_frame_id,
        avatar_frame = case when p_frame_id = 'jade' then 'default' else p_frame_id end
    where user_id = v_user_id
    returning * into v_disciple;
  else
    update public.disciples
    set unlocked_frames = case
          when coalesce(unlocked_frames, '["jade"]'::jsonb) ? p_frame_id
            then coalesce(unlocked_frames, '["jade"]'::jsonb)
          else coalesce(unlocked_frames, '["jade"]'::jsonb) || jsonb_build_array(p_frame_id)
        end,
        active_frame = p_frame_id,
        avatar_frame = case when p_frame_id = 'jade' then 'default' else p_frame_id end
    where user_id = v_user_id
    returning * into v_disciple;
  end if;
  return to_jsonb(v_disciple);
end;
$$;

revoke all on function public.equip_or_buy_frame(text, integer) from public, anon;
grant execute on function public.equip_or_buy_frame(text, integer) to authenticated;

create or replace function public.update_disciple_avatar(p_avatar_url text)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  new_avatar_url text := btrim(coalesce(p_avatar_url, ''));
begin
  if auth.uid() is null then
    raise exception 'Vui lòng đăng nhập để cập nhật ảnh đại diện.' using errcode = '42501';
  end if;
  if char_length(new_avatar_url) = 0 or char_length(new_avatar_url) > 200000 then
    raise exception 'Đường dẫn ảnh đại diện không hợp lệ.' using errcode = '22023';
  end if;
  if lower(new_avatar_url) not like 'https://%'
     and lower(new_avatar_url) not like 'http://%'
     and lower(new_avatar_url) not like 'data:image/%'
     and new_avatar_url !~ '^images/avt/avt[1-5]\.(webp|jpe?g|png)$' then
    raise exception 'Chỉ chấp nhận ảnh HTTPS, ảnh đã mã hóa hoặc ảnh mẫu Tông Môn.' using errcode = '22023';
  end if;

  update public.disciples
  set avatar_url = new_avatar_url
  where user_id = auth.uid();
  if not found then
    raise exception 'Không tìm thấy hồ sơ môn đồ để cập nhật.' using errcode = 'P0002';
  end if;

  update public.sect_comments
  set user_avatar = new_avatar_url
  where user_id = auth.uid();

  if public.is_sect_owner() then
    update public.sect_messages
    set user_avatar = new_avatar_url
    where sender_role in ('owner', 'admin', 'tong_chu');
  else
    update public.sect_messages
    set user_avatar = new_avatar_url
    where user_id = auth.uid() and sender_role = 'disciple';
  end if;
end;
$$;

revoke all on function public.update_disciple_avatar(text) from public;
grant execute on function public.update_disciple_avatar(text) to authenticated;

drop function if exists public.check_and_register_ip(text, text, boolean, boolean);
create or replace function public.check_and_register_ip(
  p_ip text,
  p_device_id text,
  p_is_new_signup boolean
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

revoke all on function public.check_and_register_ip(text, text, boolean) from public;
grant execute on function public.check_and_register_ip(text, text, boolean) to anon, authenticated;

notify pgrst, 'reload schema';

commit;
