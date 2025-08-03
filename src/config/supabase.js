import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for auth
export const auth = {
  signUp: async (email, password, userType) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType
        }
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Helper functions for database
export const db = {
  // Athletes
  createAthlete: async (athleteData) => {
    const { data, error } = await supabase
      .from('athletes')
      .insert([athleteData])
      .select();
    return { data, error };
  },

  getAthlete: async (id) => {
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  updateAthlete: async (id, updates) => {
    const { data, error } = await supabase
      .from('athletes')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Businesses
  createBusiness: async (businessData) => {
    const { data, error } = await supabase
      .from('businesses')
      .insert([businessData])
      .select();
    return { data, error };
  },

  getBusiness: async (id) => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  updateBusiness: async (id, updates) => {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Deals
  createDeal: async (dealData) => {
    const { data, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select();
    return { data, error };
  },

  getDeals: async (userId, userType) => {
    let query = supabase.from('deals').select(`
      *,
      athletes (name, sport, university),
      businesses (company_name, industry)
    `);

    if (userType === 'athlete') {
      query = query.eq('athlete_id', userId);
    } else if (userType === 'business') {
      query = query.eq('business_id', userId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  updateDeal: async (id, updates) => {
    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Smart Templates
  createSmartTemplate: async (templateData) => {
    const { data, error } = await supabase
      .from('smart_templates')
      .insert([templateData])
      .select();
    return { data, error };
  },

  getSmartTemplates: async (businessId) => {
    const { data, error } = await supabase
      .from('smart_templates')
      .select('*')
      .eq('business_id', businessId);
    return { data, error };
  }
}; 