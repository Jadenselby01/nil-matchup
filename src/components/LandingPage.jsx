import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Spinner from './Spinner';

const LandingPage = () => {
  const auth = useAuth();
  
  // Handle case where useAuth returns null
  if (!auth) {
    console.error('[LandingPage] useAuth() returned null - showing auth page');
    return <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">NIL Matchup</h1>
        <p className="landing-subtitle">Connecting college athletes with local businesses for meaningful partnerships.</p>
        <p className="landing-description">Join our growing community today!</p>
        <div className="landing-buttons">
          <Link to="/login" className="landing-btn primary-btn">Create Your Account</Link>
          <Link to="/login" className="landing-btn secondary-btn">Sign In</Link>
        </div>
        <div className="landing-version">v1.0.0</div>
      </div>
    </div>;
  }

  const { user, loading } = auth;

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  // If user is authenticated, immediately redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show beautiful landing page
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">NIL Matchup</h1>
        <p className="landing-subtitle">Connecting college athletes with local businesses for meaningful partnerships.</p>
        <p className="landing-description">Join our growing community today!</p>
        <div className="landing-buttons">
          <Link to="/login" className="landing-btn primary-btn">Create Your Account</Link>
          <Link to="/login" className="landing-btn secondary-btn">Sign In</Link>
        </div>
        <div className="landing-version">v1.0.0</div>
      </div>
    </div>
  );
};

export default LandingPage; 