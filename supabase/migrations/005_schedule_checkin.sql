-- 005: Course schedule + daily check-ins
create table if not exists public.course_days (
  id uuid primary key default gen_random_uuid(),
  day_date date not null unique,
  phase text not null check (phase in ('foundation', 'special', 'sprint')),
  words_task text not null default '背单词 10–20 个',
  main_subject text not null check (main_subject in ('english', 'math', 'logic', 'writing')),
  main_lesson text not null,
  time_hint text,
  micro_task text not null default '整理笔记 / 复盘错题',
  subject_slug text
);

create table if not exists public.user_checkins (
  user_id uuid not null references auth.users(id) on delete cascade,
  day_date date not null,
  words boolean not null default false,
  lesson boolean not null default false,
  practice boolean not null default false,
  micro boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, day_date)
);

create index if not exists course_days_date_idx on public.course_days(day_date);
create index if not exists user_checkins_user_date_idx on public.user_checkins(user_id, day_date desc);

alter table public.course_days enable row level security;
alter table public.user_checkins enable row level security;

drop policy if exists course_days_read on public.course_days;
create policy course_days_read on public.course_days
  for select to authenticated using (true);

drop policy if exists checkins_select on public.user_checkins;
drop policy if exists checkins_insert on public.user_checkins;
drop policy if exists checkins_update on public.user_checkins;
drop policy if exists checkins_delete on public.user_checkins;

create policy checkins_select on public.user_checkins
  for select to authenticated using (user_id = auth.uid());
create policy checkins_insert on public.user_checkins
  for insert to authenticated with check (user_id = auth.uid());
create policy checkins_update on public.user_checkins
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy checkins_delete on public.user_checkins
  for delete to authenticated using (user_id = auth.uid());
