import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AuthForms.css';

const LoginForm = ({ onAuthSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationHelp, setShowVerificationHelp] = useState(false);

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
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      console.log('Sign in result:', { data, error: signInError });

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
      } else if (data && data.user) {
        console.log('Sign in successful:', data);
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
      }
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
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email
      });
      
      if (error) {
        setError(`Failed to resend verification: ${error.message}`);
      } else {
        setError('Verification email sent! Check your inbox and spam folder.');
        setShowVerificationHelp(false);
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  return (
    <div className="auth-form">
      <h2>Welcome Back</h2>
      <p>Sign in to your NIL Matchup account</p>
      
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
            placeholder="Enter your email"
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
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" /> Remember me (stay logged in)
          </label>
        </div>

        {error && (
          <div className="error-message">
            {error}
            {showVerificationHelp && (
              <div className="verification-help">
                <p>Need help with verification?</p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="resend-button"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend Verification Email'}
                </button>
                <p className="verification-tips">
                  • Check your spam/junk folder<br/>
                  • Make sure you clicked the verification link<br/>
                  • Contact support if you need help
                </p>
              </div>
            )}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-switch">
        <p>Don't have an account? <button type="button" onClick={onSwitchToSignup}>Create Account</button></p>
      </div>
    </div>
  );
};

export default LoginForm; 