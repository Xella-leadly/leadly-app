import { useEffect, useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { useLeadForm } from './LeadFormContext';

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Who it’s for', href: '#who-its-for' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useLeadForm();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-black/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black transition-transform group-hover:scale-110">
            <Zap className="h-5 w-5" fill="currentColor" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-white">
            LEADLY
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <button
            onClick={() => open()}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-brand-porcelain active:scale-95"
          >
            Get 10 Buyers Free
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-brand-black/95 backdrop-blur-xl lg:hidden">
          <ul className="mx-auto max-w-7xl space-y-1 px-5 py-4 sm:px-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="block w-full rounded-lg px-3 py-3 text-left text-base font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  open();
                }}
                className="block w-full rounded-full bg-white px-5 py-3 text-center text-base font-bold text-black"
              >
                Get 10 Buyers Free
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
