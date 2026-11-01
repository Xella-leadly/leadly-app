import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { useLeadForm } from './LeadFormContext';

export function FinalCTA() {
  const { open } = useLeadForm();

  return (
    <section className="relative overflow-hidden bg-brand-black py-28 sm:py-36">
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Your customers are{' '}
          <span className="text-gradient-mono">waiting.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">
          Stop chasing followers. Start receiving buyers. Get your first 10 free — no credit card,
          no ads, no stress.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => window.open('https://forms.gle/ttwnzGohJnLoLYFE7','_blank')}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-black transition-all hover:bg-brand-porcelain active:scale-95 sm:w-auto"
          >
            Get 10 Buyers Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <p className="mt-5 text-sm text-white/40">Delivered to your WhatsApp within 24 hours.</p>
      </Reveal>
    </section>
  );
}
