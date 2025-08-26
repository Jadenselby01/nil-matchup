-- Complete Production Database Schema for NIL Matchup
-- Run this in your Supabase SQL Editor

-- === PROFILES TABLE ===
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'athlete',
  sport TEXT,
  university TEXT,
  company_name TEXT,
  company_type TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === DEALS TABLE ===
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed', 'cancelled')),
  business_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category TEXT,
  location TEXT,
  requirements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === PAYMENTS TABLE ===
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_intent_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  service_fee_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === MESSAGES TABLE ===
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === OFFERS TABLE ===
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === CONTRACTS TABLE ===
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'signed', 'completed', 'cancelled')),
  terms TEXT,
  w9_uploaded BOOLEAN DEFAULT FALSE,
  w9_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === NOTIFICATIONS TABLE ===
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === CONSTRAINTS ===
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check CHECK (role IN ('athlete', 'business', 'admin'));

-- === INDEXES ===
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_deals_business_id ON public.deals(business_id);
CREATE INDEX IF NOT EXISTS idx_deals_athlete_id ON public.deals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_payments_deal_id ON public.payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_payments_payer_id ON public.payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payee_id ON public.payments(payee_id);
CREATE INDEX IF NOT EXISTS idx_messages_deal_id ON public.messages(deal_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_offers_deal_id ON public.offers(deal_id);
CREATE INDEX IF NOT EXISTS idx_offers_athlete_id ON public.offers(athlete_id);
CREATE INDEX IF NOT EXISTS idx_contracts_deal_id ON public.contracts(deal_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- === ROW LEVEL SECURITY ===
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- === PROFILES POLICIES ===
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- === DEALS POLICIES ===
DROP POLICY IF EXISTS "deals_select_all" ON public.deals;
DROP POLICY IF EXISTS "deals_insert_business" ON public.deals;
DROP POLICY IF EXISTS "deals_update_owner" ON public.deals;

CREATE POLICY "deals_select_all" ON public.deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "deals_insert_business" ON public.deals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = business_id);

CREATE POLICY "deals_update_owner" ON public.deals
  FOR UPDATE TO authenticated USING (auth.uid() = business_id) WITH CHECK (auth.uid() = business_id);

-- === PAYMENTS POLICIES ===
DROP POLICY IF EXISTS "payments_select_participant" ON public.payments;
DROP POLICY IF EXISTS "payments_insert_service" ON public.payments;

CREATE POLICY "payments_select_participant" ON public.payments
  FOR SELECT TO authenticated USING (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "payments_insert_service" ON public.payments
  FOR INSERT TO service_role WITH CHECK (true);

-- === MESSAGES POLICIES ===
DROP POLICY IF EXISTS "messages_select_participant" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_sender" ON public.messages;

CREATE POLICY "messages_select_participant" ON public.messages
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "messages_insert_sender" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- === OFFERS POLICIES ===
DROP POLICY IF EXISTS "offers_select_participant" ON public.offers;
DROP POLICY IF EXISTS "offers_insert_athlete" ON public.offers;
DROP POLICY IF EXISTS "offers_update_participant" ON public.offers;

CREATE POLICY "offers_select_participant" ON public.offers
  FOR SELECT TO authenticated USING (auth.uid() = athlete_id OR auth.uid() = business_id);

CREATE POLICY "offers_insert_athlete" ON public.offers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "offers_update_participant" ON public.offers
  FOR UPDATE TO authenticated USING (auth.uid() = athlete_id OR auth.uid() = business_id);

-- === CONTRACTS POLICIES ===
DROP POLICY IF EXISTS "contracts_select_participant" ON public.contracts;
DROP POLICY IF EXISTS "contracts_insert_business" ON public.contracts;
DROP POLICY IF EXISTS "contracts_update_participant" ON public.contracts;

CREATE POLICY "contracts_select_participant" ON public.contracts
  FOR SELECT TO authenticated USING (auth.uid() = athlete_id OR auth.uid() = business_id);

CREATE POLICY "contracts_insert_business" ON public.contracts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = business_id);

CREATE POLICY "contracts_update_participant" ON public.contracts
  FOR UPDATE TO authenticated USING (auth.uid() = athlete_id OR auth.uid() = business_id);

-- === NOTIFICATIONS POLICIES ===
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_service" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;

CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_service" ON public.notifications
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- === AUTH TRIGGER ===
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'athlete'),
    COALESCE(new.raw_user_meta_data->>'display_name', new.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- === GRANTS ===
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.deals TO authenticated;
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.offers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.contracts TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;

-- === VERIFICATION ===
SELECT 'Database schema created successfully!' as status;
SELECT COUNT(*) as profiles_count FROM public.profiles;
SELECT COUNT(*) as deals_count FROM public.deals; 