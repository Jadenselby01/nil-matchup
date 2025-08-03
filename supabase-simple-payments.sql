-- Simple Payments Table for NIL App
-- Run this in your Supabase SQL Editor

-- Create payments table without foreign key constraints first
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

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments" ON payments;
DROP POLICY IF EXISTS "Users can update their own payments" ON payments;

-- Payments RLS Policies

-- Users can view payments they're involved in
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (
        auth.uid()::text = athlete_id::text OR auth.uid()::text = business_id::text
    );

-- Users can create payments (businesses paying athletes)
CREATE POLICY "Users can create payments" ON payments
    FOR INSERT WITH CHECK (
        auth.uid()::text = business_id::text
    );

-- Users can update payments they're involved in
CREATE POLICY "Users can update their own payments" ON payments
    FOR UPDATE USING (
        auth.uid()::text = athlete_id::text OR auth.uid()::text = business_id::text
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_deal_id ON payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_payments_athlete_id ON payments(athlete_id);
CREATE INDEX IF NOT EXISTS idx_payments_business_id ON payments(business_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created successfully
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'payments' THEN '✅ Created'
        ELSE '❌ Not Created'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'payments'; 