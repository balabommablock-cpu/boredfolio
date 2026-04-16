-- Bambai Bhada — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- Design: anonymous read + write with row-level security.
-- No auth required. Anti-spam via IP/time-based limits at the client layer +
-- auto-expiry (30 days) at the database layer.

-- 1) Main drops table — free-text message as source of truth,
--    structured fields auto-parsed at insert time client-side.
create table if not exists public.bambai_bhada_drops (
  id text primary key,
  kind text not null check (kind in ('listing', 'request')),
  lat double precision not null,
  lng double precision not null,
  message text not null check (char_length(message) between 10 and 500),
  bhk smallint check (bhk between 0 and 5),
  amount integer check (amount > 0 and amount < 2000),
  radius_km double precision check (radius_km between 0.5 and 20),
  instagram text,
  telegram text,
  twitter text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

-- Indexes for common queries
create index if not exists bambai_bhada_drops_kind_idx on public.bambai_bhada_drops (kind);
create index if not exists bambai_bhada_drops_created_idx on public.bambai_bhada_drops (created_at desc);
create index if not exists bambai_bhada_drops_geo_idx on public.bambai_bhada_drops (lat, lng);

-- 2) Row Level Security — anonymous insert + read, no update/delete
alter table public.bambai_bhada_drops enable row level security;

-- Anyone can read (drops are public by design)
drop policy if exists "bambai_bhada_read_all" on public.bambai_bhada_drops;
create policy "bambai_bhada_read_all"
  on public.bambai_bhada_drops
  for select
  to anon, authenticated
  using (expires_at > now());

-- Anyone can insert (anti-spam at client level for now)
drop policy if exists "bambai_bhada_insert_all" on public.bambai_bhada_drops;
create policy "bambai_bhada_insert_all"
  on public.bambai_bhada_drops
  for insert
  to anon, authenticated
  with check (
    -- Basic sanity
    lat between 18.7 and 19.5
    and lng between 72.6 and 73.3
    and char_length(message) between 10 and 500
  );

-- 3) Auto-delete expired drops (runs on read via the RLS filter above,
--    but a cleanup cron is nice-to-have)
-- Enable pg_cron if you want scheduled cleanup (Pro tier):
-- create extension if not exists pg_cron;
-- select cron.schedule('bambai_bhada_cleanup', '0 3 * * *',
--   $$ delete from public.bambai_bhada_drops where expires_at < now() $$);

-- 4) Realtime subscriptions (optional — enables live updates)
alter publication supabase_realtime add table public.bambai_bhada_drops;
