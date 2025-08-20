import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { supabase } from '../../lib/supabaseClient';
import './AuthForms.css';

const SignupForm = ({ onSwitchToLogin, onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
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
    if (formData.userType === 'athlete') {
      if (!formData.firstName || !formData.sport || !formData.university) {
        setError('Please fill in all athlete-specific fields');
        return false;
      }
    }
    if (formData.userType === 'business') {
      if (!formData.companyName || !formData.companyType) {
        setError('Please fill in all business-specific fields');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        sport: formData.sport,
        university: formData.university,
        company_name: formData.companyName,
        company_type: formData.companyType,
        bio: formData.bio
      };

      // Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: formData.userType,
            ...profileData
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(signUpError.message || 'Failed to create account. Please try again.');
        return;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: formData.email,
            user_type: formData.userType,
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            sport: profileData.sport || '',
            university: profileData.university || '',
            company_name: profileData.company_name || '',
            company_type: profileData.company_type || '',
            bio: profileData.bio || '',
            is_verified: false
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't fail the signup if profile creation fails
        }

        setSuccess('Account created successfully! Please check your email to verify your account.');
        setFormData({
          email: '', password: '', confirmPassword: '', userType: 'athlete',
          firstName: '', lastName: '', sport: '', university: '',
          companyName: '', companyType: '', bio: '',
          agreeToTerms: false, agreeToPrivacy: false
        });
        setRecaptchaToken(null);
        
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
      }
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create Your Account</h2>
      <p className="auth-subtitle">Join NIL Matchup and start connecting!</p>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>I am a:</label>
          <div className="user-type-selector">
            <label className="radio-label">
              <input type="radio" name="userType" value="athlete" checked={formData.userType === 'athlete'} onChange={(e) => handleInputChange('userType', e.target.value)} />
              <span className="radio-custom"></span> Athlete
            </label>
            <label className="radio-label">
              <input type="radio" name="userType" value="business" checked={formData.userType === 'business'} onChange={(e) => handleInputChange('userType', e.target.value)} />
              <span className="radio-custom"></span> Business
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="Enter your first name" required />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Enter your last name" required />
          </div>
        </div>
        {formData.userType === 'athlete' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Sport *</label>
                <select value={formData.sport} onChange={(e) => handleInputChange('sport', e.target.value)} required>
                  <option value="">Select your sport</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Baseball">Baseball</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Track & Field">Track & Field</option>
                  <option value="Golf">Golf</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>University *</label>
                <input type="text" value={formData.university} onChange={(e) => handleInputChange('university', e.target.value)} placeholder="Enter your university" required />
              </div>
            </div>
          </>
        )}
        {formData.userType === 'business' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input type="text" value={formData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} placeholder="Enter your company name" required />
              </div>
              <div className="form-group">
                <label>Company Type *</label>
                <select value={formData.companyType} onChange={(e) => handleInputChange('companyType', e.target.value)} required>
                  <option value="">Select company type</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Retail">Retail</option>
                  <option value="Fitness & Wellness">Fitness & Wellness</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </>
        )}
        <div className="form-group">
          <label>Bio</label>
          <textarea value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} placeholder={`Tell us about yourself as a ${formData.userType}...`} rows="3" />
        </div>
        <div className="form-group">
          <label>Email Address *</label>
          <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Enter your email address" required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Password *</label>
            <input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Create a password (min. 8 characters)" required />
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder="Confirm your password" required />
          </div>
        </div>
        <div className="form-group">
          <label>Human Verification *</label>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
            onChange={handleRecaptchaChange}
            theme="light"
          />
        </div>
        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.agreeToTerms} onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)} required />
              <span className="checkbox-custom"></span> I agree to the <a href="/terms" target="_blank">Terms of Service</a> *
            </label>
          </div>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.agreeToPrivacy} onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)} required />
              <span className="checkbox-custom"></span> I agree to the <a href="/privacy" target="_blank">Privacy Policy</a> *
            </label>
          </div>
        </div>
        <button type="submit" className="auth-btn primary-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <div className="auth-footer">
        <p>Already have an account? 
          <button type="button" className="link-btn" onClick={onSwitchToLogin}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm; 