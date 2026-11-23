begin;

alter table public.sect_comments
  add column if not exists id uuid not null default gen_random_uuid(),
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists full_name text not null default '',
  add column if not exists sect_title text not null default 'Ngoại Môn Đệ Tử',
  add column if not exists content text not null default '',
  add column if not exists is_pinned boolean not null default false,
  add column if not exists is_owner boolean not null default false,
  add column if not exists rewarded_stones integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists user_email text,
  add column if not exists user_name text not null default '',
  add column if not exists user_avatar text not null default '',
  add column if not exists active_frame text not null default 'jade';

alter table public.sect_comments
  add column if not exists parent_id uuid references public.sect_comments(id) on delete cascade;

create unique index if not exists sect_comments_id_unique_idx
  on public.sect_comments (id);

update public.sect_comments c
set user_email = coalesce(nullif(c.user_email, ''), u.email),
    user_name = coalesce(nullif(c.user_name, ''), nullif(c.full_name, ''), 'Đạo Hữu'),
    user_avatar = coalesce(nullif(c.user_avatar, ''), d.avatar_url, ''),
    active_frame = coalesce(nullif(c.active_frame, ''), d.active_frame, 'jade')
from auth.users u
left join public.disciples d on d.user_id = u.id
where c.user_id = u.id;

update public.sect_comments
set user_name = 'Tông Chủ',
    full_name = 'Tông Chủ',
    sect_title = 'Tông Chủ',
    is_owner = true
where lower(coalesce(user_email, '')) = 'phamnguyenhaithanh4@gmail.com';

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
    new.user_name := 'Tông Chủ';
    new.full_name := 'Tông Chủ';
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

drop trigger if exists sect_comments_fill_profile on public.sect_comments;
create trigger sect_comments_fill_profile
before insert on public.sect_comments
for each row execute function public.fill_sect_comment_profile();

alter table public.sect_comments enable row level security;
drop policy if exists sect_comments_public_select on public.sect_comments;
create policy sect_comments_public_select on public.sect_comments
for select to anon, authenticated using (true);
drop policy if exists sect_comments_member_insert on public.sect_comments;
create policy sect_comments_member_insert on public.sect_comments
for insert to authenticated
with check (
  user_id = auth.uid()
  and char_length(btrim(content)) between 1 and 800
  and exists (
    select 1 from public.disciples d
    where d.user_id = auth.uid() and coalesce(d.is_banned, false) = false
  )
);
drop policy if exists sect_comments_owner_update on public.sect_comments;
create policy sect_comments_owner_update on public.sect_comments
for update to authenticated using (public.is_sect_owner()) with check (public.is_sect_owner());
drop policy if exists sect_comments_owner_delete on public.sect_comments;
create policy sect_comments_owner_delete on public.sect_comments
for delete to authenticated using (public.is_sect_owner());

revoke all on table public.sect_comments from anon, authenticated;
grant select (id, parent_id, user_name, user_avatar, sect_title, active_frame,
              content, is_pinned, rewarded_stones, created_at, is_owner)
  on table public.sect_comments to anon, authenticated;
grant insert (user_id, user_email, user_name, user_avatar, sect_title,
              active_frame, content, parent_id)
  on table public.sect_comments to authenticated;
grant update (is_pinned) on table public.sect_comments to authenticated;
grant delete on table public.sect_comments to authenticated;

notify pgrst, 'reload schema';

commit;
