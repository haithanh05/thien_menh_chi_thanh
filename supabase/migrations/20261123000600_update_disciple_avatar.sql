begin;

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
     and lower(new_avatar_url) not like 'data:image/%' then
    raise exception 'Chỉ chấp nhận ảnh HTTPS hoặc ảnh đã mã hóa.' using errcode = '22023';
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

notify pgrst, 'reload schema';

commit;
