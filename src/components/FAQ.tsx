import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Reveal } from './Reveal';

const faqs = [
  {
    q: 'How does LEADLY find buyers?',
    a: 'Our AI scans social platforms, marketplaces, and forums for people actively asking about products like yours. It then reaches out naturally, qualifies their interest, and delivers the verified buyers to your WhatsApp.',
  },
  {
    q: 'Are the buyers real?',
    a: 'Yes. Every lead is a person who has expressed real interest in your product category and confirmed they’re ready to buy. You only receive qualified buyers — not random contacts.',
  },
  {
    q: 'How fast do I get buyers?',
    a: 'Most sellers receive their first buyers within 24 hours of signing up. The free trial includes 10 verified buyers delivered on the same timeline.',
  },
  {
    q: 'Do I need to run ads?',
    a: 'No. LEADLY replaces ad spend entirely. You don’t need a marketing budget, content creation, or a big following — we find the buyers for you.',
  },
  {
    q: 'What do I need to get started?',
    a: 'Just your WhatsApp number and a description of what you sell. LEADLY handles the rest.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Plans are month-to-month with no lock-in. Cancel anytime and you won’t be billed again.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-brand-black py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">FAQ</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Questions, answered.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    isOpen ? 'border-white/25 bg-brand-ink' : 'border-white/10 bg-brand-ink/60'
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-base font-bold text-white">{item.q}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-white/65">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
