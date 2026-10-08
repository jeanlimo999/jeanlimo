create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact text,
  phone text,
  email text,
  city text,
  airports text,
  vehicles text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists farm_outs (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  booking_id uuid,
  confirmation text,
  partner_id uuid,
  partner_name text,
  partner_phone text,
  partner_email text,
  pay_cents integer default 0,
  status text default 'offered',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table partners disable row level security;
alter table farm_outs disable row level security;
