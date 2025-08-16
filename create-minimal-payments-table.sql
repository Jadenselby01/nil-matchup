-- Minimal Payments Table - Run this in Supabase SQL Editor
-- This creates a basic payments table that will work with the current code

-- Drop existing table if it exists (WARNING: This will delete all existing payment data)
DROP TABLE IF EXISTS payments CASCADE;

-- Create minimal payments table with only essential columns
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create basic policy for now
CREATE POLICY "Allow all operations" ON payments
    FOR ALL USING (true);

-- Create index for performance
CREATE INDEX idx_payments_deal_id ON payments(deal_id);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Verify table was created
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'payments' THEN '✅ Created'
        ELSE '❌ Not Created'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'payments';

-- Show table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'payments' 
ORDER BY ordinal_position; 