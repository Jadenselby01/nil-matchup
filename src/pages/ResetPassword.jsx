import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ResetPassword() {
  const nav = useNavigate()
  const [pwd, setPwd] = useState('')
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    // Just touch the session so Supabase finalizes the recovery token
    supabase.auth.getSession()
  }, [])

  const onUpdate = async () => {
    setErr(null); setMsg(null)
    const { error } = await supabase.auth.updateUser({ password: pwd.trim() })
    if (error) setErr(error.message)
    else { setMsg('Password updated. Please sign in.'); setTimeout(() => nav('/login'), 800) }
  }

  return (
    <div style={{ maxWidth: 420, margin: '64px auto', padding: 16 }}>
      <h1>Set a new password</h1>
      <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="New password" style={{ width:'100%', marginBottom: 12 }} />
      <button onClick={onUpdate}>Update password</button>
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
    </div>
  )
} 