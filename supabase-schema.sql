-- NIL Matchup Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security on all tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create athletes table
CREATE TABLE IF NOT EXISTS athletes (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sport TEXT NOT NULL,
    university TEXT NOT NULL,
    profile_img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    ad_type TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'completed', 'rejected')),
    description TEXT,
    requirements TEXT,
    duration TEXT,
    target_audience TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Athletes RLS Policies

-- Users can insert their own athlete profile
CREATE POLICY "Users can insert their own athlete profile" ON athletes
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can read their own athlete profile
CREATE POLICY "Users can read their own athlete profile" ON athletes
    FOR SELECT USING (auth.uid() = id);

-- Businesses can read athlete profiles (for deal creation)
CREATE POLICY "Businesses can read athlete profiles" ON athletes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = auth.uid()
        )
    );

-- Users can update their own athlete profile
CREATE POLICY "Users can update their own athlete profile" ON athletes
    FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own athlete profile
CREATE POLICY "Users can delete their own athlete profile" ON athletes
    FOR DELETE USING (auth.uid() = id);

-- Businesses RLS Policies

-- Users can insert their own business profile
CREATE POLICY "Users can insert their own business profile" ON businesses
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can read their own business profile
CREATE POLICY "Users can read their own business profile" ON businesses
    FOR SELECT USING (auth.uid() = id);

-- Athletes can read business profiles (for deal proposals)
CREATE POLICY "Athletes can read business profiles" ON businesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athletes 
            WHERE athletes.id = auth.uid()
        )
    );

-- Users can update their own business profile
CREATE POLICY "Users can update their own business profile" ON businesses
    FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own business profile
CREATE POLICY "Users can delete their own business profile" ON businesses
    FOR DELETE USING (auth.uid() = id);

-- Deals RLS Policies

-- Athletes can create deals (proposals to businesses)
CREATE POLICY "Athletes can create deals" ON deals
    FOR INSERT WITH CHECK (
        auth.uid() = athlete_id AND
        EXISTS (
            SELECT 1 FROM athletes 
            WHERE athletes.id = auth.uid()
        )
    );

-- Users can read deals where they are the athlete
CREATE POLICY "Users can read deals where they are the athlete" ON deals
    FOR SELECT USING (auth.uid() = athlete_id);

-- Users can read deals where they are the business
CREATE POLICY "Users can read deals where they are the business" ON deals
    FOR SELECT USING (auth.uid() = business_id);

-- Businesses can update deals they're involved in (accept/reject)
CREATE POLICY "Businesses can update deals they're involved in" ON deals
    FOR UPDATE USING (auth.uid() = business_id);

-- Athletes can update their own deals (modify proposals)
CREATE POLICY "Athletes can update their own deals" ON deals
    FOR UPDATE USING (auth.uid() = athlete_id);

-- Users can delete deals they created
CREATE POLICY "Users can delete deals they created" ON deals
    FOR DELETE USING (
        auth.uid() = athlete_id OR auth.uid() = business_id
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_athlete_id ON deals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_deals_business_id ON deals(business_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_athletes_sport ON athletes(sport);
CREATE INDEX IF NOT EXISTS idx_athletes_university ON athletes(university);
CREATE INDEX IF NOT EXISTS idx_businesses_industry ON businesses(industry);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - for testing)
-- INSERT INTO athletes (id, name, sport, university, profile_img) VALUES
--     ('00000000-0000-0000-0000-000000000001', 'John Smith', 'Basketball', 'UNC Chapel Hill', 'https://example.com/john.jpg'),
--     ('00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'Soccer', 'Duke University', 'https://example.com/sarah.jpg');

-- INSERT INTO businesses (id, company_name, industry, logo_url) VALUES
--     ('00000000-0000-0000-0000-000000000003', 'Local Sports Shop', 'Retail', 'https://example.com/shop-logo.png'),
--     ('00000000-0000-0000-0000-000000000004', 'Fitness First Gym', 'Health & Fitness', 'https://example.com/gym-logo.png'); 