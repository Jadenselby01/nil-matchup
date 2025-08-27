-- === COMPLETE DATABASE SETUP FOR NIL MATCHUP ===
-- Run this in Supabase SQL Editor to ensure proper table structure and RLS policies

-- === PROFILES TABLE ===
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text check (role in ('athlete','business')) not null default 'athlete',
  display_name text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- === RLS POLICIES ===
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
for update using (auth.uid() = id);

-- === GRANTS ===
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;

-- === END === 