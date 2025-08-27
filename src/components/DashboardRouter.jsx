import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AthleteDashboard from './dashboard/AthleteDashboard';
import BusinessDashboard from './dashboard/BusinessDashboard';
import Spinner from './Spinner';

const DashboardRouter = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!profile) {
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