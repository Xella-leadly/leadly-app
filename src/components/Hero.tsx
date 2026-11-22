import { ArrowRight } from 'lucide-react';
import { VendorSignIn } from './VendorSignIn';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand-black pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white animate-fade-in">
            AI Lead Generation for Sellers Everywhere
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-up">
            Find Customers For Your Product in{' '}
            <span className="text-gradient-mono">24 Hours</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 lg:mx-0 animate-fade-up animate-delay-100">
            LEADLY is AI that finds people searching for your product and sends them to
            your WhatsApp. No ads. No stress.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center animate-fade-up animate-delay-200">
            <button
              onClick={() => window.open('https://forms.gle/ttwnzGohJnLoLYFE7', '_blank')}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-bold text-black transition-all hover:bg-brand-porcelain active:scale-95 sm:w-auto"
            >
              Get My First 10 Buyers Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-sm text-white/50">No credit card needed</p>
          </div>
        </div>

        <div className="relative flex justify-center animate-fade-up animate-delay-300">
          <VendorSignIn />
        </div>
      </div>
    </section>
  );
}
