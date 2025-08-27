import { supabase } from '../lib/supabaseClient';

export async function ensureProfile(roleHint) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const { data: existing, error: selErr } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();
    
  if (selErr) throw selErr;
  
  if (!existing) {
    const role = roleHint ?? (user.user_metadata?.role) ?? 'athlete';
    const { error: insErr } = await supabase.from('profiles').insert({
      id: user.id, 
      email: user.email, 
      role,
      display_name: user.user_metadata?.display_name ?? null
    });
    if (insErr) throw insErr;
  }
} 