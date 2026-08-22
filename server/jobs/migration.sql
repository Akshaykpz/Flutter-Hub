-- ============================================================
-- FlutterHub Job Board — Supabase Database Migration
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yseyqbiiptripgjuoiyh/sql
-- ============================================================

-- 1. Flutter Jobs Table
create table if not exists flutter_jobs (
  id              uuid primary key default gen_random_uuid(),
  source_id       text not null,
  external_id     text not null,
  company         text not null,
  company_logo    text,
  title           text not null,
  location        text,
  remote_type     text check (remote_type in ('remote','hybrid','onsite')),
  region          text check (region in ('india','usa','europe','worldwide','apac')),
  level           text check (level in ('junior','mid','senior','lead')),
  salary_min      bigint,
  salary_max      bigint,
  salary_currency text,
  employment_type text check (employment_type in ('full-time','contract','part-time','internship')),
  skills          text[],
  description     text,
  apply_url       text not null,
  source_name     text not null,
  posted_at       timestamptz,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  constraint flutter_jobs_source_external_unique unique (source_id, external_id)
);

-- 2. Indexes
create index if not exists idx_flutter_jobs_active_posted
  on flutter_jobs(is_active, posted_at desc);

create index if not exists idx_flutter_jobs_source_id
  on flutter_jobs(source_id);

create index if not exists idx_flutter_jobs_remote_type
  on flutter_jobs(remote_type);

create index if not exists idx_flutter_jobs_region
  on flutter_jobs(region);

create index if not exists idx_flutter_jobs_level
  on flutter_jobs(level);

-- 3. Auto-update updated_at trigger
create or replace function update_flutter_jobs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_flutter_jobs_updated_at on flutter_jobs;
create trigger trg_flutter_jobs_updated_at
  before update on flutter_jobs
  for each row
  execute function update_flutter_jobs_updated_at();

-- 4. Sync Log Table
create table if not exists job_sync_log (
  id           uuid primary key default gen_random_uuid(),
  synced_at    timestamptz default now(),
  source_id    text,
  new_jobs     integer default 0,
  updated_jobs integer default 0,
  expired_jobs integer default 0,
  failed       boolean default false,
  error_msg    text,
  duration_ms  integer
);

create index if not exists idx_job_sync_log_synced_at
  on job_sync_log(synced_at desc);

-- 5. Enable Row Level Security (read-only public access for flutter_jobs)
alter table flutter_jobs enable row level security;
alter table job_sync_log enable row level security;

-- Allow public read of active jobs
create policy if not exists "Public can read active jobs"
  on flutter_jobs for select
  using (is_active = true);

-- Allow service role full access (used by backend via SUPABASE_SECRET_KEY)
create policy if not exists "Service role full access to flutter_jobs"
  on flutter_jobs for all
  using (true)
  with check (true);

create policy if not exists "Service role full access to sync_log"
  on job_sync_log for all
  using (true)
  with check (true);

-- Done!
select 'Migration complete: flutter_jobs + job_sync_log tables ready.' as status;
