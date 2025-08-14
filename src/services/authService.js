import { supabase, auth, db } from '../config/supabase';

class AuthService {
  // Sign up new user
  async signUp(email, password, userType, userData) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await auth.signUp(email, password, userType);
      
      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create profile in appropriate table
        const profileData = {
          id: authData.user.id,
          email: email,
          ...userData
        };

        let profileResult;
        if (userType === 'athlete') {
          profileResult = await db.createAthlete(profileData);
        } else if (userType === 'business') {
          profileResult = await db.createBusiness(profileData);
        }

        if (profileResult.error) {
          throw profileResult.error;
        }

        return {
          user: authData.user,
          profile: profileResult.data[0],
          error: null
        };
      }

      return { user: null, profile: null, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        throw error;
      }

      if (data.user) {
        // Get user profile
        const profile = await this.getUserProfile(data.user.id);
        
        return {
          user: data.user,
          profile: profile,
          error: null
        };
      }

      return { user: null, profile: null, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear local storage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('profileCompleted');
      localStorage.removeItem('legalDocumentsCompleted');
      localStorage.removeItem('isNewUser');

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await auth.getCurrentUser();
      
      if (error) {
        throw error;
      }

      if (user) {
        const profile = await this.getUserProfile(user.id);
        return { user, profile, error: null };
      }

      return { user: null, profile: null, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      // Try to get athlete profile first
      let { data: athleteProfile, error: athleteError } = await db.getAthlete(userId);
      
      if (athleteProfile && !athleteError) {
        return { ...athleteProfile, type: 'athlete' };
      }

      // If not athlete, try business profile
      let { data: businessProfile, error: businessError } = await db.getBusiness(userId);
      
      if (businessProfile && !businessError) {
        return { ...businessProfile, type: 'business' };
      }

      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId, userType, updates) {
    try {
      let result;
      
      if (userType === 'athlete') {
        result = await db.updateAthlete(userId, updates);
      } else if (userType === 'business') {
        result = await db.updateBusiness(userId, updates);
      }

      if (result.error) {
        throw result.error;
      }

      return { data: result.data[0], error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error.message };
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error.message };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id);
        callback(event, { user: session.user, profile });
      } else {
        callback(event, { user: null, profile: null });
      }
    });
  }

  // Check if user is authenticated
  isAuthenticated() {
    return supabase.auth.getSession().then(({ data: { session } }) => {
      return !!session;
    });
  }
}

const authService = new AuthService();

export default authService; 