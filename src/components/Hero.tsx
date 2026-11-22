import { ArrowDown, ArrowUpRight, MessageCircle } from 'lucide-react';
import tote from './canvas-tote.webp';

export function Hero() {
  return <section className="site-hero"><div className="site-width hero-grid">
    <div className="hero-copy">
      <h1>Find people looking for <em>what you sell.</em></h1>
      <p>Tell LEADLY what you sell and where you deliver. Follow up with interested buyers on WhatsApp.</p>
      <div className="hero-actions">
        <a className="site-btn btn-lime" href="/sign-in">Get started <ArrowUpRight size={19} /></a>
        <a className="text-action" href="#how-it-works">How it works <ArrowDown size={16} /></a>
      </div>
    </div>
    <figure className="buyer-example">
      <div className="example-image"><img src={tote} width="680" height="680" alt="Black canvas tote with twin handles" fetchPriority="high" />
        <div className="product-caption"><strong>Canvas tote</strong><span>Ilishan-Remo, Ogun</span></div>
      </div>
      <figcaption><MessageCircle size={16} /> Example buyer conversation</figcaption>
      <div className="example-chat"><p><b>Buyer</b>Can you deliver this tote to Babcock on Friday?</p>
      <p><b>Seller</b>Yes, I deliver to campus. Which colour would you like?</p></div>
    </figure>
  </div></section>;
}
