import { auth, db } from '../config/supabase';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.userProfile = null;
    this.isAuthenticated = false;
  }

  // Sign up new user
  async signUp(email, password, userType, userData = {}) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await auth.signUp(email, password, userType);
      
      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const profileData = {
          id: authData.user.id,
          email,
          user_type: userType,
          ...userData
        };

        const { data: profileResult, error: profileError } = await db.createUser(profileData);
        
        if (profileError) throw profileError;

        this.currentUser = authData.user;
        this.userProfile = profileResult[0];
        this.isAuthenticated = true;

        return { user: authData.user, profile: profileResult[0], error: null };
      }

      return { user: null, profile: null, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, profile: null, error };
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await auth.signIn(email, password);
      
      if (error) throw error;

      if (data.user) {
        // Get user profile
        const { data: profile, error: profileError } = await db.getUser(data.user.id);
        
        if (profileError) throw profileError;

        this.currentUser = data.user;
        this.userProfile = profile;
        this.isAuthenticated = true;

        return { user: data.user, profile, error: null };
      }

      return { user: null, profile: null, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, profile: null, error };
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await auth.signOut();
      
      if (error) throw error;

      this.currentUser = null;
      this.userProfile = null;
      this.isAuthenticated = false;

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { user, error } = await auth.getCurrentUser();
      
      if (error) throw error;

      if (user) {
        // Get user profile
        const { data: profile, error: profileError } = await db.getUser(user.id);
        
        if (profileError) throw profileError;

        this.currentUser = user;
        this.userProfile = profile;
        this.isAuthenticated = true;

        return { user, profile, error: null };
      }

      this.currentUser = null;
      this.userProfile = null;
      this.isAuthenticated = false;

      return { user: null, profile: null, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, profile: null, error };
    }
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await db.updateUser(userId, updates);
      
      if (error) throw error;

      if (data) {
        this.userProfile = data[0];
      }

      return { data: data ? data[0] : null, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { data, error } = await auth.resetPassword(email);
      
      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Get user type
  getUserType() {
    return this.userProfile?.user_type || null;
  }

  // Get user ID
  getUserId() {
    return this.currentUser?.id || null;
  }

  // Check if profile is completed
  isProfileCompleted() {
    return this.userProfile?.profile_completed || false;
  }

  // Check if legal documents are completed
  areLegalDocumentsCompleted() {
    return this.userProfile?.legal_documents_completed || false;
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    // Use the auth helper instead of direct supabase access
    return auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.getCurrentUser().then(({ user, profile }) => {
          callback({ user, profile, isAuthenticated: true });
        });
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.userProfile = null;
        this.isAuthenticated = false;
        callback({ user: null, profile: null, isAuthenticated: false });
      }
    });
  }
}

const authService = new AuthService();
export default authService; 