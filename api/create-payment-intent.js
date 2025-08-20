import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

function isUuidV4(v) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v || '');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount_cents, currency = 'usd', deal_id } = req.body || {};
    if (!Number.isInteger(amount_cents) || amount_cents < 50) {
      return res.status(400).json({ error: 'amount_cents must be an integer >= 50' });
    }
    if (!isUuidV4(deal_id)) return res.status(400).json({ error: 'deal_id must be a UUID v4' });

    // Optional: verify the deal exists and user is allowed to pay it
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: deal, error: dealErr } = await supabase.from('deals').select('id').eq('id', deal_id).single();
    if (dealErr || !deal) return res.status(404).json({ error: 'Deal not found' });

    const pi = await stripe.paymentIntents.create({
      amount: amount_cents,
      currency,
      metadata: { deal_id }
    });

    return res.status(200).json({ client_secret: pi.client_secret, id: pi.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
} 