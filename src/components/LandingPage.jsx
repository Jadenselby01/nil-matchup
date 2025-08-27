import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './auth/AuthPage';
import Spinner from './Spinner';

const LandingPage = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  // If user is authenticated, redirect to dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show auth page
  return <AuthPage />;
};

export default LandingPage; 