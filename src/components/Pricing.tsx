import { ArrowUpRight, Check } from 'lucide-react';
import { sellerLink } from './sellerRoutes';

const plans = [
  { id: 'starter', name: 'Starter', price: '₦25,000', audience: 'For sellers focused on one product category.', features: ['Up to 30 buyer leads per month', 'One product category', 'WhatsApp delivery', 'Email support'] },
  { id: 'pro', name: 'Pro', price: '₦60,000', audience: 'For shops with a wider product range.', features: ['Up to 100 buyer leads per month', 'Up to three product categories', 'Priority WhatsApp delivery', 'Weekly performance reports', 'Dedicated support'] },
] as const;

export function Pricing() {
  return <section id="pricing" className="paper-section pricing-section"><div className="site-width">
    <div className="section-intro"><h2>Seller plans</h2><p>Choose a plan to carry into your seller account. You can review it before sending a request.</p></div>
    <div className="plan-grid">{plans.map(plan => <article className={'plan-card plan-' + plan.id} key={plan.id}>
      <h3>{plan.name}</h3><p>{plan.audience}</p>
      <div className="plan-price">{plan.price}<span> / month</span></div>
      <ul>{plan.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
      <a className="site-btn btn-ink" href={sellerLink('/sign-in', plan.id)}>Choose {plan.name} <ArrowUpRight size={17} /></a>
    </article>)}</div>
  </div></section>;
}
