import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Login() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (user) nav('/dashboard', { replace: true }) }, [user, nav])

  const sendMagicLink = async () => {
    setBusy(true); setErr(null); setMsg(null)
    const emailClean = email.trim().toLowerCase()
    if (!emailClean) { setErr('Enter your email.'); setBusy(false); return }
    const { error } = await supabase.auth.signInWithOtp({
      email: emailClean,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback`, shouldCreateUser: true }
    })
    setBusy(false)
    if (error) setErr(error.message)
    else setMsg('Check your email for the login link.')
  }

  const signInWithPassword = async () => {
    setBusy(true); setErr(null); setMsg(null)
    const emailClean = email.trim().toLowerCase()
    const passwordClean = password.trim()
    const { error } = await supabase.auth.signInWithPassword({ email: emailClean, password: passwordClean })
    setBusy(false)
    if (error) {
      setErr(`${error.message} • Try "Send login link" above if you signed up without a password.`)
    } else {
      nav('/dashboard')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '64px auto', padding: 16 }}>
      <h1>Sign in</h1>
      <label>Email</label>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        style={{ width: '100%', marginBottom: 12 }}
      />
      <button disabled={busy} onClick={sendMagicLink} style={{ width: '100%' }}>
        {busy ? 'Sending…' : 'Send login link'}
      </button>

      <div style={{ margin: '12px 0' }}>
        <button type="button" onClick={() => setShowPassword(s => !s)}>
          {showPassword ? 'Hide password sign-in' : 'Use password instead'}
        </button>
      </div>

      {showPassword && (
        <>
          <label>Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            style={{ width: '100%', marginBottom: 12 }}
          />
          <button disabled={busy} onClick={signInWithPassword} style={{ width: '100%' }}>
            {busy ? 'Signing in…' : 'Sign in with password'}
          </button>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={async () => {
                const emailClean = email.trim().toLowerCase()
                if (!emailClean) return setErr('Enter your email then click "Forgot password".')
                const { error } = await supabase.auth.resetPasswordForEmail(emailClean, {
                  redirectTo: `${window.location.origin}/reset-password`
                })
                if (error) setErr(error.message)
                else setMsg('If an account exists, a reset link was sent.')
              }}
            >
              Forgot password?
            </button>
          </div>
        </>
      )}

      {msg && <p style={{ color: 'green', marginTop: 12 }}>{msg}</p>}
      {err && <p style={{ color: 'crimson', marginTop: 12 }}>{err}</p>}
    </div>
  )
} 