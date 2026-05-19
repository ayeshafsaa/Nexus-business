import React, { createContext, useContext, useState, useCallback } from 'react';

export interface TourStep {
  target: string;       // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface WalkthroughContextValue {
  isTourActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  skipTour: () => void;
}

const WalkthroughContext = createContext<WalkthroughContextValue | null>(null);

export function WalkthroughProvider({ children }: { children: React.ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  const startTour = useCallback((tourSteps: TourStep[]) => {
    setSteps(tourSteps);
    setCurrentStep(0);
    setIsTourActive(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= steps.length - 1) {
        setIsTourActive(false);
        return 0;
      }
      return prev + 1;
    });
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const endTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStep(0);
  }, []);

  const skipTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStep(0);
  }, []);

  return (
    <WalkthroughContext.Provider
      value={{ isTourActive, currentStep, steps, startTour, nextStep, prevStep, endTour, skipTour }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) throw new Error('useWalkthrough must be inside WalkthroughProvider');
  return ctx;
}