import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Spinner from '../components/Spinner';

const RequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth; 