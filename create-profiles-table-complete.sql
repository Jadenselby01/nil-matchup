-- Create profiles table from scratch (since it doesn't exist)
-- Run this in your Supabase SQL Editor

-- === STEP 1: CREATE PROFILES TABLE ===
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'athlete',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === STEP 2: ADD CONSTRAINTS ===
-- Add role constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('athlete', 'business', 'admin'));

-- === STEP 3: ENABLE RLS AND SET POLICIES ===
-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- === STEP 4: CREATE AUTH TRIGGER ===
-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, created_at)
  VALUES (new.id, 'athlete', NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- === STEP 5: GRANT PERMISSIONS ===
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- === STEP 6: VERIFY CREATION ===
-- Check if table was created
SELECT 
  table_name, 
  table_schema 
FROM information_schema.tables 
WHERE table_name = 'profiles';

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Show any existing data (should be empty initially)
SELECT * FROM public.profiles LIMIT 5; 