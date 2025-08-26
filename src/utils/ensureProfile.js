import { supabase } from '../lib/supabaseClient';

export const ensureProfile = async (user, roleHint = null) => {
  if (!user?.id) {
    throw new Error('User ID is required');
  }

  try {
    // First, try to get existing profile
    const { data: existingProfile, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile && !selectError) {
      console.log('Profile already exists:', existingProfile);
      return existingProfile;
    }

    // Profile doesn't exist, create it
    console.log('Creating new profile for user:', user.id);
    
    const role = roleHint || user.user_metadata?.role || 'athlete';
    const displayName = user.user_metadata?.display_name || 
                       user.user_metadata?.first_name || 
                       user.email?.split('@')[0] || 
                       'User';

    const newProfile = {
      id: user.id,
      email: user.email,
      role: role,
      full_name: displayName,
      created_at: new Date().toISOString()
    };

    const { data: createdProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create profile:', insertError);
      throw new Error(`Profile creation failed: ${insertError.message}`);
    }

    console.log('Profile created successfully:', createdProfile);
    return createdProfile;

  } catch (error) {
    console.error('Error in ensureProfile:', error);
    throw error;
  }
}; 