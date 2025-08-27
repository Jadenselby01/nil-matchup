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

  const { session, loading } = auth;

  if (loading) {
    return <Spinner text="Checking authentication..." />;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 