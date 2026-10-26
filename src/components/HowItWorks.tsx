import { Search, Bot, MessageCircle } from 'lucide-react';
import { Reveal } from './Reveal';

const steps = [
  {
    icon: Search,
    title: 'We find people searching',
    description:
      'LEADLY scans social media, marketplaces, and forums for people asking about products like yours — right now, in your region.',
  },
  {
    icon: Bot,
    title: 'AI starts the conversation',
    description:
      'Our AI reaches out naturally, qualifies their interest, and confirms they’re a real buyer ready to spend.',
  },
  {
    icon: MessageCircle,
    title: 'They land in your WhatsApp',
    description:
      'Verified buyers are sent straight to your WhatsApp within 24 hours. You close the sale. We find the next one.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-brand-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            How it works
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Three steps. Zero guesswork.
          </h2>
          <p className="mt-5 text-lg text-white/60">
            No ad budgets. No content creation. No waiting weeks for results. LEADLY does the
            finding — you do the selling.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-brand-ink p-8 transition-all duration-300 hover:border-white/25 hover:bg-brand-graphite">
                <div className="absolute right-6 top-6 font-display text-5xl font-extrabold text-white/5 transition-colors group-hover:text-white/10">
                  0{i + 1}
                </div>
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="relative mt-6 font-display text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="relative mt-3 text-base leading-relaxed text-white/60">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
