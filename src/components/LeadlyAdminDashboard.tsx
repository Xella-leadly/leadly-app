import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Zap,
  Search,
  RefreshCw,
  Trash2,
  Loader2,
  MessageCircle,
  TrendingUp,
  Clock,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import './leadly-admin.css';

type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  business: string;
  plan: 'starter' | 'pro' | null;
  message: string | null;
  created_at: string;
};

type PlanFilter = 'all' | 'starter' | 'pro' | 'free';

export default function LeadlyAdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      (async () => {
        setSession(nextSession);
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!authReady) {
    return (
      <div className="leadly-admin__auth">
        <div className="leadly-admin__auth-card">
          <div className="leadly-admin__auth-brand">
            <div className="leadly-admin__brand-mark">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="leadly-admin__brand-name">LEADLY</span>
          </div>
          <div className="leadly-admin__auth-subtitle">Loading…</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onSignedIn={(s) => setSession(s)} />;
  }

  return <Dashboard session={session} onSignOut={() => setSession(null)} />;
}

/* ---------------- Dashboard ---------------- */

function Dashboard({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'error' | 'info'; text: string } | null>(null);

  const email = session.user.email ?? 'admin';

  const loadLeads = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setNotice(null);

    const { data, error } = await supabase
      .from('leads')
      .select('id, name, whatsapp, business, plan, message, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      setNotice({ kind: 'error', text: 'Could not load leads. Please try again.' });
      setLeads([]);
    } else {
      setLeads((data ?? []) as Lead[]);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setNotice(null);
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      setNotice({ kind: 'error', text: 'Could not delete that lead. Please try again.' });
    } else {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
    setDeletingId(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (planFilter === 'starter' && l.plan !== 'starter') return false;
      if (planFilter === 'pro' && l.plan !== 'pro') return false;
      if (planFilter === 'free' && l.plan !== null) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.whatsapp.toLowerCase().includes(q) ||
        l.business.toLowerCase().includes(q) ||
        (l.message ?? '').toLowerCase().includes(q)
      );
    });
  }, [leads, search, planFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const last24h = leads.filter(
      (l) => Date.now() - new Date(l.created_at).getTime() <= 24 * 60 * 60 * 1000
    ).length;
    const pro = leads.filter((l) => l.plan === 'pro').length;
    const starter = leads.filter((l) => l.plan === 'starter').length;
    const free = leads.filter((l) => l.plan === null).length;
    return { total, last24h, pro, starter, free };
  }, [leads]);

  return (
    <div className="leadly-admin">
      <div className="leadly-admin__topbar">
        <div className="leadly-admin__brand">
          <div className="leadly-admin__brand-mark">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="leadly-admin__brand-name">LEADLY</span>
          <span className="leadly-admin__brand-suffix">Admin</span>
        </div>
        <div className="leadly-admin__topbar-actions">
          <div className="leadly-admin__user-chip">{email}</div>
          <button className="leadly-admin__refresh" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="leadly-admin__body leadly-admin__fade">
        <div className="leadly-admin__header">
          <h1 className="leadly-admin__title">Leads</h1>
          <p className="leadly-admin__subtitle">
            Every lead collected from the landing page, newest first. Search, filter by plan, or remove a lead.
          </p>
        </div>

        <div className="leadly-admin__stats">
          <StatCard icon={<TrendingUp size={18} />} label="Total leads" value={stats.total} />
          <StatCard icon={<Clock size={18} />} label="Last 24h" value={stats.last24h} />
          <StatCard icon={<ShoppingBag size={18} />} label="Pro interest" value={stats.pro} />
          <StatCard icon={<MessageCircle size={18} />} label="Free trial" value={stats.free} />
        </div>

        <div className="leadly-admin__toolbar">
          <div className="leadly-admin__search">
            <span className="leadly-admin__search-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="leadly-admin__search-input"
              placeholder="Search name, WhatsApp, business, message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="leadly-admin__select"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as PlanFilter)}
          >
            <option value="all">All plans</option>
            <option value="free">Free trial</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
          </select>
          <button
            className="leadly-admin__refresh"
            onClick={() => loadLeads(true)}
            disabled={refreshing}
          >
            {refreshing ? <Loader2 size={16} className="leadly-admin__spinner" /> : <RefreshCw size={16} />}
            Refresh
          </button>
        </div>

        {notice && (
          <div className="leadly-admin__notice">
            <AlertCircle size={16} />
            {notice.text}
          </div>
        )}

        <div className="leadly-admin__card">
          <div className="leadly-admin__table-wrap">
            <table className="leadly-admin__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>WhatsApp</th>
                  <th>Business</th>
                  <th>Plan</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th aria-label="Delete" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="leadly-admin__state">
                        <Loader2 size={22} className="leadly-admin__spinner" />
                        <p className="leadly-admin__state-text">Loading leads…</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="leadly-admin__state">
                        <p className="leadly-admin__state-title">No leads yet</p>
                        <p className="leadly-admin__state-text">
                          {leads.length === 0
                            ? 'Leads submitted from your landing page will appear here.'
                            : 'No leads match your search or filter.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr key={lead.id}>
                      <td className="leadly-admin__name-cell">{lead.name}</td>
                      <td className="leadly-admin__whatsapp-cell">{lead.whatsapp}</td>
                      <td>{lead.business}</td>
                      <td>
                        <PlanBadge plan={lead.plan} />
                      </td>
                      <td className="leadly-admin__message-cell">
                        {lead.message ? (
                          <span className="leadly-admin__message-cell-truncate">{lead.message}</span>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                        )}
                      </td>
                      <td className="leadly-admin__time-cell">{formatTime(lead.created_at)}</td>
                      <td>
                        <button
                          className="leadly-admin__delete-btn"
                          onClick={() => handleDelete(lead.id)}
                          disabled={deletingId === lead.id}
                          aria-label={`Delete lead from ${lead.name}`}
                        >
                          {deletingId === lead.id ? (
                            <Loader2 size={14} className="leadly-admin__spinner" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="leadly-admin__stat">
      <div className="leadly-admin__stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <span style={{ opacity: 0.7 }}>{icon}</span>
        {label}
      </div>
      <div className="leadly-admin__stat-value">
        {value}
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: 'starter' | 'pro' | null }) {
  if (plan === 'pro') {
    return <span className="leadly-admin__plan-badge leadly-admin__plan-badge--pro">Pro</span>;
  }
  if (plan === 'starter') {
    return <span className="leadly-admin__plan-badge leadly-admin__plan-badge--starter">Starter</span>;
  }
  return <span className="leadly-admin__plan-badge leadly-admin__plan-badge--free">Free trial</span>;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* ---------------- Auth screen ---------------- */

function AuthScreen({ onSignedIn }: { onSignedIn: (s: Session) => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      setSubmitting(false);
      return;
    }

    const result =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
        : await supabase.auth.signUp({ email: trimmedEmail, password });

    const err = result.error;
    if (err) {
      setError(
        mode === 'signin'
          ? 'Could not sign in. Check your email and password.'
          : 'Could not create your account. That email may already be in use.'
      );
      setSubmitting(false);
      return;
    }

    // For sign-up without email confirmation, Supabase returns a session immediately.
    const nextSession = 'session' in result.data ? result.data.session : null;
    if (nextSession) {
      onSignedIn(nextSession);
    } else {
      // Sign-up that requires confirmation: switch to sign-in hint.
      setMode('signin');
      setError('Account created. Sign in with your email and password.');
    }
    setSubmitting(false);
  };

  return (
    <div className="leadly-admin__auth">
      <div className="leadly-admin__auth-card leadly-admin__fade">
        <div className="leadly-admin__auth-brand">
          <div className="leadly-admin__brand-mark">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="leadly-admin__brand-name">LEADLY</span>
          <span className="leadly-admin__brand-suffix">Admin</span>
        </div>

        <h1 className="leadly-admin__auth-title">
          {mode === 'signin' ? 'Welcome back' : 'Create your admin account'}
        </h1>
        <p className="leadly-admin__auth-subtitle">
          {mode === 'signin'
            ? 'Sign in to view and manage leads collected from your landing page.'
            : 'Set up the operator account that can view and manage leads.'}
        </p>

        {error && <div className="leadly-admin__auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="leadly-admin__field">
            <label className="leadly-admin__label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className="leadly-admin__input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="leadly-admin__field">
            <label className="leadly-admin__label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="leadly-admin__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          <button type="submit" className="leadly-admin__btn-primary" disabled={submitting}>
            {submitting ? (
              <Loader2 size={16} className="leadly-admin__spinner" />
            ) : mode === 'signin' ? (
              'Sign in'
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="leadly-admin__auth-divider" />

        <div className="leadly-admin__auth-switch">
          {mode === 'signin' ? (
            <>
              No admin account yet?{' '}
              <button onClick={() => { setMode('signup'); setError(''); }}>
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('signin'); setError(''); }}>
                Sign in
              </button>
            </>
          )}
        </div>

        <p className="leadly-admin__auth-footer">
          Only signed-in admins can view leads. Visitors can submit leads from the landing page without an account.
        </p>
      </div>
    </div>
  );
}
