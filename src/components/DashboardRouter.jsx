import React, { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AthleteDashboard from './dashboard/AthleteDashboard';
import BusinessDashboard from './dashboard/BusinessDashboard';

const DashboardRouter = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile) {
      // Auto-redirect to role-specific dashboard
      const rolePath = `/dashboard/${profile.role}`;
      if (window.location.pathname !== rolePath) {
        navigate(rolePath, { replace: true });
      }
    }
  }, [profile, loading, navigate]);

  if (loading || !profile) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/athlete" element={<AthleteDashboard />} />
      <Route path="/business" element={<BusinessDashboard />} />
      <Route path="/" element={
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Redirecting to your dashboard...</p>
        </div>
      } />
    </Routes>
  );
};

export default DashboardRouter; 