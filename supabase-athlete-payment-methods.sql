-- Athlete Payment Methods Table
-- Run this in your Supabase SQL Editor

-- Create athlete_payment_methods table
CREATE TABLE IF NOT EXISTS athlete_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL,
    stripe_payment_method_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE athlete_payment_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Athletes can manage their own payment methods" ON athlete_payment_methods;
DROP POLICY IF EXISTS "Athletes can view their own payment methods" ON athlete_payment_methods;

-- Athlete Payment Methods RLS Policies

-- Athletes can manage their own payment methods
CREATE POLICY "Athletes can manage their own payment methods" ON athlete_payment_methods
    FOR ALL USING (auth.uid()::text = athlete_id::text);

-- Athletes can view their own payment methods
CREATE POLICY "Athletes can view their own payment methods" ON athlete_payment_methods
    FOR SELECT USING (auth.uid()::text = athlete_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_athlete_payment_methods_athlete_id ON athlete_payment_methods(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_payment_methods_stripe_id ON athlete_payment_methods(stripe_payment_method_id);
CREATE INDEX IF NOT EXISTS idx_athlete_payment_methods_active ON athlete_payment_methods(is_active);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_athlete_payment_methods_updated_at ON athlete_payment_methods;
CREATE TRIGGER update_athlete_payment_methods_updated_at BEFORE UPDATE ON athlete_payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created successfully
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'athlete_payment_methods' THEN '✅ Created'
        ELSE '❌ Not Created'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'athlete_payment_methods'; 