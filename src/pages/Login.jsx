import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import './Login.css'

export default function Login() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { 
    console.log('[Login] User state:', user)
    if (user) {
      console.log('[Login] User authenticated, redirecting to dashboard')
      nav('/dashboard', { replace: true }) 
    }
  }, [user, nav])

  const sendMagicLink = async () => {
    console.log('[Login] Sending magic link to:', email)
    setBusy(true); setErr(null); setMsg(null)
    
    const emailClean = email.trim().toLowerCase()
    if (!emailClean) { 
      setErr('Enter your email.'); 
      setBusy(false); 
      return 
    }
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailClean,
        options: { 
          emailRedirectTo: `${window.location.origin}/auth/callback`, 
          shouldCreateUser: true 
        }
      })
      
      if (error) {
        console.error('[Login] Magic link error:', error)
        setErr(error.message)
      } else {
        console.log('[Login] Magic link sent successfully')
        setMsg('Check your email for the login link.')
      }
    } catch (error) {
      console.error('[Login] Magic link exception:', error)
      setErr('Failed to send magic link. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const signInWithPassword = async () => {
    console.log('[Login] Signing in with password for:', email)
    setBusy(true); setErr(null); setMsg(null)
    
    const emailClean = email.trim().toLowerCase()
    const passwordClean = password.trim()
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: emailClean, 
        password: passwordClean 
      })
      
      if (error) {
        console.error('[Login] Password sign in error:', error)
        setErr(`${error.message} • Try "Send login link" above if you signed up without a password.`)
      } else {
        console.log('[Login] Password sign in successful:', data)
        setMsg('Signing you in...')
        setTimeout(() => nav('/dashboard'), 1000)
      }
    } catch (error) {
      console.error('[Login] Password sign in exception:', error)
      setErr('Failed to sign in. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🏈 NIL Matchup</h1>
          <p className="login-subtitle">Connect college athletes with local businesses</p>
        </div>

        {msg && (
          <div className="message success">
            <div className="message-icon">✅</div>
            <div className="message-text">{msg}</div>
          </div>
        )}

        {err && (
          <div className="message error">
            <div className="message-icon">⚠️</div>
            <div className="message-text">{err}</div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="form-input"
            disabled={busy}
          />
        </div>

        <button 
          disabled={busy || !email.trim()} 
          onClick={sendMagicLink} 
          className="btn btn-primary btn-magic"
        >
          {busy ? 'Sending...' : '✨ Send Magic Link'}
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <button 
          type="button" 
          onClick={() => setShowPassword(s => !s)} 
          className="btn btn-secondary btn-toggle"
          disabled={busy}
        >
          {showPassword ? '🔒 Hide Password Sign-in' : '🔑 Use Password Instead'}
        </button>

        {showPassword && (
          <div className="password-section">
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="form-input"
                disabled={busy}
              />
            </div>

            <button 
              disabled={busy || !email.trim() || !password.trim()} 
              onClick={signInWithPassword} 
              className="btn btn-primary btn-password"
            >
              {busy ? 'Signing in...' : '🚀 Sign In'}
            </button>

            <button
              type="button"
              onClick={async () => {
                const emailClean = email.trim().toLowerCase()
                if (!emailClean) return setErr('Enter your email then click "Forgot password".')
                
                try {
                  const { error } = await supabase.auth.resetPasswordForEmail(emailClean, {
                    redirectTo: `${window.location.origin}/reset-password`
                  })
                  
                  if (error) {
                    console.error('[Login] Password reset error:', error)
                    setErr(error.message)
                  } else {
                    setMsg('If an account exists, a reset link was sent.')
                  }
                } catch (error) {
                  console.error('[Login] Password reset exception:', error)
                  setErr('Failed to send password reset. Please try again.')
                }
              }}
              className="btn btn-link btn-forgot"
              disabled={busy}
            >
              Forgot password?
            </button>
          </div>
        )}

        <div className="login-footer">
          <p className="footer-text">
            Don't have an account? <span className="highlight">Sign up with magic link above!</span>
          </p>
        </div>

        {/* Debug info */}
        <div style={{ marginTop: '20px', padding: '10px', background: '#f7fafc', borderRadius: '8px', fontSize: '12px', color: '#718096' }}>
          <strong>Debug Info:</strong><br/>
          Origin: {window.location.origin}<br/>
          Auth State: {user ? 'Authenticated' : 'Not authenticated'}<br/>
          Loading: {busy ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  )
} 