import { Check, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { useLeadForm } from './LeadFormContext';

const plans = [
  {
    id: 'starter' as const,
    name: 'Starter',
    price: '₦25,000',
    period: '/month',
    tagline: 'For sellers just getting consistent buyers',
    features: [
      'Up to 30 verified buyers / month',
      'WhatsApp delivery within 24 hrs',
      '1 product category',
      'Basic buyer targeting',
      'Email support',
    ],
    cta: 'Start with Starter',
    featured: false,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '₦60,000',
    period: '/month',
    tagline: 'For sellers ready to scale fast',
    features: [
      'Up to 100 verified buyers / month',
      'Priority WhatsApp delivery',
      'Up to 3 product categories',
      'Advanced buyer targeting + filters',
      'Weekly performance reports',
      'Dedicated support line',
    ],
    cta: 'Scale with Pro',
    featured: true,
  },
];

export function Pricing() {
  const { open } = useLeadForm();

  return (
    <section id="pricing" className="relative bg-brand-black py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Pricing
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pay for buyers, not ads.
          </h2>
          <p className="mt-5 text-lg text-white/60">
            Try your first 10 buyers free. Then pick a plan that fits how fast you want to grow.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 lg:grid-cols-2">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 120}>
              <div
                className={`relative h-full overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
                  plan.featured
                    ? 'border-white/30 bg-brand-charcoal'
                    : 'border-white/10 bg-brand-ink hover:border-white/20'
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                    Most popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-extrabold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-white/55">{plan.tagline}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="pb-1 text-sm text-white/50">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.featured ? 'bg-white text-black' : 'bg-white/10 text-white'
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-white/75">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => open(plan.id)}
                  className={`group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all active:scale-95 ${
                    plan.featured
                      ? 'bg-white text-black hover:bg-brand-porcelain'
                      : 'border border-white/20 bg-transparent text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-2xl text-center" delay={200}>
          <p className="text-sm text-white/45">
            Every plan starts with 10 free buyers. No credit card required to begin.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
