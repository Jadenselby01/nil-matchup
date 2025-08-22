import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // dev-time visibility
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase env vars', { 
    supabaseUrlPresent: !!supabaseUrl, 
    supabaseAnonKeyPresent: !!supabaseAnonKey 
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { 
    persistSession: true, 
    autoRefreshToken: true, 
    detectSessionInUrl: true 
  }
}); 