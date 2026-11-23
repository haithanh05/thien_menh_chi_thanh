begin;

grant select (user_id)
  on table public.sect_comments
  to authenticated;

notify pgrst, 'reload schema';

commit;
