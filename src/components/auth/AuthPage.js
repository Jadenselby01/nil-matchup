import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './AuthPage.css';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToSignup = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleAuthSuccess = (user) => {
    onAuthSuccess && onAuthSuccess(user);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>NIL Matchup</h1>
          <p>Connect athletes with businesses for NIL opportunities</p>
        </div>

        <div className="auth-content">
          {isLogin ? (
            <LoginForm
              onSwitchToSignup={handleSwitchToSignup}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={handleSwitchToLogin}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>

        <div className="auth-features">
          <div className="feature">
            <div className="feature-icon">🏆</div>
            <h3>For Athletes</h3>
            <p>Find NIL deals that match your brand and values</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💼</div>
            <h3>For Businesses</h3>
            <p>Connect with authentic athletes for your marketing campaigns</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>Safe and transparent payment processing for all deals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 