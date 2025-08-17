import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForms.css';

const SignupForm = ({ onSwitchToLogin, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'athlete', // 'athlete' or 'business'
    firstName: '',
    lastName: '',
    // Athlete-specific fields
    sport: '',
    university: '',
    // Business-specific fields
    companyName: '',
    companyType: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Prepare user data based on user type
      const userData = {
        user_type: formData.userType,
        first_name: formData.firstName,
        last_name: formData.lastName,
        ...(formData.userType === 'athlete' && {
          sport: formData.sport,
          university: formData.university,
        }),
        ...(formData.userType === 'business' && {
          company_name: formData.companyName,
          company_type: formData.companyType,
        }),
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      if (result.success) {
        onSuccess && onSuccess(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create Your Account</h2>
      <p className="auth-subtitle">Join NIL Matchup to connect athletes and businesses</p>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="userType">I am a:</label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="athlete">Athlete</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Last name"
              disabled={loading}
            />
          </div>
        </div>

        {formData.userType === 'athlete' && (
          <>
            <div className="form-group">
              <label htmlFor="sport">Sport</label>
              <input
                type="text"
                id="sport"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                required
                placeholder="e.g., Basketball, Football"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="university">University</label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
                placeholder="University name"
                disabled={loading}
              />
            </div>
          </>
        )}

        {formData.userType === 'business' && (
          <>
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Company name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyType">Company Type</label>
              <input
                type="text"
                id="companyType"
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                required
                placeholder="e.g., Sports Equipment, Restaurant"
                disabled={loading}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="switch-link"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </p>
      </div>

      <div className="auth-footer">
        <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default SignupForm; 