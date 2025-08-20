import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForms.css';

const LoginForm = ({ onSwitchToSignup, onAuthSuccess }) => {
  const { signIn } = useAuth();
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
    // Clear error when user starts typing
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
      
      const { data, error } = await signIn(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      console.log('Sign in result:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        
        // Show user-friendly error messages
        let errorMessage = 'Sign in failed. ';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage += 'Please check your email and password.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage += 'Please check your email and confirm your account.';
        } else if (error.message.includes('Supabase configuration missing')) {
          errorMessage += 'System configuration error. Please contact support.';
        } else {
          errorMessage += error.message || 'Please try again.';
        }
        
        setError(errorMessage);
      } else if (data && data.user) {
        console.log('Sign in successful:', data);
        // Success - user will be automatically redirected by AuthContext
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