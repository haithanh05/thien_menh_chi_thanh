begin;

create or replace function public.fill_sect_comment_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  new.user_id := auth.uid();
  new.user_email := coalesce(auth.jwt() ->> 'email', '');
  if public.is_sect_owner() then
    new.is_owner := true;
    select coalesce(nullif(d.username, ''), nullif(d.full_name, ''), 'Tông Chủ')
    into new.user_name
    from public.disciples d
    where d.user_id = auth.uid();
    new.user_name := coalesce(nullif(new.user_name, ''), 'Tông Chủ');
    new.full_name := new.user_name;
    new.sect_title := 'Tông Chủ';
  else
    new.is_owner := false;
    new.is_pinned := false;
    new.rewarded_stones := 0;
    select coalesce(nullif(d.username, ''), d.full_name, 'Đạo Hữu'),
           coalesce(d.sect_title, 'Ngoại Môn Đệ Tử'),
           coalesce(d.avatar_url, ''),
           coalesce(d.active_frame, 'jade')
    into new.user_name, new.sect_title, new.user_avatar, new.active_frame
    from public.disciples d
    where d.user_id = auth.uid();
    new.full_name := new.user_name;
  end if;
  return new;
end;
$$;

create or replace function public.update_disciple_name(p_new_name text)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  new_name text := btrim(coalesce(p_new_name, ''));
begin
  if auth.uid() is null then
    raise exception 'Vui lòng đăng nhập để đổi Đạo Hiệu.' using errcode = '42501';
  end if;
  if char_length(new_name) < 2 or char_length(new_name) > 24 then
    raise exception 'Đạo hiệu phải có từ 2 đến 24 ký tự.' using errcode = '22023';
  end if;
  if exists (
    select 1
    from public.disciples d
    where lower(d.username) = lower(new_name)
      and d.user_id <> auth.uid()
  ) then
    raise exception 'Đạo hiệu này đã được sử dụng. Vui lòng chọn tên khác.'
      using errcode = '23505';
  end if;

  perform set_config('app.allow_spirit_wallet_write', 'on', true);
  update public.disciples
  set username = new_name, full_name = new_name
  where user_id = auth.uid();
  if not found then
    raise exception 'Không tìm thấy hồ sơ môn đồ để cập nhật.';
  end if;

  update public.sect_comments
  set user_name = new_name, full_name = new_name
  where user_id = auth.uid();

  if public.is_sect_owner() then
    update public.sect_messages
    set user_name = new_name, full_name = new_name
    where sender_role in ('owner', 'admin', 'tong_chu');
  else
    update public.sect_messages
    set user_name = new_name, full_name = new_name
    where user_id = auth.uid() and sender_role = 'disciple';
  end if;
end;
$$;

revoke all on function public.update_disciple_name(text) from public;
grant execute on function public.update_disciple_name(text) to authenticated;

notify pgrst, 'reload schema';

commit;
