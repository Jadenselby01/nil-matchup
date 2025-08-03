-- Fix Deals Table Structure
-- Run this in your Supabase SQL Editor

-- First, let's check what columns exist in the deals table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'deals' AND table_schema = 'public';

-- Add missing columns to deals table if they don't exist
DO $$ 
BEGIN
    -- Add athlete_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'athlete_id') THEN
        ALTER TABLE deals ADD COLUMN athlete_id UUID;
    END IF;
    
    -- Add business_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'business_id') THEN
        ALTER TABLE deals ADD COLUMN business_id UUID;
    END IF;
    
    -- Add ad_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'ad_type') THEN
        ALTER TABLE deals ADD COLUMN ad_type TEXT;
    END IF;
    
    -- Add amount column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'amount') THEN
        ALTER TABLE deals ADD COLUMN amount DECIMAL(10,2);
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'status') THEN
        ALTER TABLE deals ADD COLUMN status TEXT DEFAULT 'proposed';
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'description') THEN
        ALTER TABLE deals ADD COLUMN description TEXT;
    END IF;
    
    -- Add requirements column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'requirements') THEN
        ALTER TABLE deals ADD COLUMN requirements TEXT;
    END IF;
    
    -- Add duration column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'duration') THEN
        ALTER TABLE deals ADD COLUMN duration TEXT;
    END IF;
    
    -- Add target_audience column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'target_audience') THEN
        ALTER TABLE deals ADD COLUMN target_audience TEXT;
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'created_at') THEN
        ALTER TABLE deals ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deals' AND column_name = 'updated_at') THEN
        ALTER TABLE deals ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    -- Add foreign key for athlete_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'deals_athlete_id_fkey') THEN
        ALTER TABLE deals ADD CONSTRAINT deals_athlete_id_fkey 
        FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key for business_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'deals_business_id_fkey') THEN
        ALTER TABLE deals ADD CONSTRAINT deals_business_id_fkey 
        FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Show the updated table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'deals' AND table_schema = 'public'
ORDER BY ordinal_position; 