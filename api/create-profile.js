import { supabase } from '../src/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, email, full_name, role } = req.body || {};
    
    if (!user_id || !email) {
      return res.status(400).json({ error: 'Missing user_id or email' });
    }

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL, 
      process.env.SUPABASE_SERVICE_ROLE_KEY, 
      {
        auth: { persistSession: false, autoRefreshToken: false }
      }
    );

    // RLS-compliant approach: update existing profile or insert if needed
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        { 
          id: user_id, 
          full_name: full_name || null, 
          role: role || 'athlete' 
        }, 
        { 
          onConflict: 'id',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Profile upsert failed:', {
        message: error.message,
        code: error.code,
        details: error,
      });
      
      const message = error.message || 'Unknown error';
      throw new Error(
        `Profile save failed: ${message}. If this mentions row-level security or "PGRST", ensure RLS policies and the auth trigger are installed.`
      );
    }

    return res.status(200).json({ 
      ok: true, 
      profile: data 
    });

  } catch (error) {
    console.error('Create profile API error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
} 