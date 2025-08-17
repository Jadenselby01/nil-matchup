-- Create user_profiles table for NIL Matchup
-- This table stores extended user information beyond Supabase auth

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('athlete', 'business')),
  
  -- Basic user info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  
  -- Athlete-specific fields
  sport TEXT,
  university TEXT,
  
  -- Business-specific fields
  company_name TEXT,
  company_type TEXT,
  
  -- Profile info
  bio TEXT,
  profile_image_url TEXT,
  social_media_links JSONB,
  
  -- Verification status
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_sport ON user_profiles(sport);
CREATE INDEX IF NOT EXISTS idx_user_profiles_university ON user_profiles(university);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_type ON user_profiles(company_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Public profiles can be viewed by anyone (for discovery)
CREATE POLICY "Public profiles are viewable by all" ON user_profiles
  FOR SELECT USING (is_verified = TRUE);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO user_profiles (id, email, user_type, first_name, last_name, sport, university, is_verified)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000001', 'athlete@test.com', 'athlete', 'John', 'Doe', 'Basketball', 'UNC Chapel Hill', true),
--   ('00000000-0000-0000-0000-000000000002', 'business@test.com', 'business', 'Jane', 'Smith', NULL, NULL, true);

-- Grant necessary permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon; 