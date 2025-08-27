import { supabase } from '../lib/supabaseClient';

export async function ensureProfile(roleHint) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) {
    console.error('[ensureProfile ERROR] Failed to get user:', userErr);
    throw new Error(`${userErr.message} (code: ${userErr.code ?? 'n/a'})`);
  }
  
  if (!user) return; // no session yet (email confirmation flow), skip quietly

  const role = (roleHint ?? (user.user_metadata?.role) ?? 'athlete');

  const { error: upErr } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,                      // MUST be UUID from auth
      email: user.email,
      role,
      display_name: user.user_metadata?.display_name ?? null,
    }, { onConflict: 'id' });

  if (upErr) {
    console.error('[ensureProfile UPSERT ERROR]', upErr);
    throw new Error(`${upErr.message} (code: ${upErr.code ?? 'n/a'})`);
  }
} 