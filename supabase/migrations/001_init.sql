-- Phase 1 schema for ZJU MEM prep notes library
create type public.mastery as enum ('unlearned', 'fuzzy', 'mastered');

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  parent_id uuid references public.chapters(id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  user_id uuid references auth.users(id) on delete cascade
);

create table public.knowledge_points (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  body_md text not null default '',
  sort_order int not null default 0,
  user_id uuid references auth.users(id) on delete cascade,
  source_template_id uuid references public.knowledge_points(id) on delete set null
);

create table public.user_point_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  knowledge_point_id uuid not null references public.knowledge_points(id) on delete cascade,
  mastery public.mastery not null default 'unlearned',
  starred boolean not null default false,
  body_override_md text,
  title_override text,
  updated_at timestamptz not null default now(),
  primary key (user_id, knowledge_point_id)
);

create index chapters_subject_idx on public.chapters(subject_id);
create index points_chapter_idx on public.knowledge_points(chapter_id);
create index ups_user_updated_idx on public.user_point_state(user_id, updated_at desc);

alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.knowledge_points enable row level security;
alter table public.user_point_state enable row level security;

create policy subjects_read on public.subjects for select to authenticated using (true);

create policy chapters_read on public.chapters for select to authenticated
  using (user_id is null or user_id = auth.uid());
create policy chapters_insert on public.chapters for insert to authenticated
  with check (user_id = auth.uid());
create policy chapters_update on public.chapters for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy chapters_delete on public.chapters for delete to authenticated
  using (user_id = auth.uid());

create policy points_read on public.knowledge_points for select to authenticated
  using (user_id is null or user_id = auth.uid());
create policy points_insert on public.knowledge_points for insert to authenticated
  with check (user_id = auth.uid());
create policy points_update on public.knowledge_points for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy points_delete on public.knowledge_points for delete to authenticated
  using (user_id = auth.uid());

create policy ups_select on public.user_point_state for select to authenticated
  using (user_id = auth.uid());
create policy ups_insert on public.user_point_state for insert to authenticated
  with check (user_id = auth.uid());
create policy ups_update on public.user_point_state for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy ups_delete on public.user_point_state for delete to authenticated
  using (user_id = auth.uid());
