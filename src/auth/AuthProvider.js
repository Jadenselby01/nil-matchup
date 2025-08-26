import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email, password, remember = true) {
    localStorage.setItem('remember_me', remember ? '1' : '0'); // preference only; session already persists
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ?? undefined };
  }

  async function signUp(email, password, remember = true) {
    localStorage.setItem('remember_me', remember ? '1' : '0');
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error ?? undefined };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthCtx.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx); 