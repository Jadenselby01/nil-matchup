import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
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
  const [remember, setRemember] = useState(true);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  
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
    if (!recaptchaToken) {
      setError('Please complete the human verification');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug logging
    console.log('Form submission started');
    console.log('reCAPTCHA token:', recaptchaToken);
    console.log('Form data:', formData);
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare user data for signup
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        display_name: `${formData.firstName} ${formData.lastName}`.trim()
      };

      if (formData.userType === 'athlete') {
        userData.sport = formData.sport;
        userData.university = formData.university;
        userData.bio = formData.bio;
      } else if (formData.userType === 'business') {
        userData.company_name = formData.companyName;
        userData.company_type = formData.companyType;
        userData.bio = formData.bio;
      }

      console.log('Attempting signup with data:', userData);

      // Create user account with role in metadata
      const { error: signUpError } = await signUp(
        formData.email, 
        formData.password, 
        formData.userType,
        userData
      );

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(signUpError.message || 'Failed to create account. Please try again.');
        return;
      }

      // Success - AuthContext will handle profile creation and redirect
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
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

  const handleRecaptchaChange = (token) => {
    console.log('reCAPTCHA token received:', token);
    setRecaptchaToken(token);
    setError(''); // Clear any previous errors
  };

  const handleRecaptchaExpired = () => {
    console.log('reCAPTCHA expired');
    setRecaptchaToken(null);
    setError('Human verification expired. Please complete it again.');
  };

  const handleRecaptchaError = () => {
    console.log('reCAPTCHA error');
    setRecaptchaToken(null);
    setError('Human verification failed. Please try again.');
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
                disabled={loading}
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
                disabled={loading}
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
              required={formData.userType === 'athlete'}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required={formData.userType === 'athlete'}
              disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="e.g., UNC Chapel Hill"
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}

        {formData.userType === 'business' && (
          <>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Company Type</label>
              <input
                type="text"
                name="companyType"
                value={formData.companyType}
                onChange={handleInputChange}
                placeholder="e.g., Restaurant, Retail, Service"
                disabled={loading}
              />
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
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
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
              required
              minLength="6"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength="6"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="checkmark"></span>
            I agree to the <a href="/terms-of-service" target="_blank">Terms of Service</a> *
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="checkmark"></span>
            I agree to the <a href="/privacy-policy" target="_blank">Privacy Policy</a> *
          </label>
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

        <div className="form-group">
          <label>Human Verification *</label>
          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
              onChange={handleRecaptchaChange}
              onExpired={handleRecaptchaExpired}
              onError={handleRecaptchaError}
            />
          </div>
          {recaptchaToken && (
            <div className="recaptcha-success">
              ✅ Human verification completed
            </div>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-switch">
        <p>Already have an account? <button type="button" onClick={onSwitchToLogin}>Sign in</button></p>
      </div>
    </div>
  );
};

export default SignupForm; 