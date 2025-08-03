-- Check and Fix Database Structure
-- Run this in your Supabase SQL Editor

-- First, let's see what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check what columns exist in the deals table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'deals' AND table_schema = 'public'
ORDER BY ordinal_position;

-- If deals table doesn't exist, create it properly
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID,
    business_id UUID,
    ad_type TEXT,
    amount DECIMAL(10,2),
    status TEXT DEFAULT 'proposed',
    description TEXT,
    requirements TEXT,
    duration TEXT,
    target_audience TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If athletes table doesn't exist, create it
CREATE TABLE IF NOT EXISTS athletes (
    id UUID PRIMARY KEY,
    name TEXT,
    sport TEXT,
    university TEXT,
    profile_img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If businesses table doesn't exist, create it
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY,
    company_name TEXT,
    industry TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now create the payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID,
    athlete_id UUID,
    business_id UUID,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled')),
    payment_method TEXT,
    payment_method_details JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Show final table structure
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('deals', 'athletes', 'businesses', 'payments') THEN '✅ Created'
        ELSE '❌ Not Created'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('deals', 'athletes', 'businesses', 'payments')
ORDER BY table_name; 