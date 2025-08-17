-- Create deals table for NIL Matchup
-- This table stores NIL opportunities created by businesses for athletes

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Business information
  business_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  
  -- Deal details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'social_media', 'content_creation', 'product_review', 
    'event_promotion', 'brand_campaign', 'ambassador', 
    'appearance', 'other'
  )),
  
  -- Budget information
  budget_min DECIMAL(10,2) NOT NULL,
  budget_max DECIMAL(10,2) NOT NULL,
  budget_currency TEXT DEFAULT 'USD',
  
  -- Requirements and deliverables
  deliverables TEXT NOT NULL,
  requirements TEXT,
  deadline DATE NOT NULL,
  
  -- Location and remote work
  location TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  
  -- Athlete preferences
  athlete_preferences JSONB DEFAULT '{}',
  
  -- Deal status and lifecycle
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
    'open', 'active', 'pending', 'completed', 'cancelled', 'expired'
  )),
  
  -- Athlete assignment (when deal is accepted)
  athlete_id UUID REFERENCES user_profiles(id),
  athlete_name TEXT,
  athlete_sport TEXT,
  
  -- Payment information
  final_amount DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'processing', 'completed', 'failed', 'refunded'
  )),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional metadata
  tags TEXT[],
  additional_info TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_business_id ON deals(business_id);
CREATE INDEX IF NOT EXISTS idx_deals_athlete_id ON deals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_budget_min ON deals(budget_min);
CREATE INDEX IF NOT EXISTS idx_deals_budget_max ON deals(budget_max);
CREATE INDEX IF NOT EXISTS idx_deals_deadline ON deals(deadline);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
CREATE INDEX IF NOT EXISTS idx_deals_location ON deals(location);
CREATE INDEX IF NOT EXISTS idx_deals_athlete_sport ON deals(athlete_sport);

-- Enable Row Level Security (RLS)
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Businesses can view and manage their own deals
CREATE POLICY "Businesses can view own deals" ON deals
  FOR SELECT USING (auth.uid() = business_id);

CREATE POLICY "Businesses can insert own deals" ON deals
  FOR INSERT WITH CHECK (auth.uid() = business_id);

CREATE POLICY "Businesses can update own deals" ON deals
  FOR UPDATE USING (auth.uid() = business_id);

-- Athletes can view deals assigned to them
CREATE POLICY "Athletes can view assigned deals" ON deals
  FOR SELECT USING (auth.uid() = athlete_id);

-- Athletes can update deals assigned to them (for status updates)
CREATE POLICY "Athletes can update assigned deals" ON deals
  FOR UPDATE USING (auth.uid() = athlete_id);

-- Public can view open deals (for discovery)
CREATE POLICY "Public can view open deals" ON deals
  FOR SELECT USING (status = 'open');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_deals_updated_at();

-- Create function to validate budget range
CREATE OR REPLACE FUNCTION validate_deal_budget()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.budget_min >= NEW.budget_max THEN
    RAISE EXCEPTION 'budget_min must be less than budget_max';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to validate budget
CREATE TRIGGER validate_deal_budget
  BEFORE INSERT OR UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION validate_deal_budget();

-- Create function to set accepted_at when athlete is assigned
CREATE OR REPLACE FUNCTION set_deal_accepted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.athlete_id IS NOT NULL AND OLD.athlete_id IS NULL THEN
    NEW.accepted_at = NOW();
    NEW.status = 'active';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to set accepted_at
CREATE TRIGGER set_deal_accepted_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION set_deal_accepted_at();

-- Grant necessary permissions
GRANT ALL ON deals TO authenticated;
GRANT SELECT ON deals TO anon;

-- Insert sample data for testing (optional)
-- INSERT INTO deals (
--   business_id,
--   business_name,
--   title,
--   description,
--   category,
--   budget_min,
--   budget_max,
--   deliverables,
--   deadline,
--   location,
--   is_remote
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000002', -- business user ID
--   'Local Sports Shop',
--   'Social Media Campaign',
--   'Promote our new sports equipment line on Instagram and TikTok',
--   'social_media',
--   500.00,
--   1000.00,
--   '3 Instagram posts, 2 TikTok videos, 5 stories',
--   '2024-03-01',
--   'Chapel Hill, NC',
--   true
-- ); 