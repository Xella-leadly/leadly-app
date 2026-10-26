import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';

type LeadFormState = {
  isOpen: boolean;
  open: (plan?: 'starter' | 'pro') => void;
  close: () => void;
  selectedPlan: 'starter' | 'pro' | null;
};

const LeadFormContext = createContext<LeadFormState | null>(null);

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | null>(null);

  const open = useCallback((plan?: 'starter' | 'pro') => {
    setSelectedPlan(plan ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <LeadFormContext.Provider value={{ isOpen, open, close, selectedPlan }}>
      {children}
    </LeadFormContext.Provider>
  );
}

export function useLeadForm() {
  const ctx = useContext(LeadFormContext);
  if (!ctx) throw new Error('useLeadForm must be used within LeadFormProvider');
  return ctx;
}
