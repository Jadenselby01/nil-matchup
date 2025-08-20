export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY
  });
} 