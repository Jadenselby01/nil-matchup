import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './AuthPage.css';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccessInternal = (user) => {
    // This function can be used for any local AuthPage specific logic
    // before passing control back to App.js
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-page-content">
        <div className="auth-page-info">
          <h1>NIL Matchup</h1>
          <p>Connecting college athletes with local businesses for meaningful partnerships.</p>
          <p>Join our growing community today!</p>
        </div>
        <div className="auth-form-wrapper">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} onAuthSuccess={handleAuthSuccessInternal} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} onAuthSuccess={handleAuthSuccessInternal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 