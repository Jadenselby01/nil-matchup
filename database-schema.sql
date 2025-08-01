-- NIL App Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('athlete', 'business')),
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_completed BOOLEAN DEFAULT FALSE,
    legal_documents_completed BOOLEAN DEFAULT FALSE
);

-- Athletes table
CREATE TABLE athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sport TEXT NOT NULL,
    university TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 16),
    bio TEXT,
    profile_image_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    tiktok_url TEXT,
    linkedin_url TEXT,
    location TEXT,
    gpa DECIMAL(3,2),
    academic_year TEXT,
    team_position TEXT,
    achievements TEXT[],
    interests TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    profile_image_url TEXT,
    website_url TEXT,
    location TEXT NOT NULL,
    partnership_type TEXT,
    budget_range TEXT,
    requirements TEXT,
    industry TEXT,
    company_size TEXT,
    founded_year INTEGER,
    social_media_handles JSONB,
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT NOT NULL,
    payment_amount INTEGER NOT NULL CHECK (payment_amount > 0),
    service_fee INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'agreed', 'in_progress', 'post_uploaded', 'verified', 'paid', 'canceled', 'disputed')),
    deal_date DATE,
    deadline DATE,
    post_url TEXT,
    post_proof_url TEXT,
    payment_intent_id TEXT,
    transfer_id TEXT,
    is_payment_secured BOOLEAN DEFAULT FALSE,
    is_payment_released BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    file_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('business_payment', 'athlete_payout', 'refund')),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    payment_intent_id TEXT,
    transfer_id TEXT,
    refund_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal documents table
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('nil_agreement', 'publicity_release', 'contractor_agreement', 'w9_form', 'business_terms', 'parental_consent')),
    document_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    signature_data JSONB,
    ip_address INET,
    user_agent TEXT,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('deal_update', 'payment', 'message', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (for NIL content)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'twitter', 'tiktok', 'linkedin', 'youtube', 'other')),
    post_url TEXT NOT NULL,
    post_content TEXT,
    post_image_url TEXT,
    engagement_metrics JSONB,
    ftc_disclosure TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes table
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    initiator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
    resolution TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    evidence_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_athletes_user_id ON athletes(user_id);
CREATE INDEX idx_athletes_sport ON athletes(sport);
CREATE INDEX idx_athletes_university ON athletes(university);
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_type ON businesses(type);
CREATE INDEX idx_businesses_location ON businesses(location);
CREATE INDEX idx_deals_athlete_id ON deals(athlete_id);
CREATE INDEX idx_deals_business_id ON deals(business_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_created_at ON deals(created_at);
CREATE INDEX idx_messages_deal_id ON messages(deal_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_payments_deal_id ON payments(deal_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_legal_documents_user_id ON legal_documents(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_posts_deal_id ON posts(deal_id);
CREATE INDEX idx_posts_athlete_id ON posts(athlete_id);
CREATE INDEX idx_disputes_deal_id ON disputes(deal_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Athletes can only see their own data
CREATE POLICY "Athletes can view own data" ON athletes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Athletes can update own data" ON athletes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Athletes can insert own data" ON athletes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Businesses can only see their own data
CREATE POLICY "Businesses can view own data" ON businesses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Businesses can update own data" ON businesses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Businesses can insert own data" ON businesses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deals: Users can see deals they're involved in
CREATE POLICY "Users can view deals they're involved in" ON deals FOR SELECT USING (
    auth.uid() IN (
        SELECT user_id FROM athletes WHERE id = deals.athlete_id
        UNION
        SELECT user_id FROM businesses WHERE id = deals.business_id
    )
);

-- Messages: Users can see messages for deals they're involved in
CREATE POLICY "Users can view messages for their deals" ON messages FOR SELECT USING (
    auth.uid() IN (
        SELECT user_id FROM athletes WHERE id = (SELECT athlete_id FROM deals WHERE id = messages.deal_id)
        UNION
        SELECT user_id FROM businesses WHERE id = (SELECT business_id FROM deals WHERE id = messages.deal_id)
    )
);

-- Payments: Users can see their own payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Legal documents: Users can see their own documents
CREATE POLICY "Users can view own legal documents" ON legal_documents FOR SELECT USING (auth.uid() = user_id);

-- Notifications: Users can see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Posts: Users can see posts for deals they're involved in
CREATE POLICY "Users can view posts for their deals" ON posts FOR SELECT USING (
    auth.uid() IN (
        SELECT user_id FROM athletes WHERE id = posts.athlete_id
        UNION
        SELECT user_id FROM businesses WHERE id = (SELECT business_id FROM deals WHERE id = posts.deal_id)
    )
);

-- Disputes: Users can see disputes for deals they're involved in
CREATE POLICY "Users can view disputes for their deals" ON disputes FOR SELECT USING (
    auth.uid() IN (
        SELECT user_id FROM athletes WHERE id = (SELECT athlete_id FROM deals WHERE id = disputes.deal_id)
        UNION
        SELECT user_id FROM businesses WHERE id = (SELECT business_id FROM deals WHERE id = disputes.deal_id)
    )
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('post-proofs', 'post-proofs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('legal-documents', 'legal-documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('dispute-evidence', 'dispute-evidence', false);

-- Storage policies
CREATE POLICY "Public profile images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Authenticated users can upload profile images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile images" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public post proofs" ON storage.objects FOR SELECT USING (bucket_id = 'post-proofs');
CREATE POLICY "Authenticated users can upload post proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own legal documents" ON storage.objects FOR SELECT USING (bucket_id = 'legal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload own legal documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'legal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own dispute evidence" ON storage.objects FOR SELECT USING (bucket_id = 'dispute-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload own dispute evidence" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dispute-evidence' AND auth.uid()::text = (storage.foldername(name))[1]); 