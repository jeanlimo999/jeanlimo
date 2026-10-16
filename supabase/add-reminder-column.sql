-- Run this in Supabase SQL Editor to support 24-hour email reminders
-- Safe to run more than once

alter table public.bookings
  add column if not exists reminder_sent_at timestamptz;

create index if not exists bookings_reminder_idx
  on public.bookings (ride_date, ride_time)
  where reminder_sent_at is null and status not in ('cancelled', 'completed');
