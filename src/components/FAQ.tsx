import { Plus } from 'lucide-react';
const questions = [
  ['How do I get started?', 'Choose Get started and sign in with your vendor email or phone number and password. Your seller workspace opens after sign-in.'],
  ['What should I include in my request?', 'Include your product or service, the area you cover and the WhatsApp number you use for customer enquiries.'],
  ['What happens when I choose a plan?', 'LEADLY remembers the plan while you sign in. You can review it in your workspace. Choosing a plan here does not charge you.'],
  ['Where do I talk to buyers?', 'Use your business WhatsApp to answer questions and agree on stock, delivery and payment directly with the buyer.'],
];
export function FAQ() {
  return <section id="faq" className="faq-section"><div className="site-width faq-layout">
    <h2>Common questions</h2><div>{questions.map(([q,a]) =>
      <details key={q}><summary>{q}<Plus size={19} aria-hidden="true" /></summary><p>{a}</p></details>
    )}</div>
  </div></section>;
}
