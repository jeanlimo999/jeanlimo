-- Jean Limo — run once in Supabase → SQL Editor → Run
-- Turns on Row Level Security and removes anon/authenticated table rights.
-- The website keeps working because Netlify uses the service role key (bypasses RLS).

do $$
declare
  t text;
begin
  for t in
    select format('%I.%I', n.nspname, c.relname)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and c.relname not like 'pg_%'
  loop
    execute 'alter table ' || t || ' enable row level security';
    execute 'alter table ' || t || ' force row level security';
    execute 'revoke all on table ' || t || ' from anon, authenticated, public';
  end loop;
end $$;

revoke all on all tables in schema public from anon, authenticated, public;
revoke all on all sequences in schema public from anon, authenticated, public;
revoke all on all functions in schema public from anon, authenticated, public;
alter default privileges in schema public revoke all on tables from anon, authenticated, public;

-- Known app tables (safe if they already have RLS)
alter table if exists public.clients enable row level security;
alter table if exists public.client_addresses enable row level security;
alter table if exists public.drivers enable row level security;
alter table if exists public.bookings enable row level security;
alter table if exists public.booking_requests enable row level security;
alter table if exists public.gps_pings enable row level security;
alter table if exists public.dispatch_users enable row level security;

-- No policies for anon = nobody can read/write these tables with the public key.
-- Service role (jeanlimo.com API) is unaffected.
