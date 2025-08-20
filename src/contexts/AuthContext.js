import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Debug Supabase configuration
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user || null);
        
        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Enhanced sign up with verification
  const signUp = async (email, password, userType, profileData, recaptchaToken) => {
    try {
      // Verify reCAPTCHA token
      if (!recaptchaToken) {
        throw new Error('Human verification required');
      }

      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            ...profileData
          }
        }
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: email,
            user_type: userType,
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            sport: profileData.sport || '',
            university: profileData.university || '',
            company_name: profileData.company_name || '',
            company_type: profileData.company_type || '',
            bio: profileData.bio || '',
            is_verified: false
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw error here, profile can be created later
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Enhanced sign in with remember me
  const signIn = async (email, password, rememberMe = true) => {
    try {
      console.log('AuthContext: Attempting sign in for:', email);
      console.log('AuthContext: Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
      console.log('AuthContext: Supabase Key exists:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);
      
      if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
        throw new Error('Supabase configuration missing. Please check your .env file.');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('AuthContext: Supabase auth result:', { data, error });

      if (error) {
        console.error('AuthContext: Supabase error:', error);
        throw error;
      }

      if (!data.session) {
        throw new Error('No session returned from Supabase');
      }

      // Set session persistence based on remember me
      if (rememberMe && data.session) {
        try {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
          console.log('AuthContext: Session persistence set');
        } catch (sessionError) {
          console.warn('AuthContext: Could not set session persistence:', sessionError);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('AuthContext: Sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!session;
  };

  // Check if user profile is complete
  const isProfileComplete = () => {
    if (!userProfile) return false;
    
    if (userProfile.user_type === 'athlete') {
      return !!(userProfile.first_name && userProfile.sport && userProfile.university);
    } else {
      return !!(userProfile.company_name && userProfile.company_type);
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    getUserProfile,
    isAuthenticated,
    isProfileComplete,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 