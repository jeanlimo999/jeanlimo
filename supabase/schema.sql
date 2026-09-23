-- =============================================================================
-- Jean Limo LLC — paste this entire file into Supabase → SQL Editor → Run
-- Website customer accounts + bookings only
-- =============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  phone       text not null,
  full_name   text not null default '',
  company     text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists clients_phone_idx on public.clients (phone);

create table if not exists public.client_addresses (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  label       text not null,
  address     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  confirmation          text not null unique,
  client_id             uuid not null references public.clients(id) on delete cascade,
  status                text not null default 'confirmed',
  vehicle               text not null default 'sedan',
  trip_type             text not null default 'oneway',
  ride_date             text not null default '',
  ride_time             text not null default '',
  pickup                text not null default '',
  dropoff               text not null default '',
  flight_number         text not null default '',
  return_date           text not null default '',
  return_time           text not null default '',
  return_pickup         text not null default '',
  return_dropoff        text not null default '',
  return_flight_number  text not null default '',
  amount_cents          integer not null default 0,
  breakdown             text not null default '',
  stripe_session_id     text unique,
  passenger_notes       text not null default '',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists bookings_client_idx on public.bookings (client_id, ride_date desc);

create table if not exists public.booking_requests (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references public.bookings(id) on delete cascade,
  kind        text not null,
  payload     jsonb not null default '{}'::jsonb,
  status      text not null default 'open',
  created_at  timestamptz not null default now()
);

alter table public.clients enable row level security;
alter table public.client_addresses enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_requests enable row level security;

-- No anon policies. The Netlify app uses the service role key on the server only.
