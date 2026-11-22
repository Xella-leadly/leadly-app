import LeadlyAdminDashboard from './components/LeadlyAdminDashboard';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { WhoItsFor } from './components/WhoItsFor';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { VendorSignIn } from './components/VendorSignIn';
import './components/seller.css';

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/admin') return <LeadlyAdminDashboard />;
  if (path === '/sign-in' || path === '/seller') return <VendorSignIn path={path} />;
  return (
    <div className="seller-site" id="top">
      <a className="skip-content" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <HowItWorks />
        <WhoItsFor />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
