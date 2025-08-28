import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  const nav = useNavigate()
  const [err, setErr] = useState(null)

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        if (!code) {
          // Some providers deliver the token via hash; try fromURL helper
          const { data, error } = await supabase.auth.getSession()
          if (!data.session && !error) {
            // Last attempt: exchange using full URL (supports PKCE links)
            const res = await supabase.auth.exchangeCodeForSession(window.location.href)
            if (res.error) throw res.error
          }
        } else {
          const { error } = await supabase.auth.exchangeCodeForSession({ code })
          if (error) throw error
        }
        nav('/dashboard', { replace: true })
      } catch (e) {
        setErr(e?.message || 'Auth callback failed.')
      }
    }
    run()
  }, [nav])

  return <div style={{ padding: 24 }}>{err ? <p style={{ color: 'crimson' }}>{err}</p> : <p>Finishing sign-in…</p>}</div>
} 