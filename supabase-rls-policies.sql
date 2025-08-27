-- === RLS POLICIES FOR NIL MATCHUP ===
-- Run this in Supabase SQL Editor to ensure proper data access control

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- === PROFILES TABLE POLICIES ===
DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
CREATE POLICY "profiles_insert_self" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_select_self" ON public.profiles;
CREATE POLICY "profiles_select_self" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles 
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- === DEALS TABLE POLICIES ===
DROP POLICY IF EXISTS "deals_select_own" ON public.deals;
CREATE POLICY "deals_select_own" ON public.deals 
FOR SELECT USING (
  auth.uid() = business_id OR 
  auth.uid() = athlete_id OR 
  status = 'open'
);

DROP POLICY IF EXISTS "deals_insert_business" ON public.deals;
CREATE POLICY "deals_insert_business" ON public.deals 
FOR INSERT WITH CHECK (auth.uid() = business_id);

DROP POLICY IF EXISTS "deals_update_owner" ON public.deals;
CREATE POLICY "deals_update_owner" ON public.deals 
FOR UPDATE USING (auth.uid() = business_id) WITH CHECK (auth.uid() = business_id);

-- === MESSAGES TABLE POLICIES ===
DROP POLICY IF EXISTS "messages_select_participant" ON public.messages;
CREATE POLICY "messages_select_participant" ON public.messages 
FOR SELECT USING (
  auth.uid() = sender_id OR 
  auth.uid() = recipient_id
);

DROP POLICY IF EXISTS "messages_insert_sender" ON public.messages;
CREATE POLICY "messages_insert_sender" ON public.messages 
FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- === PAYMENTS TABLE POLICIES ===
DROP POLICY IF EXISTS "payments_select_participant" ON public.payments;
CREATE POLICY "payments_select_participant" ON public.payments 
FOR SELECT USING (
  auth.uid() = payer_id OR 
  auth.uid() = payee_id
);

-- Service role can insert payments (for webhooks)
DROP POLICY IF EXISTS "payments_insert_service" ON public.payments;
CREATE POLICY "payments_insert_service" ON public.payments 
FOR INSERT WITH CHECK (true);

-- === OFFERS TABLE POLICIES ===
DROP POLICY IF EXISTS "offers_select_participant" ON public.offers;
CREATE POLICY "offers_select_participant" ON public.offers 
FOR SELECT USING (
  auth.uid() = business_id OR 
  auth.uid() = athlete_id
);

DROP POLICY IF EXISTS "offers_insert_business" ON public.offers;
CREATE POLICY "offers_insert_business" ON public.offers 
FOR INSERT WITH CHECK (auth.uid() = business_id);

-- === CONTRACTS TABLE POLICIES ===
DROP POLICY IF EXISTS "contracts_select_participant" ON public.contracts;
CREATE POLICY "contracts_select_participant" ON public.contracts 
FOR SELECT USING (
  auth.uid() = business_id OR 
  auth.uid() = athlete_id
);

DROP POLICY IF EXISTS "contracts_insert_business" ON public.contracts;
CREATE POLICY "contracts_insert_business" ON public.contracts 
FOR INSERT WITH CHECK (auth.uid() = business_id);

-- === NOTIFICATIONS TABLE POLICIES ===
DROP POLICY IF EXISTS "notifications_select_recipient" ON public.notifications;
CREATE POLICY "notifications_select_recipient" ON public.notifications 
FOR SELECT USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "notifications_insert_service" ON public.notifications;
CREATE POLICY "notifications_insert_service" ON public.notifications 
FOR INSERT WITH CHECK (true);

-- === GRANTS ===
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.deals TO authenticated;
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT SELECT ON public.payments TO authenticated;
GRANT SELECT, INSERT ON public.offers TO authenticated;
GRANT SELECT, INSERT ON public.contracts TO authenticated;
GRANT SELECT ON public.notifications TO authenticated;

-- === END === 