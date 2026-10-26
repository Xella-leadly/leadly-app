import { ShoppingBag, Smartphone, Home, Wrench, Car, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

const audiences = [
  { icon: ShoppingBag, title: 'Fashion & clothing vendors', note: 'People asking where to buy your style' },
  { icon: Smartphone, title: 'Phone & gadget sellers', note: 'Buyers comparing models in your area' },
  { icon: Home, title: 'Furniture & home goods', note: 'Shoppers hunting for deals near them' },
  { icon: Wrench, title: 'Service providers', note: 'People requesting what you offer' },
  { icon: Car, title: 'Auto dealers', note: 'Buyers asking about available cars' },
  { icon: Sparkles, title: 'Beauty & cosmetics', note: 'Customers seeking your products' },
];

export function WhoItsFor() {
  return (
    <section id="who-its-for" className="relative bg-brand-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Who it’s for
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built for sellers who close on WhatsApp.
          </h2>
          <p className="mt-5 text-lg text-white/60">
            If you sell anything through chat, LEADLY puts real buyers in your inbox — not
            followers, not likes, not window-shoppers.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 80}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-brand-black p-6 transition-all duration-300 hover:border-white/25">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors group-hover:bg-white group-hover:text-black">
                  <a.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">{a.title}</h3>
                  <p className="mt-1 text-sm text-white/55">{a.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
