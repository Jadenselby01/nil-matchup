import { supabase } from '../lib/supabaseClient';

export async function assertProfileExists() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();
    
  // If missing, just no-op here; a DB trigger should have created it.
  // Avoid blocking the UI on this call.
  if (error) {
    console.warn('Profile check failed:', error);
  }
} 