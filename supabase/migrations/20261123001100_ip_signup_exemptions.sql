begin;

create table if not exists public.sect_owner_ip_exemptions (
  ip_address inet primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  updated_at timestamptz not null default now()
);
alter table public.sect_owner_ip_exemptions enable row level security;

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

  if v_user_id is null and not coalesce(p_is_new_signup, false) then
    return jsonb_build_object('allowed', true, 'reason', '');
  end if;

  v_headers := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb;
  v_ip_text := btrim(split_part(coalesce(
    nullif(v_headers ->> 'cf-connecting-ip', ''),
    nullif(v_headers ->> 'x-forwarded-for', ''),
    nullif(v_headers ->> 'x-real-ip', ''),
    ''
  ), ',', 1));
  if v_ip_text = '' then
    return jsonb_build_object('allowed', true, 'reason', 'Không thể xác minh IP từ kết nối Supabase.');
  end if;
  begin
    v_ip := v_ip_text::inet;
  exception when invalid_text_representation then
    return jsonb_build_object('allowed', true, 'reason', 'Địa chỉ IP từ kết nối không hợp lệ.');
  end;

  if v_owner then
    insert into public.sect_owner_ip_exemptions(ip_address, user_id, updated_at)
    values (v_ip, v_user_id, now())
    on conflict (ip_address) do update
      set user_id = excluded.user_id,
          updated_at = now();
    return jsonb_build_object('allowed', true, 'reason', '');
  end if;

  if v_device_id !~ '^[A-Za-z0-9-]{16,80}$' then
    if coalesce(p_is_new_signup, false) then
      return jsonb_build_object('allowed', false, 'reason', 'Mã thiết bị không hợp lệ.');
    end if;
    return jsonb_build_object('allowed', true, 'reason', '');
  end if;

  if not coalesce(p_is_new_signup, false) then
    if v_user_id is null then
      return jsonb_build_object('allowed', true, 'reason', '');
    end if;
    if exists (
      select 1 from public.sect_account_registrations r
      where r.device_id = v_device_id
        and r.user_id is not null
        and r.user_id is distinct from v_user_id
    ) then
      return jsonb_build_object('allowed', true, 'reason', '');
    end if;

    delete from public.sect_account_registrations
    where user_id = v_user_id and device_id <> v_device_id;
    insert into public.sect_account_registrations
      (user_id, device_id, ip_address, ip_exempt, pending_until, updated_at)
    values (v_user_id, v_device_id, v_ip, false, null, now())
    on conflict (device_id) do update
      set ip_address = excluded.ip_address,
          pending_until = null,
          updated_at = now()
      where public.sect_account_registrations.user_id is null
         or public.sect_account_registrations.user_id = excluded.user_id;
    return jsonb_build_object('allowed', true, 'reason', '');
  end if;

  if exists (
    select 1 from public.sect_account_registrations r
    where r.device_id = v_device_id
      and r.user_id is not null
      and r.user_id is distinct from v_user_id
  ) then
    return jsonb_build_object('allowed', false, 'reason', 'Thiết bị này đã được liên kết với tài khoản khác.');
  end if;
  if not exists (
    select 1 from public.sect_owner_ip_exemptions e where e.ip_address = v_ip
  ) and exists (
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
    values (null, v_device_id, v_ip, false, now() + interval '24 hours', now())
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
    values (v_user_id, v_device_id, v_ip, false, null, now())
    on conflict (device_id) do update
      set user_id = excluded.user_id,
          ip_address = excluded.ip_address,
          ip_exempt = false,
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
    if not coalesce(p_is_new_signup, false) then
      return jsonb_build_object('allowed', true, 'reason', '');
    end if;
    return jsonb_build_object('allowed', false, 'reason', 'IP hoặc thiết bị này đã được liên kết với tài khoản khác.');
end;
$$;

revoke all on function public.check_and_register_ip(text, text, boolean) from public;
grant execute on function public.check_and_register_ip(text, text, boolean) to anon, authenticated;

notify pgrst, 'reload schema';

commit;
