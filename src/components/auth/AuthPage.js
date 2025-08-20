import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { supabase } from '../../lib/supabaseClient';
import './AuthPage.css';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (user) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
  };

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <h1>NIL Matchup</h1>
            <p>Connect athletes with businesses for NIL opportunities.</p>
          </div>
        </div>
        
        <div className="auth-right">
          {isLogin ? (
            <LoginForm 
              onSwitchToSignup={switchToSignup}
              onAuthSuccess={handleAuthSuccess}
            />
          ) : (
            <SignupForm 
              onSwitchToLogin={switchToLogin}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 