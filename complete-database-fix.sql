-- Complete Database Fix for NIL Matchup
-- Run this in your Supabase SQL Editor to fix all issues

-- === STEP 1: FIX PROFILES TABLE ===
-- Add missing columns if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'athlete';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- === STEP 2: UPDATE EXISTING PROFILES ===
-- Set default values for existing profiles
UPDATE public.profiles 
SET role = 'athlete' 
WHERE role IS NULL;

UPDATE public.profiles 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- === STEP 3: ADD CONSTRAINTS ===
-- Add role constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('athlete', 'business', 'admin'));

-- === STEP 4: ENABLE RLS AND SET POLICIES ===
-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Create new policies
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

-- === STEP 5: CREATE AUTH TRIGGER ===
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

-- === STEP 6: GRANT PERMISSIONS ===
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- === STEP 7: VERIFY FIXES ===
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

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Show sample data
SELECT id, role, created_at FROM public.profiles LIMIT 5; 