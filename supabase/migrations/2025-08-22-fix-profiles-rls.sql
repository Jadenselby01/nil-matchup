-- === PROFILES TABLE & COLUMNS ===
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

alter table public.profiles add column if not exists full_name  text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists role       text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();

-- default + allowed values for role
alter table public.profiles alter column role set default 'athlete';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('athlete','business','admin'));

-- === GRANTS & RLS ===
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own"
on public.profiles for select to authenticated
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert to authenticated
with check (auth.uid() = id and coalesce(role,'athlete') <> 'admin');

create policy "profiles_update_own"
on public.profiles for update to authenticated
using (auth.uid() = id and coalesce(role,'athlete') <> 'admin')
with check (auth.uid() = id and coalesce(role,'athlete') <> 'admin');

-- === TRIGGER: AUTO-CREATE PROFILE ON NEW USER ===
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'athlete')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Backfill role where missing
update public.profiles set role = 'athlete' where role is null;

-- === END === 