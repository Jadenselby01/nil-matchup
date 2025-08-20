import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
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

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentDeal, setCurrentDeal] = useState(null);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    console.log('App: Initializing authentication...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('App: Initial session:', session);
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('App: Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('App: Auth state change:', event, session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setCurrentPage('landing');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId) => {
    try {
      console.log('App: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('App: Profile fetch result:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('App: No profile found for user (this is normal for new users)');
          return;
        }
        console.error('App: Error fetching user profile:', error);
        return;
      }

      if (data) {
        console.log('App: Setting user profile:', data);
        setUserProfile(data);
        // Redirect to appropriate dashboard
        setCurrentPage(data.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
      }
    } catch (error) {
      console.error('App: Error in fetchUserProfile:', error);
    }
  };

  // Handle authentication success
  const handleAuthSuccess = (user) => {
    setNotification({
      message: `Welcome to NIL Matchup, ${user.first_name || user.email}!`,
      type: 'success',
      duration: 3000
    });
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setCurrentPage('landing');
      setNotification({
        message: 'You have been signed out successfully',
        type: 'info',
        duration: 3000
      });
    } catch (error) {
      console.error('App: Error signing out:', error);
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
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
        return <AthleteDashboard onNavigate={setCurrentPage} onSignOut={handleSignOut} />;
      case 'business-dashboard':
        return <BusinessDashboard onNavigate={setCurrentPage} onSignOut={handleSignOut} />;
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

export default App;