import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { user_id, email, full_name, role } = req.body || {};
    if (!user_id || !email) return res.status(400).json({ error: 'Missing user_id or email' });

    const supabase = createClient(process.env.SUPABASE_URL || process.env.REAL_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user_id, email, full_name: full_name || null, role: role || 'athlete' }, { onConflict: 'id' });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
} 