import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForms.css';

const LoginForm = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationHelp, setShowVerificationHelp] = useState(false);
  const [remember, setRemember] = useState(true);
  
  const { signIn } = useAuth();

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setShowVerificationHelp(false);

    try {
      console.log('Attempting to sign in with:', { email: formData.email, password: formData.password });
      
      const { error: signInError } = await signIn(formData.email, formData.password, remember);

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        if (signInError.message.includes('Email not confirmed')) {
          setError('Your email is not verified. Please check your inbox and click the verification link.');
          setShowVerificationHelp(true);
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (signInError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          setError(`Sign in failed: ${signInError.message}`);
        }
        return;
      }

      // Success - AuthContext will handle redirect to dashboard
      console.log('Sign in successful, redirecting to dashboard...');
      
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      // Note: This functionality will be implemented when needed
      setError('Verification email functionality coming soon!');
      setShowVerificationHelp(false);
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error when user types
  };

  return (
    <div className="auth-form">
      <h2>Welcome Back</h2>
      <p>Sign in to your NIL Matchup account</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="checkmark"></span>
            Remember me (stay logged in)
          </label>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {showVerificationHelp && (
        <div className="verification-help">
          <p>Need help with email verification?</p>
          <button 
            type="button" 
            onClick={handleResendVerification}
            className="resend-button"
            disabled={loading}
          >
            Resend Verification Email
          </button>
        </div>
      )}

      <div className="auth-switch">
        <p>Don't have an account? <button type="button" onClick={onSwitchToSignup}>Sign up</button></p>
      </div>
    </div>
  );
};

export default LoginForm; 