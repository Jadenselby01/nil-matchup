import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ensureProfile } from '../../utils/ensureProfile';
import HumanGate from '../HumanGate';
import './AuthForms.css';

const LoginForm = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const [humanOK, setHumanOK] = useState(false);
  
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(undefined);
    
    if (!humanOK) return setErr('Please verify you are human.');
    if (!email?.trim() || !password) return setErr('Email and password are required.');
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(), 
        password
      });
      
      if (error) throw error;
      
      await ensureProfile();
      navigate('/dashboard', { replace: true });
    } catch (e) {
      console.error('[SIGNIN ERROR]', e);
      const errorMessage = e?.message || 'Sign in failed.';
      const errorCode = e?.code ? ` (code: ${e.code})` : '';
      const errorDetails = e?.details ? ` details: ${e.details}` : '';
      setErr(`${errorMessage}${errorCode}${errorDetails}`);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="auth-form">
      <h2>Welcome Back</h2>
      <p>Sign in to your NIL Matchup account</p>
      
      {err && <div className="error-message">{err}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <HumanGate onChange={setHumanOK} />

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-switch">
        <p>Don't have an account? <button type="button" onClick={onSwitchToSignup}>Sign up</button></p>
      </div>
    </div>
  );
};

export default LoginForm; 