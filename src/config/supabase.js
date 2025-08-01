import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with demo mode support
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug logging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

// Check if we're in demo mode (using placeholder values)
const isDemoMode = !supabaseUrl || 
  supabaseUrl === 'your-supabase-url' || 
  supabaseUrl === 'https://demo.supabase.co' ||
  supabaseUrl === 'your-supabase-project-url' ||
  (supabaseUrl && supabaseUrl.includes('your-supabase'));

console.log('Is Demo Mode:', isDemoMode);

let supabase;

if (isDemoMode) {
  // Create a mock Supabase client for demo mode
  supabase = {
    auth: {
      signUp: async () => ({ data: { user: { id: 'demo-user-1' } }, error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'demo-user-1' } }, error: null }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: { id: 'demo-user-1' } }, error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      onAuthStateChange: (callback) => {
        // Mock auth state change
        callback('SIGNED_IN', { user: { id: 'demo-user-1' } });
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: () => ({
      insert: () => ({ select: () => ({ data: [{ id: 'demo-record-1' }], error: null }) }),
      select: () => ({ eq: () => ({ single: () => ({ data: { id: 'demo-user-1' }, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ data: [{ id: 'demo-user-1' }], error: null }) }) })
    })
  };
} else {
  // Use real Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Database table names
export const TABLES = {
  USERS: 'users',
  ATHLETES: 'athletes',
  BUSINESSES: 'businesses',
  DEALS: 'deals',
  MESSAGES: 'messages',
  PAYMENTS: 'payments',
  LEGAL_DOCUMENTS: 'legal_documents',
  NOTIFICATIONS: 'notifications',
  POSTS: 'posts',
  DISPUTES: 'disputes'
};

// Authentication helper functions
export const auth = {
  // Sign up new user
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

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helper functions
export const db = {
  // Users
  createUser: async (userData) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select();
    return { data, error };
  },

  getUser: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateUser: async (userId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select();
    return { data, error };
  },

  // Athletes
  createAthlete: async (athleteData) => {
    const { data, error } = await supabase
      .from(TABLES.ATHLETES)
      .insert([athleteData])
      .select();
    return { data, error };
  },

  getAthletes: async (filters = {}) => {
    let query = supabase
      .from(TABLES.ATHLETES)
      .select('*');

    if (filters.sport) query = query.eq('sport', filters.sport);
    if (filters.university) query = query.eq('university', filters.university);
    if (filters.minAge) query = query.gte('age', filters.minAge);
    if (filters.maxAge) query = query.lte('age', filters.maxAge);

    const { data, error } = await query;
    return { data, error };
  },

  // Businesses
  createBusiness: async (businessData) => {
    const { data, error } = await supabase
      .from(TABLES.BUSINESSES)
      .insert([businessData])
      .select();
    return { data, error };
  },

  getBusinesses: async (filters = {}) => {
    let query = supabase
      .from(TABLES.BUSINESSES)
      .select('*');

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.location) query = query.eq('location', filters.location);

    const { data, error } = await query;
    return { data, error };
  },

  // Deals
  createDeal: async (dealData) => {
    const { data, error } = await supabase
      .from(TABLES.DEALS)
      .insert([dealData])
      .select();
    return { data, error };
  },

  getDeals: async (userId, userType) => {
    const { data, error } = await supabase
      .from(TABLES.DEALS)
      .select('*')
      .or(`${userType}_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  updateDeal: async (dealId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.DEALS)
      .update(updates)
      .eq('id', dealId)
      .select();
    return { data, error };
  },

  // Messages
  createMessage: async (messageData) => {
    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .insert([messageData])
      .select();
    return { data, error };
  },

  getMessages: async (dealId) => {
    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  // Payments
  createPayment: async (paymentData) => {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .insert([paymentData])
      .select();
    return { data, error };
  },

  getPayments: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Legal Documents
  createLegalDocument: async (documentData) => {
    const { data, error } = await supabase
      .from(TABLES.LEGAL_DOCUMENTS)
      .insert([documentData])
      .select();
    return { data, error };
  },

  getLegalDocuments: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.LEGAL_DOCUMENTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};

// File storage helper functions
export const storage = {
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  getFileUrl: async (bucket, path) => {
    const { data } = await supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  deleteFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { data, error };
  }
};

// Real-time subscriptions
export const realtime = {
  subscribeToDeals: (userId, callback) => {
    return supabase
      .channel('deals')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: TABLES.DEALS,
        filter: `athlete_id=eq.${userId} OR business_id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  subscribeToMessages: (dealId, callback) => {
    return supabase
      .channel('messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: TABLES.MESSAGES,
        filter: `deal_id=eq.${dealId}`
      }, callback)
      .subscribe();
  }
};

export default supabase; 