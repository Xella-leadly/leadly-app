import { Store, Search, MessageCircle } from 'lucide-react';
const steps = [
  { icon: Store, title: 'Describe your offer', text: 'Sign in and tell us what you sell, where you deliver and how buyers can reach you.' },
  { icon: Search, title: 'Define a good match', text: 'Your product and delivery area guide the search for people asking about items like yours.' },
  { icon: MessageCircle, title: 'Talk on WhatsApp', text: 'When there’s a match, pick up the conversation about stock, price and delivery.' },
];
export function HowItWorks() {
  return <section id="how-it-works" className="paper-section"><div className="site-width">
    <h2>How LEADLY works</h2>
    <div className="step-grid">{steps.map(({ icon: Icon, title, text }) =>
      <article key={title}><Icon size={25} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>
    )}</div>
  </div></section>;
}
