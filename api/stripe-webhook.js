import Stripe from 'stripe';
import { supabase } from '../src/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const buf = await readRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const deal_id = pi.metadata?.deal_id;
      const amount = pi.amount_received;
      const currency = pi.currency;

      const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      // Upsert payment
      const { error } = await supabase.from('payments').upsert({
        id: pi.id,
        deal_id,
        amount_cents: amount,
        currency,
        status: 'succeeded'
      }, { onConflict: 'id' });

      if (error) console.error('Supabase upsert error:', error);
    }

    res.status(200).json({ received: true });
  } catch (e) {
    console.error(e);
    res.status(500).send('Webhook handler error');
  }
} 