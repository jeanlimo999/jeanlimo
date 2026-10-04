-- Run once in the Supabase SQL editor.
alter table bookings add column if not exists city text not null default 'Houston';
update bookings set city = 'Houston' where city is null or city = '';
