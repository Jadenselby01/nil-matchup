import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { assertProfileExists } from '../../utils/assertProfile';
import './AuthForms.css';

const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'athlete',
    firstName: '',
    lastName: '',
    sport: '',
    university: '',
    companyName: '',
    companyType: '',
    bio: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [remember, setRemember] = useState(true);
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      setError('Please agree to the terms and privacy policy');
      return false;
    }
    if (formData.userType === 'athlete' && (!formData.firstName || !formData.lastName)) {
      setError('Please provide your first and last name');
      return false;
    }
    if (formData.userType === 'business' && !formData.companyName) {
      setError('Please provide your company name');
      return false;
    }
    return true;
  };

  const createUserProfile = async (userId, email) => {
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const role = formData.userType;
      
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
          full_name: fullName,
          role: role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to create profile';
        console.error('Profile creation failed:', {
          status: response.status,
          error: errorData,
          message: errorMessage
        });
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Profile created successfully:', result);
      return true;
    } catch (error) {
      console.error('Profile creation error:', error);
      const message = (error && (error.message || error.error_description)) || 'Unknown error';
      console.error('Profiles upsert failed', {
        message,
        code: error?.code,
        details: error,
      });
      throw new Error(
        `Profile save failed: ${message}. If this mentions row-level security or "PGRST", ensure RLS policies and the auth trigger are installed.`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create user account
      const { error: signUpError } = await signUp(formData.email, formData.password, remember);

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(signUpError.message || 'Failed to create account. Please try again.');
        return;
      }

      // Success - ensure profile exists and redirect
      try {
        await assertProfileExists();
      } catch (profileError) {
        console.warn('Profile check failed:', profileError);
        // Continue anyway - don't block signup
      }

      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/athlete-dashboard', { replace: true });
      }, 1500);
      
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      setError('An unexpected error occurred. Please try again.');
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
      <h2>Create Your Account</h2>
      <p>Join NIL Matchup and start connecting!</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>I am a:</label>
          <div className="user-type-selector">
            <label className="radio-label">
              <input
                type="radio"
                name="userType"
                value="athlete"
                checked={formData.userType === 'athlete'}
                onChange={handleInputChange}
              />
              <span className="radio-custom"></span>
              Athlete
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="userType"
                value="business"
                checked={formData.userType === 'business'}
                onChange={handleInputChange}
              />
              <span className="radio-custom"></span>
              Business
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        {formData.userType === 'athlete' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Sport</label>
                <input
                  type="text"
                  name="sport"
                  value={formData.sport}
                  onChange={handleInputChange}
                  placeholder="e.g., Football, Basketball"
                />
              </div>
              <div className="form-group">
                <label>University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="Your university"
                />
              </div>
            </div>
          </>
        )}

        {formData.userType === 'business' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Company Type</label>
                <input
                  type="text"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  placeholder="e.g., Sports Marketing, Brand"
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
            />
            <span className="checkbox-custom"></span>
            I agree to the Terms of Service
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onChange={handleInputChange}
            />
            <span className="checkbox-custom"></span>
            I agree to the Privacy Policy
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="checkbox-custom"></span>
            Remember me (stay logged in)
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-switch">
        <p>Already have an account? <button type="button" onClick={onSwitchToLogin}>Sign In</button></p>
      </div>
    </div>
  );
};

export default SignupForm; 