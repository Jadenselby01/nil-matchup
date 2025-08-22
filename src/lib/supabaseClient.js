import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,         // keep user logged in
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase env vars', { hasUrl: !!supabaseUrl, hasKey: !!supabaseAnonKey });
} 