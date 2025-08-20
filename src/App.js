import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// Import components
import AuthPage from './components/auth/AuthPage';
import AthleteDashboard from './components/dashboard/AthleteDashboard';
import BusinessDashboard from './components/dashboard/BusinessDashboard';
import CreateDealForm from './components/deals/CreateDealForm';
import DealDiscoveryPage from './components/deals/DealDiscoveryPage';
import DealsPage from './components/DealsPage';
import PaymentPage from './components/PaymentPage';
import PaymentProcessingPage from './components/PaymentProcessingPage';

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentDeal, setCurrentDeal] = useState(null);
  const [notification, setNotification] = useState(null);

  // Get authentication context
  const { user, userProfile, loading: authLoading } = useAuth();

  // Redirect based on authentication status
  useEffect(() => {
    console.log('App: Auth state changed:', { user, userProfile, authLoading });
    
    if (!authLoading) {
      if (user) {
        console.log('App: User authenticated, checking profile...');
        if (userProfile) {
          console.log('App: Profile loaded, redirecting to dashboard');
          // User is authenticated and profile is loaded, redirect to appropriate dashboard
          setCurrentPage(userProfile.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
        } else {
          console.log('App: User authenticated but no profile, staying on current page');
          // User is authenticated but profile not loaded yet, don't redirect
        }
      } else {
        console.log('App: No user, redirecting to landing');
        // User is not authenticated, stay on landing page
        setCurrentPage('landing');
      }
    }
  }, [user, userProfile, authLoading]);

  // Handle authentication success
  const handleAuthSuccess = (user) => {
    // This will be handled by the AuthContext automatically
    setNotification({
      message: `Welcome to NIL Matchup, ${user.first_name || user.email}!`,
      type: 'success',
      duration: 3000
    });
  };

  // Handle sign out
  const handleSignOut = () => {
    // This will be handled by the AuthContext automatically
    setCurrentPage('landing');
    setNotification({
      message: 'You have been signed out successfully',
      type: 'info',
      duration: 3000
    });
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Landing page component - redirects to auth if not logged in
  const LandingPage = () => (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">NIL Matchup</h1>
        <p className="landing-subtitle">NIL for all</p>
        <p className="landing-description">
          Connecting college athletes with local businesses for meaningful partnerships.
        </p>
        
        <div className="landing-buttons">
          <button 
            className="landing-btn primary-btn"
            onClick={() => setCurrentPage('auth')}
          >
            Get Started
          </button>
          <button 
            className="landing-btn secondary-btn"
            onClick={() => setCurrentPage('auth')}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'athlete-dashboard':
        return <AthleteDashboard onNavigate={setCurrentPage} />;
      case 'business-dashboard':
        return <BusinessDashboard onNavigate={setCurrentPage} />;
      case 'create-deal':
        return <CreateDealForm 
          onDealCreated={(newDeal) => {
            setCurrentDeal(newDeal);
            setCurrentPage('business-dashboard');
            setNotification({
              message: '✅ Deal created successfully! Athletes can now discover and apply.',
              type: 'success',
              duration: 5000
            });
          }}
          onCancel={() => setCurrentPage('business-dashboard')}
        />;
      case 'deal-discovery':
        return <DealDiscoveryPage 
          onBack={() => setCurrentPage('athlete-dashboard')}
          onDealSelected={(deal) => {
            setCurrentDeal(deal);
            setCurrentPage('deal-details');
          }}
        />;
      case 'deals':
        return <DealsPage 
          currentUser={userProfile}
          onBack={() => setCurrentPage(userProfile?.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
        />;
      case 'payment':
        return <PaymentPage 
          currentUser={userProfile}
          onBack={() => setCurrentPage(userProfile?.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
        />;
      case 'payment-processing':
        return <PaymentProcessingPage 
          dealId={currentDeal?.id}
          onComplete={(completedDeal) => {
            setCurrentDeal(completedDeal);
            setCurrentPage(userProfile?.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
            alert('✅ Payment processing completed! Your deal is now active.');
          }}
          onBack={() => setCurrentPage(userProfile?.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
        />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
      
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// Wrap App with AuthProvider
function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;