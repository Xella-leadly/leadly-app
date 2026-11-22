import { useEffect, useRef, useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

export function Brand() {
  return <a className="site-brand" href="/" aria-label="LEADLY home"><span><Zap size={19} fill="currentColor" aria-hidden="true" /></span>LEADLY</a>;
}

const sections = [
  ['How it works', '#how-it-works'], ['Who it’s for', '#who-its-for'], ['Pricing', '#pricing'], ['FAQ', '#faq'],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    const large = window.matchMedia('(min-width: 801px)');
    const resize = () => { if (large.matches) setOpen(false); };
    document.addEventListener('keydown', escape);
    large.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', escape); large.removeEventListener('change', resize); };
  }, [open]);

  return <header className="site-header"><nav className="site-width nav-inner" aria-label="Main navigation">
    <Brand />
    <div className={'nav-links' + (open ? ' nav-open' : '')} id="site-navigation">
      {sections.map(([text, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{text}</a>)}
    </div>
    <div className="nav-actions"><a className="site-btn btn-quiet" href="/sign-in">Sign in</a>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
    </div>
  </nav></header>;
}
