create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile jsonb not null,
  purchase jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists assessments_user_created_at_idx
  on public.assessments (user_id, created_at desc);

alter table public.assessments enable row level security;

create policy "Users can view their own assessments"
  on public.assessments for select
  using (auth.uid() = user_id);

create policy "Users can add their own assessments"
  on public.assessments for insert
  with check (auth.uid() = user_id);
