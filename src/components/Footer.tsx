import { Zap } from 'lucide-react';

const footerLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Who it’s for', href: '#who-its-for' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#social-proof' },
  { label: 'FAQ', href: '#faq' },
];

export function Footer() {
  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-brand-black">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <Zap className="h-5 w-5" fill="currentColor" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              LEADLY
            </span>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="text-sm font-medium text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} LEADLY. All rights reserved.
          </p>
          <p className="text-xs text-white/40">AI that finds your buyers. You close the sale.</p>
        </div>
      </div>
    </footer>
  );
}
