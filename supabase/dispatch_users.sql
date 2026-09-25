create table if not exists public.dispatch_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null default '',
  password_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.dispatch_users enable row level security;
