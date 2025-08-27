import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import AthleteDashboard from './dashboard/AthleteDashboard';
import BusinessDashboard from './dashboard/BusinessDashboard';
import Spinner from './Spinner';

const DashboardRouter = () => {
  const auth = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Handle case where useAuth returns null
  if (!auth) {
    console.error('[DashboardRouter] useAuth() returned null - redirecting to auth');
    return <Navigate to="/auth" replace />;
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

  if (loading) {
    return <Spinner text="Loading your dashboard..." />;
  }

  // Route based on profile role
  if (profile?.role === 'business') {
    return <BusinessDashboard />;
  } else {
    // Default to athlete dashboard
    return <AthleteDashboard />;
  }
};

export default DashboardRouter; 