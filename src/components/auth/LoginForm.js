import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AuthForms.css';

const LoginForm = ({ onSwitchToSignup, onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to sign in with:', { email: formData.email, password: formData.password });
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      console.log('Sign in result:', { data, error: signInError });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        // Show user-friendly error messages
        let errorMessage = 'Sign in failed. ';
        if (signInError.message.includes('Invalid login credentials')) {
          errorMessage += 'Please check your email and password.';
        } else if (signInError.message.includes('Email not confirmed')) {
          errorMessage += 'Please check your email and confirm your account.';
        } else if (signInError.message.includes('Too many requests')) {
          errorMessage += 'Too many login attempts. Please try again later.';
        } else {
          errorMessage += signInError.message || 'Please try again.';
        }
        
        setError(errorMessage);
      } else if (data && data.user) {
        console.log('Sign in successful:', data);
        // Success - user will be automatically redirected by App.js
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
      } else {
        setError('Sign in successful but no user data received. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your NIL Matchup account</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Remember me (stay logged in)
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="auth-btn primary-btn"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <p>Don't have an account? 
          <button
            type="button"
            className="link-btn"
            onClick={onSwitchToSignup}
          >
            Create Account
          </button>
        </p>
        <p className="forgot-password">
          <button
            type="button"
            className="link-btn"
            onClick={() => alert('Password reset feature coming soon!')}
          >
            Forgot your password?
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 