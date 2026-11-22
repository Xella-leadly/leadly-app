import { useRef } from 'react';
import { ArrowRight, MessageCircle, Sparkles, X } from 'lucide-react';
import { VendorSignIn } from './VendorSignIn';

export function Hero() {
  const signInDialog = useRef<HTMLDialogElement>(null);

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
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => signInDialog.current?.showModal()}
              className="w-full rounded-full border border-white/25 px-6 py-4 font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Sign in
            </button>
          </div>
          <p className="mt-3 text-sm text-white/50">No credit card needed</p>
        </div>

        <div className="relative flex justify-center animate-fade-up animate-delay-300">
          <PhoneMockup />
        </div>
      </div>
      <dialog
        ref={signInDialog}
        aria-label="Vendor account"
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl bg-brand-ink text-white backdrop:bg-black/75"
      >
        <button
          type="button"
          aria-label="Close sign-in"
          onClick={() => signInDialog.current?.close()}
          className="absolute right-3 top-3 rounded-full p-2 text-white/80 hover:bg-white/10"
        >
          <X size={20} />
        </button>
        <VendorSignIn />
      </dialog>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative animate-float">
      <div className="relative w-[280px] rounded-[2.5rem] border-[6px] border-brand-steel bg-brand-ink shadow-2xl sm:w-[320px]">
        <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-brand-steel" />

        <div className="flex items-center justify-between rounded-t-[2rem] bg-brand-charcoal px-4 py-3 pt-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Leadly Buyers</p>
              <p className="text-[10px] text-white/60">12 new leads online</p>
            </div>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="space-y-3 rounded-b-[2rem] bg-brand-ink px-3 py-4">
          <ChatBubble side="left" time="2:14 PM">
            I'm interested in the iPhone 14
          </ChatBubble>
          <ChatBubble side="left" time="2:15 PM">
            Is it still available? How much last?
          </ChatBubble>
          <ChatBubble side="right" time="2:15 PM">
            Yes it's available. ₦850,000 only
          </ChatBubble>
          <ChatBubble side="left" time="2:16 PM">
            I'll take it. Where can I come?
          </ChatBubble>
          <div className="flex items-center justify-center pt-1">
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              <span className="text-[10px] font-medium text-white/70">Leadly is finding more buyers…</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  side,
  time,
  children,
}: {
  side: 'left' | 'right';
  time: string;
  children: React.ReactNode;
}) {
  const isRight = side === 'right';
  return (
    <div className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
          isRight
            ? 'rounded-br-sm bg-white text-black'
            : 'rounded-bl-sm bg-brand-charcoal text-white'
        }`}
      >
        <p className="text-xs leading-snug">{children}</p>
        <p className={`mt-0.5 text-[9px] ${isRight ? 'text-black/50' : 'text-white/40'}`}>{time}</p>
      </div>
    </div>
  );
}
