import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './auth/AuthPage';

const LandingPage = () => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <AuthPage />;
};

export default LandingPage; 