import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AthleteDashboard from './dashboard/AthleteDashboard';
import BusinessDashboard from './dashboard/BusinessDashboard';
import Spinner from './Spinner';

const DashboardRouter = () => {
  const auth = useAuth();
  
  // Handle case where useAuth returns null
  if (!auth) {
    console.error('[DashboardRouter] useAuth() returned null - redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  const { profile, loading } = auth;

  if (loading) {
    return <Spinner text="Loading dashboard..." />;
  }

  if (!profile) {
    console.log('[DashboardRouter] No profile found - redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/dashboard/${profile.role}`} replace />} />
      <Route path="/athlete" element={<AthleteDashboard />} />
      <Route path="/business" element={<BusinessDashboard />} />
      <Route path="*" element={<Navigate to={`/dashboard/${profile.role}`} replace />} />
    </Routes>
  );
};

export default DashboardRouter; 