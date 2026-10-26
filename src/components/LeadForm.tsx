import { useEffect, useState, type FormEvent } from 'react';
import { X, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useLeadForm } from './LeadFormContext';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function LeadForm() {
  const { isOpen, close, selectedPlan } = useLeadForm();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const whatsapp = String(formData.get('whatsapp') ?? '').trim();
    const business = String(formData.get('business') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (!name || !whatsapp || !business) {
      setStatus('error');
      setErrorMsg('Please fill in your name, WhatsApp number, and what you sell.');
      return;
    }

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-lead`;
    let response: Response;
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          name,
          whatsapp,
          business,
          plan: selectedPlan ?? null,
          message: message || null,
        }),
      });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }

    if (!response.ok) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }

    setStatus('success');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-brand-ink shadow-2xl animate-fade-up">
        <button
          onClick={close}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close form"
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="px-7 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-black">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-extrabold text-white">
              You’re in.
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm text-white/65">
              {selectedPlan
                ? `We’ve received your request for the ${selectedPlan === 'pro' ? 'Pro' : 'Starter'} plan. Your first 10 buyers are on the way to your WhatsApp within 24 hours.`
                : 'Your first 10 buyers are on the way to your WhatsApp within 24 hours. We’ll be in touch shortly.'}
            </p>
            <button
              onClick={close}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:bg-brand-porcelain active:scale-95"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-7 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              {selectedPlan ? `${selectedPlan === 'pro' ? 'Pro' : 'Starter'} plan` : 'Free trial'}
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-white">
              Get your first 10 buyers free
            </h3>
            <p className="mt-2 text-sm text-white/55">
              Tell us what you sell and where to send the buyers.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field label="Your name" name="name" placeholder="Amaka Obi" />
              <Field
                label="WhatsApp number"
                name="whatsapp"
                placeholder="+234 800 000 0000"
                type="tel"
              />
              <Field
                label="What do you sell?"
                name="business"
                placeholder="e.g. iPhones, fashion, cosmetics"
              />

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-white/70">
                  Anything else? <span className="text-white/40">(optional)</span>
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell us about your business or where you sell."
                  className="w-full resize-none rounded-xl border border-white/15 bg-brand-black px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/50"
                />
              </div>

              {status === 'error' && (
                <p className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-black transition-all hover:bg-brand-porcelain active:scale-95 disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Get my buyers
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-white/40">
                No credit card needed. Buyers delivered within 24 hours.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = 'text',
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-white/70">{label}</label>
      <input
        type={type}
        name={name}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-brand-black px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/50"
      />
    </div>
  );
}
