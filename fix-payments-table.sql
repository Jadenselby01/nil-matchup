-- Quick fix for existing payments table
-- Run this in your Supabase SQL Editor if you get the "payment_date column not found" error

-- Add payment_date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payments' AND column_name = 'payment_date') THEN
        ALTER TABLE payments ADD COLUMN payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added payment_date column to payments table';
    ELSE
        RAISE NOTICE 'payment_date column already exists';
    END IF;
END $$;

-- Update existing records to have a payment_date if they don't have one
UPDATE payments 
SET payment_date = created_at 
WHERE payment_date IS NULL;

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'payments' 
AND column_name = 'payment_date'; 