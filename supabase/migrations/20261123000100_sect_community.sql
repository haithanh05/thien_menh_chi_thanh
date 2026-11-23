begin;

alter table public.disciples
  add column if not exists username text,
  add column if not exists spirit_stones integer not null default 0,
  add column if not exists unlocked_frames jsonb not null default '["jade"]'::jsonb,
  add column if not exists active_frame text not null default 'jade',
  add column if not exists quiz_best_score integer not null default 0,
  add column if not exists quiz_max_combo integer not null default 0,
  add column if not exists visit_count integer not null default 0,
  add column if not exists last_seen timestamptz;

update public.disciples set username = null where btrim(coalesce(username, '')) = '';
grant select, insert, update on public.disciples to authenticated;
create unique index if not exists disciples_username_lower_unique
  on public.disciples (lower(username)) where username is not null;

create table if not exists public.sect_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null default '',
  sect_title text not null default 'Ngoại Môn Đệ Tử',
  content text not null check (char_length(content) between 1 and 800),
  parent_id uuid references public.sect_comments(id) on delete cascade,
  is_pinned boolean not null default false,
  is_owner boolean not null default false,
  rewarded_stones integer not null default 0 check (rewarded_stones >= 0),
  created_at timestamptz not null default now()
);

create index if not exists sect_comments_roots_order_idx
  on public.sect_comments (is_pinned desc, created_at desc) where parent_id is null;
create index if not exists sect_comments_parent_order_idx
  on public.sect_comments (parent_id, created_at);

create table if not exists public.sect_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  full_name text not null default '',
  sender_role text not null check (sender_role in ('disciple', 'owner')),
  content text not null check (char_length(content) between 1 and 1200),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists sect_messages_conversation_idx
  on public.sect_messages (user_id, created_at);
create index if not exists sect_messages_unread_idx
  on public.sect_messages (is_read, created_at) where sender_role = 'disciple';

create table if not exists public.sect_spirit_stone_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  claim_key text not null,
  amount integer not null check (amount > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, claim_key)
);
alter table public.sect_spirit_stone_events enable row level security;

create or replace function public.is_sect_owner()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'phamnguyenhaithanh4@gmail.com';
$$;

create or replace function public.guard_disciple_self_updates()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  metadata jsonb := coalesce(auth.jwt() -> 'user_metadata', '{}'::jsonb);
begin
  if public.is_sect_owner() then
    return new;
  end if;
  if current_setting('app.allow_spirit_wallet_write', true) = 'on' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.email := coalesce(auth.jwt() ->> 'email', new.email);
    new.username := nullif(lower(btrim(coalesce(new.username, metadata ->> 'username', ''))), '');
    new.sect_title := 'Ngoại Môn Đệ Tử';
    new.is_banned := false;
    new.spirit_stones := case
      when coalesce(metadata ->> 'starting_spirit_stones', '') ~ '^[0-9]+$'
        then greatest(0, least(20, (metadata ->> 'starting_spirit_stones')::integer))
      else 0
    end;
    new.unlocked_frames := '["jade"]'::jsonb;
    new.active_frame := 'jade';
    new.quiz_best_score := 0;
    new.quiz_max_combo := 0;
    new.visit_count := greatest(1, least(coalesce(new.visit_count, 1), 1));
    return new;
  end if;

  new.user_id := old.user_id;
  new.email := coalesce(auth.jwt() ->> 'email', old.email);
  new.sect_title := old.sect_title;
  new.is_banned := old.is_banned;
  new.spirit_stones := old.spirit_stones;
  new.unlocked_frames := old.unlocked_frames;
  if not (coalesce(old.unlocked_frames, '["jade"]'::jsonb) ? coalesce(new.active_frame, 'jade')) then
    new.active_frame := old.active_frame;
  end if;
  new.username := old.username;
  new.quiz_best_score := greatest(coalesce(old.quiz_best_score, 0), coalesce(new.quiz_best_score, 0));
  new.quiz_max_combo := greatest(coalesce(old.quiz_max_combo, 0), coalesce(new.quiz_max_combo, 0));
  new.visit_count := greatest(coalesce(old.visit_count, 0), least(coalesce(new.visit_count, 0), coalesce(old.visit_count, 0) + 1));
  return new;
end;
$$;

drop trigger if exists disciples_guard_self_updates on public.disciples;
create trigger disciples_guard_self_updates
before insert or update on public.disciples
for each row execute function public.guard_disciple_self_updates();

alter table public.disciples enable row level security;
drop policy if exists disciples_sect_self_or_owner_select on public.disciples;
create policy disciples_sect_self_or_owner_select on public.disciples
for select to authenticated
using (user_id = auth.uid() or public.is_sect_owner());
drop policy if exists disciples_sect_self_or_owner_insert on public.disciples;
create policy disciples_sect_self_or_owner_insert on public.disciples
for insert to authenticated
with check (user_id = auth.uid() or public.is_sect_owner());
drop policy if exists disciples_sect_self_or_owner_update on public.disciples;
create policy disciples_sect_self_or_owner_update on public.disciples
for update to authenticated
using (user_id = auth.uid() or public.is_sect_owner())
with check (user_id = auth.uid() or public.is_sect_owner());

create or replace view public.sect_public_disciples
with (security_invoker = false)
as
select user_id, full_name, sect_title, avatar_url, active_frame,
       quiz_best_score, quiz_max_combo,
       lower(coalesce(email, '')) = 'phamnguyenhaithanh4@gmail.com' as is_owner
from public.disciples;
grant select on public.sect_public_disciples to anon, authenticated;

create or replace function public.is_disciple_username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select p_username ~ '^[a-zA-Z0-9_]{3,20}$'
    and not exists (
      select 1 from public.disciples d where lower(d.username) = lower(p_username)
    );
$$;
grant execute on function public.is_disciple_username_available(text) to anon, authenticated;

create or replace function public.lookup_disciple_login_email(p_username text)
returns text
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select d.email
  from public.disciples d
  where p_username ~ '^[a-zA-Z0-9_]{3,20}$'
    and lower(d.username) = lower(p_username)
  limit 1;
$$;
grant execute on function public.lookup_disciple_login_email(text) to anon, authenticated;

create or replace function public.earn_quiz_spirit_stones(p_amount integer, p_claim_key text)
returns integer
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  earned_today integer;
begin
  if auth.uid() is null or p_amount <> 5 or length(coalesce(p_claim_key, '')) not between 1 and 100 then
    raise exception 'Yêu cầu nhận Linh Thạch không hợp lệ.';
  end if;
  select coalesce(sum(amount), 0)::integer into earned_today
  from public.sect_spirit_stone_events
  where user_id = auth.uid() and created_at >= date_trunc('day', now());
  if earned_today >= 300 then
    raise exception 'Đạo hữu đã đạt giới hạn Linh Thạch nhận từ Đố Vui trong hôm nay.';
  end if;
  insert into public.sect_spirit_stone_events(user_id, claim_key, amount)
  values (auth.uid(), p_claim_key, p_amount)
  on conflict do nothing;
  if not found then
    return 0;
  end if;
  perform set_config('app.allow_spirit_wallet_write', 'on', true);
  update public.disciples
  set spirit_stones = spirit_stones + p_amount
  where user_id = auth.uid();
  if not found then
    raise exception 'Chưa tìm thấy hồ sơ môn đồ để cộng Linh Thạch.';
  end if;
  return p_amount;
end;
$$;
revoke all on function public.earn_quiz_spirit_stones(integer, text) from public, anon;
grant execute on function public.earn_quiz_spirit_stones(integer, text) to authenticated;

create or replace function public.purchase_disciple_frame(p_frame text)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  price integer;
begin
  if auth.uid() is null then raise exception 'Đạo hữu cần đăng nhập.'; end if;
  price := case p_frame when 'dragon' then 30 when 'phoenix' then 60 when 'thunder' then 100 when 'lotus' then 180 else null end;
  if price is null then raise exception 'Pháp bảo khung viền không hợp lệ.'; end if;
  perform set_config('app.allow_spirit_wallet_write', 'on', true);
  update public.disciples
  set spirit_stones = spirit_stones - price,
      unlocked_frames = case
        when unlocked_frames ? p_frame then unlocked_frames
        else unlocked_frames || jsonb_build_array(p_frame)
      end,
      active_frame = p_frame
  where user_id = auth.uid()
    and spirit_stones >= price
    and not (unlocked_frames ? p_frame);
  if not found then
    raise exception 'Không đủ Linh Thạch hoặc chưa có hồ sơ môn đồ.';
  end if;
end;
$$;
revoke all on function public.purchase_disciple_frame(text) from public, anon;
grant execute on function public.purchase_disciple_frame(text) to authenticated;

create or replace function public.equip_disciple_frame(p_frame text)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'Đạo hữu cần đăng nhập.'; end if;
  update public.disciples
  set active_frame = p_frame
  where user_id = auth.uid() and unlocked_frames ? p_frame;
  if not found then raise exception 'Khung viền này chưa được mở khóa.'; end if;
end;
$$;
revoke all on function public.equip_disciple_frame(text) from public, anon;
grant execute on function public.equip_disciple_frame(text) to authenticated;

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
  if p_amount not in (10, 30, 50, 100) then raise exception 'Mức thưởng không hợp lệ.'; end if;
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
revoke all on function public.admin_reward_sect_comment(uuid, integer) from public, anon;
grant execute on function public.admin_reward_sect_comment(uuid, integer) to authenticated;

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

create or replace function public.fill_sect_comment_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_sect_owner() then
    new.user_id := auth.uid();
    new.is_owner := false;
    new.is_pinned := false;
    new.rewarded_stones := 0;
    select coalesce(d.full_name, ''), coalesce(d.sect_title, 'Ngoại Môn Đệ Tử')
    into new.full_name, new.sect_title
    from public.disciples d where d.user_id = auth.uid();
  else
    new.is_owner := true;
  end if;
  return new;
end;
$$;
drop trigger if exists sect_comments_fill_profile on public.sect_comments;
create trigger sect_comments_fill_profile
before insert on public.sect_comments
for each row execute function public.fill_sect_comment_profile();

create or replace function public.guard_sect_message_insert()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  new.is_read := false;
  if public.is_sect_owner() then
    new.sender_role := 'owner';
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
drop trigger if exists sect_messages_guard_insert on public.sect_messages;
create trigger sect_messages_guard_insert
before insert on public.sect_messages
for each row execute function public.guard_sect_message_insert();

alter table public.sect_messages enable row level security;
drop policy if exists sect_messages_conversation_select on public.sect_messages;
create policy sect_messages_conversation_select on public.sect_messages
for select to authenticated
using (user_id = auth.uid() or public.is_sect_owner());
drop policy if exists sect_messages_conversation_insert on public.sect_messages;
create policy sect_messages_conversation_insert on public.sect_messages
for insert to authenticated
with check (
  (public.is_sect_owner() and sender_role = 'owner')
  or (
    user_id = auth.uid()
    and sender_role = 'disciple'
    and lower(user_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);
drop policy if exists sect_messages_owner_update on public.sect_messages;
create policy sect_messages_owner_update on public.sect_messages
for update to authenticated using (public.is_sect_owner()) with check (public.is_sect_owner());
drop policy if exists sect_messages_owner_delete on public.sect_messages;
create policy sect_messages_owner_delete on public.sect_messages
for delete to authenticated using (public.is_sect_owner());

grant select, insert, update, delete on public.sect_comments to authenticated;
grant select on public.sect_comments to anon;
grant select, insert, update, delete on public.sect_messages to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sect_comments'
    ) then
      alter publication supabase_realtime add table public.sect_comments;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sect_messages'
    ) then
      alter publication supabase_realtime add table public.sect_messages;
    end if;
  end if;
end;
$$;

commit;
