-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- Create policies for profiles table
create policy "read profiles" on public.profiles
for select to anon, authenticated using (true);

create policy "insert own profile" on public.profiles
for insert to authenticated with check (auth.uid() = id);

create policy "update own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user(); 