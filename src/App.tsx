import { useEffect, useState } from 'react';
import LeadlyAdminDashboard from './components/LeadlyAdminDashboard';
import { LeadFormProvider } from './components/LeadFormContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { WhoItsFor } from './components/WhoItsFor';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { LeadForm } from './components/LeadForm';

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (path === '/admin') {
    return <LeadlyAdminDashboard />;
  }

  return (
    <LeadFormProvider>
      <div className="min-h-screen bg-brand-black">
        <Navbar />
        <main>
          <Hero />
          <HowItWorks />
          <WhoItsFor />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <LeadForm />
      </div>
    </LeadFormProvider>
  );
}

export default App;
