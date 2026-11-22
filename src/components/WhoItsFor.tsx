import { Car, Home, ShoppingBag, Smartphone, Sparkles, Wrench } from 'lucide-react';

const categories = [
  { icon: ShoppingBag, name: 'Fashion & accessories' }, { icon: Smartphone, name: 'Phones & gadgets' },
  { icon: Home, name: 'Furniture & home' }, { icon: Sparkles, name: 'Beauty & cosmetics' },
  { icon: Wrench, name: 'Local services' }, { icon: Car, name: 'Cars & parts' },
];
export function WhoItsFor() {
  return <section id="who-its-for" className="seller-types"><div className="site-width types-grid">
    <div><h2>Built for WhatsApp sellers.</h2><p>From campus vendors to local shops, start with the products and places you know.</p></div>
    <ul>{categories.map(({ icon: Icon, name }) => <li key={name}><Icon size={18} aria-hidden="true" />{name}</li>)}</ul>
  </div></section>;
}
