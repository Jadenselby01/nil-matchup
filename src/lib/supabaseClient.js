import { createClient } from '@supabase/supabase-js'

const url = process.env.REACT_APP_SUPABASE_URL
const anon = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!url || !anon) {
  // Helpful diagnostics without leaking secrets
  // eslint-disable-next-line no-console
  console.error('[AUTH] Missing env vars:',
    { hasUrl: !!url, hasAnonKey: !!anon, origin: typeof window !== 'undefined' ? window.location.origin : 'ssr' }
  )
}

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-nilmatch-auth'
  }
}) 