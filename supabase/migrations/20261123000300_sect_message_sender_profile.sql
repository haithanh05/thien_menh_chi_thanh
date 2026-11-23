begin;

alter table public.sect_messages
  add column if not exists user_name text not null default '',
  add column if not exists user_avatar text not null default '';

update public.sect_messages m
set user_name = case
      when m.sender_role = 'owner' then 'Tông Chủ'
      else coalesce(nullif(d.username, ''), nullif(d.full_name, ''), nullif(m.full_name, ''), 'Đạo Hữu')
    end,
    user_avatar = coalesce(nullif(m.user_avatar, ''), d.avatar_url, '')
from public.disciples d
where m.user_id = d.user_id
  and (m.user_name = '' or m.user_avatar = '');

update public.sect_messages
set user_name = 'Tông Chủ'
where sender_role = 'owner' and user_name = '';

notify pgrst, 'reload schema';

commit;
