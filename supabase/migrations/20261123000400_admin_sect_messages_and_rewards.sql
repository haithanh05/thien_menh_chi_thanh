begin;

alter table public.sect_messages
  drop constraint if exists sect_messages_sender_role_check;

alter table public.sect_messages
  add constraint sect_messages_sender_role_check
  check (sender_role in ('disciple', 'owner', 'admin', 'tong_chu'));

create or replace function public.guard_sect_message_insert()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  new.is_read := false;
  if public.is_sect_owner() then
    new.sender_role := 'tong_chu';
    new.full_name := 'Tông Chủ';
  else
    new.user_id := auth.uid();
    new.user_email := coalesce(auth.jwt() ->> 'email', '');
    new.sender_role := 'disciple';
    select coalesce(d.full_name, 'Đạo Hữu')
    into new.full_name
    from public.disciples d where d.user_id = auth.uid();
  end if;
  return new;
end;
$$;

drop policy if exists sect_messages_conversation_insert on public.sect_messages;
create policy sect_messages_conversation_insert on public.sect_messages
for insert to authenticated
with check (
  (public.is_sect_owner() and sender_role = 'tong_chu')
  or (
    user_id = auth.uid()
    and sender_role = 'disciple'
    and lower(user_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

drop policy if exists sect_messages_conversation_select on public.sect_messages;
create policy sect_messages_conversation_select on public.sect_messages
for select to authenticated
using (
  user_id = auth.uid()
  or lower(user_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.is_sect_owner()
);

create or replace function public.admin_reward_sect_comment(p_comment_id uuid, p_amount integer)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  recipient uuid;
begin
  if not public.is_sect_owner() then raise exception 'Chỉ Tông Chủ mới được ban thưởng.'; end if;
  if p_amount is null or p_amount < 1 or p_amount > 1000000 then
    raise exception 'Số Linh Thạch phải từ 1 đến 1.000.000.';
  end if;
  select user_id into recipient
  from public.sect_comments where id = p_comment_id for update;
  if recipient is null then raise exception 'Không tìm thấy bình luận.'; end if;
  update public.sect_comments
  set rewarded_stones = rewarded_stones + p_amount
  where id = p_comment_id;
  perform set_config('app.allow_spirit_wallet_write', 'on', true);
  update public.disciples
  set spirit_stones = spirit_stones + p_amount
  where user_id = recipient;
  if not found then raise exception 'Không tìm thấy hồ sơ môn đồ để cộng Linh Thạch.'; end if;
end;
$$;

notify pgrst, 'reload schema';

commit;
