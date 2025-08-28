import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import AthleteDashboard from './dashboard/AthleteDashboard';
import BusinessDashboard from './dashboard/BusinessDashboard';
import Spinner from './Spinner';

const DashboardRouter = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Handle case where useAuth returns null
  if (!auth) {
    console.error('[DashboardRouter] useAuth() returned null - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  const { user } = auth;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          // Default to athlete if profile not found
          setProfile({ role: 'athlete' });
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Profile load error:', err);
        setProfile({ role: 'athlete' });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <Spinner text="Loading your dashboard..." />;
  }

  // Route based on profile role
  if (profile?.role === 'business') {
    return (
      <div>
        <div style={{ padding: '20px', textAlign: 'right' }}>
          <button 
            onClick={handleSignOut}
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
        <BusinessDashboard />
      </div>
    );
  } else {
    // Default to athlete dashboard
    return (
      <div>
        <div style={{ padding: '20px', textAlign: 'right' }}>
          <button 
            onClick={handleSignOut}
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
        <AthleteDashboard />
      </div>
    );
  }
};

export default DashboardRouter; 