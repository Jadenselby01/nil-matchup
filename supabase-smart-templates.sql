-- Smart Templates Table for NIL App
-- Run this in your Supabase SQL Editor after the main schema

-- Create smart_templates table
CREATE TABLE IF NOT EXISTS smart_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    duration TEXT NOT NULL,
    target_audience TEXT,
    specific_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE smart_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Businesses can create their own templates" ON smart_templates;
DROP POLICY IF EXISTS "Businesses can read their own templates" ON smart_templates;
DROP POLICY IF EXISTS "Athletes can read business templates" ON smart_templates;
DROP POLICY IF EXISTS "Businesses can update their own templates" ON smart_templates;
DROP POLICY IF EXISTS "Businesses can delete their own templates" ON smart_templates;

-- Smart Templates RLS Policies

-- Businesses can create their own templates
CREATE POLICY "Businesses can create their own templates" ON smart_templates
    FOR INSERT WITH CHECK (
        auth.uid() = business_id AND
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = auth.uid()
        )
    );

-- Businesses can read their own templates
CREATE POLICY "Businesses can read their own templates" ON smart_templates
    FOR SELECT USING (auth.uid() = business_id);

-- Athletes can read business templates (for deal proposals)
CREATE POLICY "Athletes can read business templates" ON smart_templates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athletes 
            WHERE athletes.id = auth.uid()
        )
    );

-- Businesses can update their own templates
CREATE POLICY "Businesses can update their own templates" ON smart_templates
    FOR UPDATE USING (auth.uid() = business_id);

-- Businesses can delete their own templates
CREATE POLICY "Businesses can delete their own templates" ON smart_templates
    FOR DELETE USING (auth.uid() = business_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_smart_templates_business_id ON smart_templates(business_id);
CREATE INDEX IF NOT EXISTS idx_smart_templates_category ON smart_templates(category);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_smart_templates_updated_at ON smart_templates;
CREATE TRIGGER update_smart_templates_updated_at BEFORE UPDATE ON smart_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created successfully
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'smart_templates' THEN '✅ Created'
        ELSE '❌ Not Created'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'smart_templates'; 