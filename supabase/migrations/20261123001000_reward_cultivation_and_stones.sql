begin;

create or replace function public.reward_cultivation_and_stones(
  p_points integer,
  p_stones integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_disciple public.disciples%rowtype;
  v_tu_vi integer;
  v_spirit_stones integer;
  v_earned_today integer;
begin
  if v_user_id is null then
    raise exception 'Đạo hữu cần đăng nhập để nhận phần thưởng.';
  end if;
  if p_points is null or p_stones is null
     or p_points not between 1 and 35
     or p_stones <> p_points then
    raise exception 'Phần thưởng Tu Vi và Linh Thạch không hợp lệ.';
  end if;

  select * into v_disciple
  from public.disciples
  where user_id = v_user_id
  for update;
  if not found then
    raise exception 'Chưa tìm thấy hồ sơ môn đồ để cộng phần thưởng.';
  end if;

  if public.is_sect_owner() then
    return jsonb_build_object(
      'tu_vi', 99999,
      'spirit_stones', v_disciple.spirit_stones
    );
  end if;

  select coalesce(sum(amount), 0)::integer into v_earned_today
  from public.sect_spirit_stone_events
  where user_id = v_user_id
    and created_at >= date_trunc('day', now());
  if v_earned_today + p_stones > 300 then
    raise exception 'Đạo hữu đã đạt giới hạn 300 Linh Thạch nhận thưởng trong hôm nay.';
  end if;

  insert into public.sect_spirit_stone_events(user_id, claim_key, amount)
  values (v_user_id, 'cultivation:' || gen_random_uuid()::text, p_stones);

  update public.user_cultivation
  set tu_vi = greatest(10, coalesce(tu_vi, 10)) + p_points,
      updated_at = now()
  where user_id = v_user_id
  returning tu_vi into v_tu_vi;
  if not found then
    raise exception 'Chưa tìm thấy hồ sơ Tu Vi để cộng phần thưởng.';
  end if;

  perform set_config('app.allow_spirit_wallet_write', 'on', true);
  update public.disciples
  set spirit_stones = spirit_stones + p_stones
  where user_id = v_user_id
  returning spirit_stones into v_spirit_stones;

  return jsonb_build_object(
    'tu_vi', v_tu_vi,
    'spirit_stones', v_spirit_stones
  );
end;
$$;

revoke all on function public.reward_cultivation_and_stones(integer, integer) from public, anon;
grant execute on function public.reward_cultivation_and_stones(integer, integer) to authenticated;
revoke all on function public.earn_quiz_spirit_stones(integer, text) from public, anon, authenticated;

commit;
