import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import './App.css';

// Import components
import AuthPage from './components/auth/AuthPage';
import RequireAuth from './components/RequireAuth';
import AthleteDashboard from './components/dashboard/AthleteDashboard';
import BusinessDashboard from './components/dashboard/BusinessDashboard';
import CreateDealForm from './components/deals/CreateDealForm';
import DealDiscoveryPage from './components/deals/DealDiscoveryPage';
import DealsPage from './components/DealsPage';
import PaymentPage from './components/PaymentPage';
import PaymentProcessingPage from './components/PaymentProcessingPage';

// Force deployment refresh - Vercel cache issue fix
const APP_VERSION = '1.0.1-deploy-fix-' + Date.now();

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentDeal, setCurrentDeal] = useState(null);
  const [notification, setNotification] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  // Check environment variables
  useEffect(() => {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    const envCheck = {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl,
      key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'missing',
      version: APP_VERSION
    };
    
    console.log('Environment check:', envCheck);
    setDebugInfo(envCheck);

    if (!supabaseUrl || !supabaseKey) {
      setConfigError('Missing Supabase configuration. Please check environment variables.');
      setLoading(false);
      return;
    }

    // Test Supabase connection
    testSupabaseConnection();
  }, []);

  // Test if Supabase is actually working
  const testSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // Add timeout to prevent hanging
      const connectionPromise = new Promise(async (resolve, reject) => {
        try {
          // Test 1: Basic client creation
          console.log('Supabase client created:', !!supabase);
          
          // Test 2: Try to get session with timeout
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          console.log('Session test result:', { sessionData, sessionError });
          
          if (sessionError) {
            reject(new Error(`Supabase session error: ${sessionError.message}`));
            return;
          }
          
          resolve('✅ Supabase connection successful!');
        } catch (error) {
          reject(error);
        }
      });

      // Add 10 second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
      });

      const result = await Promise.race([connectionPromise, timeoutPromise]);
      console.log(result);
      
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      
      // If connection fails, show error but don't block the app
      if (error.message.includes('timeout')) {
        console.warn('Supabase connection timed out, proceeding with app initialization...');
        // Continue with app initialization even if Supabase is slow
        setLoading(false);
        setCurrentPage('landing');
      } else {
        setConfigError(`Supabase connection test failed: ${error.message}`);
        setLoading(false);
      }
    }
  };

  // Initialize authentication state
  useEffect(() => {
    if (configError) return;

    console.log('App: Initializing authentication...');

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('App: Initial session result:', { session, error });

        if (error) {
          console.error('Session error:', error);
          setConfigError(`Session error: ${error.message}`);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('User is logged in:', session.user);
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No active session, showing landing page');
          setCurrentPage('landing');
        }
      } catch (error) {
        console.error('App: Error getting initial session:', error);
        setConfigError(`Authentication error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    console.log('App: Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('App: Auth state change:', event, session);

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          setCurrentPage('landing');
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [configError]);

  // Fetch user profile from database
  const fetchUserProfile = async (userId) => {
    try {
      console.log('App: Fetching profile for user:', userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('App: Profile fetch result:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('App: No profile found for user, creating one...');
          // Create profile automatically
          await createUserProfile(userId);
          return;
        }
        console.error('App: Error fetching user profile:', error);
        setConfigError(`Profile fetch error: ${error.message}`);
        return;
      }

      if (data) {
        console.log('App: Setting user profile:', data);
        setUserProfile(data);
        // Redirect to appropriate dashboard
        setCurrentPage(data.role === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
      }
    } catch (error) {
      console.error('App: Error in fetchUserProfile:', error);
      setConfigError(`Profile error: ${error.message}`);
    }
  };

  // Create user profile if it doesn't exist
  const createUserProfile = async (userId) => {
    try {
      console.log('App: Creating profile for user:', userId);
      
      // Get user metadata from auth
      const { data: { user } } = await supabase.auth.getUser();
      const userMetadata = user?.user_metadata || {};
      
      const profileData = {
        id: userId,
        email: user?.email || '',
        full_name: userMetadata.full_name || userMetadata.first_name + ' ' + userMetadata.last_name || 'User',
        role: userMetadata.user_type || 'athlete', // Default to athlete
        created_at: new Date().toISOString()
      };

      console.log('App: Creating profile with data:', profileData);

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('App: Error creating profile:', error);
        setConfigError(`Failed to create profile: ${error.message}`);
        return;
      }

      console.log('App: Profile created successfully:', data);
      setUserProfile(data);
      setCurrentPage(data.role === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
      
    } catch (error) {
      console.error('App: Error in createUserProfile:', error);
      setConfigError(`Profile creation error: ${error.message}`);
    }
  };

  const handleAuthSuccess = (user) => {
    setNotification({
      message: `Welcome to NIL Matchup, ${user.user_metadata?.full_name || user.email}!`,
      type: 'success',
      duration: 3000
    });
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
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

  // Show configuration error
  if (configError) {
    return (
      <div className="config-error">
        <h2>⚠️ Configuration Error</h2>
        <p>{configError}</p>
        <div className="config-details">
          <h3>Environment Variables Check:</h3>
          <ul>
            <li><strong>REACT_APP_SUPABASE_URL:</strong> {process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li><strong>REACT_APP_SUPABASE_ANON_KEY:</strong> {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>
        <div className="debug-info">
          <h3>Debug Information:</h3>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
        <div className="config-help">
          <h3>How to Fix:</h3>
          <ol>
            <li>Go to your Vercel project dashboard</li>
            <li>Click "Settings" → "Environment Variables"</li>
            <li>Add these variables:
              <ul>
                <li><code>REACT_APP_SUPABASE_URL</code> = your Supabase project URL</li>
                <li><code>REACT_APP_SUPABASE_ANON_KEY</code> = your Supabase anon key</li>
              </ul>
            </li>
            <li>Redeploy your project</li>
          </ol>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
        <p className="loading-subtitle">Initializing NIL Matchup...</p>
        <p className="loading-version">Version: {APP_VERSION}</p>
        <div className="loading-debug">
          <p>Debug: Checking Supabase connection...</p>
          <p>URL: {process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
        
        {/* Manual bypass button */}
        <div className="loading-bypass">
          <p>If loading takes too long, you can:</p>
          <button
            className="bypass-btn"
            onClick={() => {
              console.log('Manual bypass clicked, proceeding to landing page...');
              setLoading(false);
              setCurrentPage('landing');
            }}
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

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
        
        {/* Debug: Manual dashboard access */}
        {userProfile && (
          <div className="debug-dashboard-access">
            <p>✅ You're logged in as: {userProfile.email}</p>
            <p>Role: {userProfile.role}</p>
            <button
              className="landing-btn primary-btn"
              onClick={() => setCurrentPage(userProfile.role === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        )}
        
        <p className="landing-version">Version: {APP_VERSION}</p>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'athlete-dashboard':
        return (
          <RequireAuth>
            <AthleteDashboard onNavigate={setCurrentPage} onSignOut={handleSignOut} />
          </RequireAuth>
        );
      case 'business-dashboard':
        return (
          <RequireAuth>
            <BusinessDashboard onNavigate={setCurrentPage} onSignOut={handleSignOut} />
          </RequireAuth>
        );
      case 'create-deal':
        return (
          <RequireAuth>
            <CreateDealForm
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
            />
          </RequireAuth>
        );
      case 'deal-discovery':
        return (
          <RequireAuth>
            <DealDiscoveryPage
              onBack={() => setCurrentPage('athlete-dashboard')}
              onDealSelected={(deal) => {
                setCurrentDeal(deal);
                setCurrentPage('deal-details');
              }}
            />
          </RequireAuth>
        );
      case 'deals':
        return (
          <RequireAuth>
            <DealsPage
              currentUser={userProfile}
              onBack={() => setCurrentPage(userProfile?.role === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
            />
          </RequireAuth>
        );
      case 'payment':
        return (
          <RequireAuth>
            <PaymentPage
              currentUser={userProfile}
              onBack={() => setCurrentPage(userProfile?.role === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
            />
          </RequireAuth>
        );
      case 'payment-processing':
        return (
          <RequireAuth>
            <PaymentProcessingPage
              dealId={currentDeal?.id}
              onComplete={(completedDeal) => {
                setCurrentDeal(completedDeal);
                setCurrentPage(userProfile?.role === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
                alert('✅ Payment processing completed! Your deal is now active.');
              }}
              onBack={() => setCurrentPage(userProfile?.role === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
            />
          </RequireAuth>
        );
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="App">
      {renderPage()}

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