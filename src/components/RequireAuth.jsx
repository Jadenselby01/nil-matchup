import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function RequireAuth({ children }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      setAuthed(!!session);
      setReady(true);

      supabase.auth.onAuthStateChange((_e, s) => {
        if (!mounted) return;
        setAuthed(!!s);
      });
    }
    init();

    return () => { mounted = false; };
  }, []);

  if (!ready) return null;
  if (!authed) {
    window.location.href = '/login';
    return null;
  }
  return children;
} 