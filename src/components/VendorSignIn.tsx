import { useEffect, useState, type FormEvent } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function VendorSignIn() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setError('');
    setBusy(true);
    try {
      if (user) {
        const result = await supabase.auth.signOut({ scope: 'local' });
        if (result.error) setError('Sign-out failed. Please try again.');
      } else {
        const identifier = String(fields.get('identifier')).trim();
        const password = String(fields.get('password'));
        const phone = identifier.replace(/[\s()-]/g, '').replace(/^0(\d{10})$/, '+234$1');
        if (!identifier.includes('@') && !/^\+[1-9]\d{6,14}$/.test(phone)) {
          setError('Enter your email, a Nigerian mobile number, or a number with its country code.');
          return;
        }
        const credentials = identifier.includes('@') ? { email: identifier, password } : { phone, password };
        const result = await supabase.auth.signInWithPassword(credentials);
        if (result.error) setError('Could not sign in. Check your details and try again.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = 'mt-1 block w-full rounded-xl border border-white/20 bg-black px-4 py-3 text-white';
  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-brand-ink p-6 text-white sm:p-8">
      <h2 className="font-display text-2xl font-bold">{user ? 'Vendor account' : 'Vendor sign-in'}</h2>
      {user === undefined ? <p className="mt-4" role="status">Checking your session…</p> : <>
        {user ? <p className="mt-4">Signed in as {user.email || user.phone}</p> : <>
          <label className="mt-5 block">Email or phone number
            <input className={inputStyle} name="identifier" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
          </label>
          <label className="mt-4 block">Password
            <input className={inputStyle} name="password" type="password" autoComplete="current-password" required />
          </label>
        </>}
        {error && <p role="alert" className="mt-3 text-sm">{error}</p>}
        <button disabled={busy} className="mt-5 rounded-full bg-white px-6 py-3 font-bold text-black disabled:opacity-60">
          {busy ? 'Please wait…' : user ? 'Sign out' : 'Sign in'}
        </button>
      </>}
    </form>
  );
}
