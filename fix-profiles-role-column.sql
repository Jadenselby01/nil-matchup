-- Fix missing 'role' column in profiles table
-- Run this in your Supabase SQL Editor

-- Add missing 'role' column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'athlete';

-- Update existing profiles to have the default role
UPDATE public.profiles 
SET role = 'athlete' 
WHERE role IS NULL;

-- Add constraint to ensure role is one of the allowed values
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('athlete', 'business', 'admin'));

-- Verify the fix
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';

-- Show sample data
SELECT id, role, created_at FROM public.profiles LIMIT 5; 