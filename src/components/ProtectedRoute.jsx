import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = () => {
  const auth = useAuth();
  
  // Handle case where useAuth returns null
  if (!auth) {
    console.error('[ProtectedRoute] useAuth() returned null - redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  const { user, loading } = auth;

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  // If no user, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user exists, render the protected route
  return <Outlet />;
};

export default ProtectedRoute; 