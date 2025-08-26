import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import AthleteDashboard from './dashboard/AthleteDashboard';
import BusinessDashboard from './dashboard/BusinessDashboard';

const DashboardRouter = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const getUserRole = async () => {
      try {
        setProfileLoading(true);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('Could not fetch user role:', error);
          // Default to athlete if we can't determine role
          setUserRole('athlete');
        } else {
          setUserRole(profile?.role || 'athlete');
        }
      } catch (err) {
        console.error('Error determining user role:', err);
        setUserRole('athlete'); // Default fallback
      } finally {
        setProfileLoading(false);
      }
    };

    getUserRole();
  }, [user, navigate]);

  // Show loading while determining user role
  if (loading || profileLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  if (userRole === 'business') {
    return <BusinessDashboard />;
  } else {
    return <AthleteDashboard />;
  }
};

export default DashboardRouter; 