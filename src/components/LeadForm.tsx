import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { sellerLink, type SellerPlan } from './sellerRoutes';

export function LeadForm({ user, plan }: { user: User; plan: SellerPlan | null }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const sending = useRef(false);
  const previousRequest = useRef<{ payload: string; key: string } | null>(null);
  const planName = plan === 'starter' ? 'Starter' : 'Pro';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get('name') ?? '').trim();
    const whatsapp = String(fields.get('whatsapp') ?? '').trim().replace(/[\s()-]/g, '').replace(/^0(\d{10})$/, '+234$1');
    const business = String(fields.get('business') ?? '').trim();
    const message = String(fields.get('message') ?? '').trim();
    if (!name || !business || !/^\+[1-9]\d{6,14}$/.test(whatsapp)) {
      setError('Include your name, what you sell and a WhatsApp number with its country code or a Nigerian mobile number.');
      return;
    }
    sending.current = true;
    setStatus('sending');
    setError('');
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session || session.user.id !== user.id) {
        window.location.replace(sellerLink('/sign-in', plan));
        return;
      }
      const payload = { name, whatsapp, business, plan, message: message || null };
      const serialized = JSON.stringify(payload);
      if (previousRequest.current?.payload !== serialized) {
        previousRequest.current = { payload: serialized, key: crypto.randomUUID() };
      }
      const { data, error } = await supabase.rpc('submit_seller_request', {
        p_key: previousRequest.current.key, p_name: name, p_whatsapp: whatsapp,
        p_business: business, p_plan: plan, p_message: payload.message,
      });
      if (error?.code === 'PGRST202') {
        // Keep the existing signed-in form working during the database rollout.
        const legacy = await supabase.functions.invoke('submit-lead', {
          headers: { Authorization: 'Bearer ' + session.access_token }, body: payload,
        });
        if (legacy.error || legacy.data?.success !== true) throw new Error('Unconfirmed request');
      } else if (error || typeof data !== 'string' || !data) {
        throw new Error('Unconfirmed request');
      }
      setStatus('sent');
    } catch {
      setError('We couldn’t confirm that your request was saved. Your details are still here.');
      setStatus('idle');
    } finally {
      sending.current = false;
    }
  }

  if (status === 'sent') return <section className="access-card request-success" role="status">
    <CheckCircle2 size={36} /><h2>Request received</h2><p>LEADLY has received your product details and WhatsApp number{plan ? ' for the ' + planName + ' plan' : ''}.</p>
    <a href="/" className="site-btn btn-ink">Back to home <ArrowRight size={16} /></a>
  </section>;

  return <section className="access-card"><h2>{plan ? planName + ' buyer request' : 'Request your first buyers'}</h2>
    <p>{plan ? 'Review your details and send your plan request. No payment is taken here.' : 'Request your first 10 buyers free. Tell us what you sell and where you can deliver.'}</p>
    <form className="account-form" onSubmit={submit}>
      <label htmlFor="request-name">Your name</label><input id="request-name" name="name" autoComplete="name" maxLength={120} required />
      <label htmlFor="request-whatsapp">Business WhatsApp</label><input id="request-whatsapp" type="tel" name="whatsapp" autoComplete="tel" defaultValue={user.phone ?? ''} placeholder="e.g. +234 800 000 0000" maxLength={32} required />
      <label htmlFor="request-business">What do you sell?</label><input id="request-business" name="business" placeholder="e.g. Canvas totes in Ilishan-Remo" maxLength={300} required />
      <label htmlFor="request-message">Delivery area or other details <span>(optional)</span></label><textarea id="request-message" name="message" rows={3} maxLength={1500} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="site-btn btn-ink form-submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send buyer request'}<ArrowRight size={17} /></button>
    </form>
  </section>;
}
