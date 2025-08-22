import { supabase } from '../lib/supabaseClient';

export async function assertProfileExists() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'no-user' };
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();
    
  return { ok: !!data && !error, data, error };
} 