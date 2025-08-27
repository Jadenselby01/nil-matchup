import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { ensureProfile } from '../../utils/ensureProfile';
import HumanGate from '../HumanGate';
import './AuthForms.css';

const SignupForm = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm: '',
    role: 'athlete',
    firstName: '',
    lastName: '',
    sport: '',
    university: '',
    companyName: '',
    companyType: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const [humanOK, setHumanOK] = useState(false);
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(undefined);
    
    if (!humanOK) return setErr('Please verify you are human.');
    if (!form.email?.trim() || !form.password) return setErr('Email and password are required.');
    if (form.password !== form.confirm) return setErr('Passwords do not match.');
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            role: form.role,
            display_name: `${form.firstName} ${form.lastName}`.trim(),
            sport: form.sport, 
            university: form.university, 
            bio: form.bio
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
      await ensureProfile(form.role);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setErr(e?.message ?? 'Sign up failed.');
    } finally { 
      setLoading(false); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErr(undefined);
  };

  return (
    <div className="auth-form">
      <h2>Create Your Account</h2>
      <p>Join NIL Matchup and start connecting!</p>
      
      {err && <div className="error-message">{err}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>I am a:</label>
          <div className="user-type-selector">
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="athlete"
                checked={form.role === 'athlete'}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span className="radio-custom"></span>
              Athlete
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="business"
                checked={form.role === 'business'}
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
              value={form.firstName}
              onChange={handleInputChange}
              required={form.role === 'athlete'}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleInputChange}
              required={form.role === 'athlete'}
              disabled={loading}
            />
          </div>
        </div>

        {form.role === 'athlete' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Sport</label>
                <input
                  type="text"
                  name="sport"
                  value={form.sport}
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
                  value={form.university}
                  onChange={handleInputChange}
                  placeholder="e.g., UNC Chapel Hill"
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}

        {form.role === 'business' && (
          <>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
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
                value={form.companyType}
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
            value={form.bio}
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
            value={form.email}
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
              value={form.password}
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
              name="confirm"
              value={form.confirm}
              onChange={handleInputChange}
              required
              minLength="6"
              disabled={loading}
            />
          </div>
        </div>

        <HumanGate onChange={setHumanOK} />

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