-- Fixed NIL App Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create all tables without foreign key constraints
CREATE TABLE IF NOT EXISTS athletes (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    sport TEXT NOT NULL,
    university TEXT NOT NULL,
    profile_img TEXT,
    email TEXT,
    bio TEXT,
    social_media JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    logo_url TEXT,
    email TEXT,
    description TEXT,
    location TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID,
    business_id UUID,
    ad_type TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'completed', 'rejected')),
    description TEXT,
    requirements TEXT,
    duration TEXT,
    target_audience TEXT,
    payment_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS athlete_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL,
    stripe_payment_method_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS smart_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
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

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Athletes policies
CREATE POLICY "Users can manage their own athlete profile" ON athletes
    FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Businesses can view athlete profiles" ON athletes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM businesses WHERE businesses.id = auth.uid())
    );

-- Businesses policies
CREATE POLICY "Users can manage their own business profile" ON businesses
    FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Athletes can view business profiles" ON businesses
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM athletes WHERE athletes.id = auth.uid())
    );

-- Deals policies
CREATE POLICY "Users can view deals they're involved in" ON deals
    FOR SELECT USING (
        auth.uid()::text = athlete_id::text OR auth.uid()::text = business_id::text
    );

CREATE POLICY "Athletes can create deals" ON deals
    FOR INSERT WITH CHECK (
        auth.uid()::text = athlete_id::text AND
        EXISTS (SELECT 1 FROM athletes WHERE athletes.id = auth.uid())
    );

CREATE POLICY "Users can update deals they're involved in" ON deals
    FOR UPDATE USING (
        auth.uid()::text = athlete_id::text OR auth.uid()::text = business_id::text
    );

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (
        auth.uid()::text = athlete_id::text OR auth.uid()::text = business_id::text
    );

CREATE POLICY "Businesses can create payments" ON payments
    FOR INSERT WITH CHECK (
        auth.uid()::text = business_id::text AND
        EXISTS (SELECT 1 FROM businesses WHERE businesses.id = auth.uid())
    );

-- Athlete payment methods policies
CREATE POLICY "Athletes can manage their own payment methods" ON athlete_payment_methods
    FOR ALL USING (auth.uid()::text = athlete_id::text);

-- Smart templates policies
CREATE POLICY "Businesses can manage their own templates" ON smart_templates
    FOR ALL USING (auth.uid()::text = business_id::text);

CREATE POLICY "Athletes can view business templates" ON smart_templates
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM athletes WHERE athletes.id = auth.uid())
    );

-- Messages policies
CREATE POLICY "Users can view messages they're involved in" ON messages
    FOR SELECT USING (
        auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        auth.uid()::text = sender_id::text
    );

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (
        auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text
    );

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_athlete_id ON deals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_deals_business_id ON deals(business_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_payments_deal_id ON payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_payments_athlete_id ON payments(athlete_id);
CREATE INDEX IF NOT EXISTS idx_payments_business_id ON payments(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_deal_id ON messages(deal_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_smart_templates_business_id ON smart_templates(business_id);

-- 5. Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athlete_payment_methods_updated_at BEFORE UPDATE ON athlete_payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_templates_updated_at BEFORE UPDATE ON smart_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Create function to update deal status when payment is completed
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

CREATE TRIGGER trigger_update_deal_on_payment
    AFTER UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_deal_on_payment();

-- 7. Verify all tables were created
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('athletes', 'businesses', 'deals', 'payments', 'athlete_payment_methods', 'smart_templates', 'messages') THEN '✅ Created'
        ELSE '❌ Not Created'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('athletes', 'businesses', 'deals', 'payments', 'athlete_payment_methods', 'smart_templates', 'messages')
ORDER BY table_name; 