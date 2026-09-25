-- =============================================================================
-- Jean Limo LLC — paste this entire file into Supabase → SQL Editor → Run
-- Website customer accounts + bookings + chauffeurs
-- Safe to re-run (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
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

create table if not exists public.drivers (
  id          text primary key default ('d_' || substr(gen_random_uuid()::text, 1, 8)),
  name        text not null,
  phone       text not null default '',
  pin         text not null default '',
  vehicle     text not null default 'sedan',
  active      boolean not null default true,
  last_lat    double precision,
  last_lng    double precision,
  last_gps_at timestamptz,
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
  assigned_driver_id    text references public.drivers(id) on delete set null,
  trip_status           text not null default 'confirmed',
  live_leg              text not null default 'outbound',
  last_lat              double precision,
  last_lng              double precision,
  last_gps_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.bookings add column if not exists assigned_driver_id text;
alter table public.bookings add column if not exists trip_status text not null default 'confirmed';
alter table public.bookings add column if not exists live_leg text not null default 'outbound';
alter table public.bookings add column if not exists last_lat double precision;
alter table public.bookings add column if not exists last_lng double precision;
alter table public.bookings add column if not exists last_gps_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_assigned_driver_id_fkey'
  ) then
    alter table public.bookings
      add constraint bookings_assigned_driver_id_fkey
      foreign key (assigned_driver_id) references public.drivers(id) on delete set null;
  end if;
end $$;

create index if not exists bookings_client_idx on public.bookings (client_id, ride_date desc);
create index if not exists bookings_driver_idx on public.bookings (assigned_driver_id);

create table if not exists public.booking_requests (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references public.bookings(id) on delete cascade,
  kind        text not null,
  payload     jsonb not null default '{}'::jsonb,
  status      text not null default 'open',
  created_at  timestamptz not null default now()
);

create table if not exists public.gps_pings (
  id          uuid primary key default gen_random_uuid(),
  driver_id   text,
  booking_id  uuid,
  lat         double precision,
  lng         double precision,
  created_at  timestamptz not null default now()
);

alter table public.clients enable row level security;
alter table public.client_addresses enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_requests enable row level security;
alter table public.drivers enable row level security;
alter table public.gps_pings enable row level security;

insert into public.drivers (id, name, phone, pin, vehicle, active)
values
  ('d_cash', 'Cash', '2819170085', '1111', 'sedan', true),
  ('d_jeannie', 'Jeannie', '2819170929', '2222', 'sedan', true)
on conflict (id) do nothing;
