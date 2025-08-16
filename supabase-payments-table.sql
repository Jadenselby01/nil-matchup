-- Payments Table for NIL App
-- Run this in your Supabase SQL Editor

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled')),
    payment_method TEXT,
    payment_method_details JSONB,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
        auth.uid() = athlete_id OR auth.uid() = business_id
    );

-- Users can create payments (businesses paying athletes)
CREATE POLICY "Users can create payments" ON payments
    FOR INSERT WITH CHECK (
        auth.uid() = business_id AND
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = auth.uid()
        )
    );

-- Users can update payments they're involved in
CREATE POLICY "Users can update their own payments" ON payments
    FOR UPDATE USING (
        auth.uid() = athlete_id OR auth.uid() = business_id
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_deal_id ON payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_payments_athlete_id ON payments(athlete_id);
CREATE INDEX IF NOT EXISTS idx_payments_business_id ON payments(business_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add payment_completed_at column to deals table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'payment_completed_at') THEN
        ALTER TABLE deals ADD COLUMN payment_completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create function to update deal status when payment is completed
CREATE OR REPLACE FUNCTION update_deal_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'succeeded' AND OLD.status != 'succeeded' THEN
        UPDATE deals 
        SET 
            status = 'completed',
            payment_completed_at = NOW()
        WHERE id = NEW.deal_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update deal status
DROP TRIGGER IF EXISTS trigger_update_deal_on_payment ON payments;
CREATE TRIGGER trigger_update_deal_on_payment
    AFTER UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_deal_on_payment();

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