-- Production Database Schema for NIL Matchup
-- Run this in Supabase SQL Editor

-- Enable required extensions
create extension if not exists pgcrypto;

-- Profiles table (replaces user_profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text check (role in ('athlete','business','admin')) default 'athlete',
  created_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Deals table (replaces existing deals)
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  athlete_id uuid references public.profiles(id),
  business_id uuid references public.profiles(id),
  title text not null,
  description text,
  amount_cents integer check (amount_cents >= 0),
  status text check (status in ('draft','open','in_progress','completed','canceled')) default 'open',
  created_at timestamp with time zone default now()
);

-- Enable RLS on deals
alter table public.deals enable row level security;

-- Payments table (replaces existing payments)
create table if not exists public.payments (
  id text primary key, -- Stripe PaymentIntent id
  deal_id uuid not null references public.deals(id) on delete cascade,
  amount_cents integer not null,
  currency text default 'usd',
  status text check (status in ('requires_payment_method','processing','succeeded','canceled','failed')) default 'processing',
  created_at timestamp with time zone default now()
);

-- Enable RLS on payments
alter table public.payments enable row level security;

-- RLS Policies

-- Profiles: user can read/update their own row
create policy "read own profile" on public.profiles
  for select using ( auth.uid() = id );

create policy "update own profile" on public.profiles
  for update using ( auth.uid() = id );

-- Deals: creator can do everything, others read only if they are party to the deal
create policy "insert own deals" on public.deals
  for insert with check ( auth.uid() = created_by );

create policy "read own/party deals" on public.deals
  for select using ( 
    auth.uid() = created_by or 
    auth.uid() = athlete_id or 
    auth.uid() = business_id 
  );

create policy "update own deals" on public.deals
  for update using ( auth.uid() = created_by );

-- Payments: readable if related to a deal the user can see; insert via service role only
create policy "read payments via related deals" on public.payments
  for select using (
    exists (
      select 1
      from public.deals d
      where d.id = payments.deal_id
      and (
        auth.uid() = d.created_by or 
        auth.uid() = d.athlete_id or 
        auth.uid() = d.business_id
      )
    )
  );

-- Do NOT create insert/update policies; webhook uses service role to write

-- Indexes for performance
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_deals_created_by on public.deals(created_by);
create index if not exists idx_deals_status on public.deals(status);
create index if not exists idx_payments_deal_id on public.payments(deal_id);
create index if not exists idx_payments_status on public.payments(status);

-- Insert default admin profile if needed (optional)
-- insert into public.profiles (id, email, full_name, role) 
-- values ('your-admin-user-id', 'admin@nilmatchup.com', 'Admin User', 'admin')
-- on conflict (id) do nothing; 