-- Practice schema (safe to re-run)

do $$ begin
  create type public.question_type as enum ('mcq', 'short');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.practice_mode as enum ('chapter', 'wrong_book');
exception when duplicate_object then null;
end $$;

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  qtype public.question_type not null,
  stem text not null,
  options jsonb,
  answer text not null default '',
  explanation text not null default '',
  source_file text,
  source_page int,
  needs_review boolean not null default false,
  sort_order int not null default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  mode public.practice_mode not null default 'chapter',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  mcq_correct int not null default 0,
  mcq_total int not null default 0,
  short_marked_correct int not null default 0,
  short_total int not null default 0
);

create table if not exists public.practice_answers (
  session_id uuid not null references public.practice_sessions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  user_answer text not null default '',
  is_correct boolean,
  self_marked boolean not null default false,
  primary key (session_id, question_id)
);

create table if not exists public.wrong_book (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  wrong_count int not null default 1,
  last_wrong_at timestamptz not null default now(),
  cleared_at timestamptz,
  primary key (user_id, question_id)
);

create index if not exists questions_chapter_idx on public.questions(chapter_id, sort_order);
create index if not exists practice_sessions_user_idx on public.practice_sessions(user_id, started_at desc);
create index if not exists wrong_book_user_active_idx on public.wrong_book(user_id) where cleared_at is null;

alter table public.questions enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.practice_answers enable row level security;
alter table public.wrong_book enable row level security;

drop policy if exists questions_select on public.questions;
drop policy if exists questions_insert on public.questions;
drop policy if exists questions_update on public.questions;
drop policy if exists questions_delete on public.questions;
create policy questions_select on public.questions for select to authenticated
  using (user_id is null or user_id = auth.uid());
create policy questions_insert on public.questions for insert to authenticated
  with check (user_id = auth.uid());
create policy questions_update on public.questions for update to authenticated
  using (user_id is null or user_id = auth.uid())
  with check (user_id is null or user_id = auth.uid());
create policy questions_delete on public.questions for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists sessions_all on public.practice_sessions;
create policy sessions_all on public.practice_sessions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists answers_select on public.practice_answers;
drop policy if exists answers_insert on public.practice_answers;
drop policy if exists answers_update on public.practice_answers;
create policy answers_select on public.practice_answers for select to authenticated
  using (exists (select 1 from public.practice_sessions s where s.id = session_id and s.user_id = auth.uid()));
create policy answers_insert on public.practice_answers for insert to authenticated
  with check (exists (select 1 from public.practice_sessions s where s.id = session_id and s.user_id = auth.uid()));
create policy answers_update on public.practice_answers for update to authenticated
  using (exists (select 1 from public.practice_sessions s where s.id = session_id and s.user_id = auth.uid()));

drop policy if exists wrong_book_all on public.wrong_book;
create policy wrong_book_all on public.wrong_book for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- sanity check
select
  to_regclass('public.questions') as questions,
  to_regclass('public.practice_sessions') as practice_sessions,
  to_regclass('public.practice_answers') as practice_answers,
  to_regclass('public.wrong_book') as wrong_book;
