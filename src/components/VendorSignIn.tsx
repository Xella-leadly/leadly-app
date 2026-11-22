import { useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Brand } from './Navbar';
import { LeadForm } from './LeadForm';
import { selectedSellerPlan, sellerLink } from './sellerRoutes';

export function VendorSignIn({ path }: { path: '/sign-in' | '/seller' }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [signOutError, setSignOutError] = useState('');
  const [leaving, setLeaving] = useState(false);
  const plan = selectedSellerPlan();
  const signingIn = path === '/sign-in';

  useEffect(() => {
    document.title = signingIn ? 'Seller sign-in | LEADLY' : 'Seller workspace | LEADLY';
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    const restore = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    window.addEventListener('pageshow', restore);
    return () => { data.subscription.unsubscribe(); window.removeEventListener('pageshow', restore); };
  }, [signingIn]);

  useEffect(() => {
    if (session === undefined) return;
    if (session && signingIn) window.location.replace(sellerLink('/seller', plan));
    if (!session && !signingIn) window.location.replace(sellerLink('/sign-in', plan));
  }, [session, signingIn, plan]);

  async function signOut() {
    setLeaving(true);
    setSignOutError('');
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
    } catch {
      setLeaving(false);
      setSignOutError('We couldn’t sign you out. Please try again.');
    }
  }

  return <div className="seller-site account-page">
    <header className="site-header"><div className="site-width nav-inner"><Brand /><a className="home-link" href="/"><ArrowLeft size={16} /> Back to home</a></div></header>
    {session === undefined || (signingIn && session) || (!signingIn && !session)
      ? <main className="site-width account-loading" role="status">Opening your seller account…</main>
      : signingIn
        ? <main className="site-width access-grid">
            <div className="access-intro"><h1>Your seller workspace.</h1><p>Describe your products, choose where you sell and send a buyer request from one place.</p></div>
            <section className="access-card"><h2>Seller sign-in</h2><p>{plan ? 'Sign in to continue with the ' + (plan === 'pro' ? 'Pro' : 'Starter') + ' plan.' : 'Use the email or phone number on your vendor account.'}</p><SignInForm /></section>
          </main>
        : session && <main className="site-width workspace-grid">
            <div className="workspace-intro"><h1>Seller workspace</h1><p>Tell us what a good buyer looks like for your business.</p>
              <div className="account-identity"><span>Signed in as</span><strong>{session.user.email || session.user.phone || 'LEADLY seller'}</strong></div>
              <button className="text-action" type="button" disabled={leaving} onClick={signOut}><LogOut size={16} />{leaving ? 'Signing out…' : 'Sign out'}</button>
              {signOutError && <p role="alert">{signOutError}</p>}
            </div>
            <LeadForm key={session.user.id} user={session.user} plan={plan} />
          </main>}
  </div>;
}

function SignInForm() {
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    const identifier = String(fields.get('identifier') ?? '').trim();
    const password = String(fields.get('password') ?? '');
    const phone = identifier.replace(/[\s()-]/g, '').replace(/^0(\d{10})$/, '+234$1');
    if (!identifier.includes('@') && !/^\+[1-9]\d{6,14}$/.test(phone)) {
      setError('Enter your email, a Nigerian mobile number or a number with its country code.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const credentials = identifier.includes('@') ? { email: identifier, password } : { phone, password };
      const result = await supabase.auth.signInWithPassword(credentials);
      if (result.error) {
        setError(result.error.status === 429 ? 'Too many attempts. Please wait before trying again.' : 'Couldn’t sign in. Check your account details and try again.');
        setBusy(false);
      }
    } catch {
      setError('Connection failed. Please try again.');
      setBusy(false);
    }
  }
  return <form className="account-form" onSubmit={submit}>
    <label htmlFor="seller-identifier">Email or phone number</label>
    <input id="seller-identifier" name="identifier" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
    <label htmlFor="seller-password">Password</label>
    <div className="password-field"><input id="seller-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required />
      <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="site-btn btn-ink form-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}<ArrowRight size={17} /></button>
  </form>;
}
