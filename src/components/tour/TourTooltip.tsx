import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import { useWalkthrough } from '../../context/WalkthroughContext';

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 12;

function computePosition(
  rect: DOMRect,
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center'
): TooltipPosition {
  const tooltipW = 320;
  const tooltipH = 160; // approximate

  switch (placement) {
    case 'bottom':
      return {
        top: rect.bottom + PADDING + window.scrollY,
        left: Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 8)),
        placement: 'bottom',
      };
    case 'top':
      return {
        top: rect.top - tooltipH - PADDING + window.scrollY,
        left: Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 8)),
        placement: 'top',
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2 - tooltipH / 2 + window.scrollY,
        left: rect.right + PADDING,
        placement: 'right',
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2 - tooltipH / 2 + window.scrollY,
        left: rect.left - tooltipW - PADDING,
        placement: 'left',
      };
    case 'center':
    default:
      return {
        top: window.innerHeight / 2 - tooltipH / 2 + window.scrollY,
        left: window.innerWidth / 2 - tooltipW / 2,
        placement: 'center',
      };
  }
}

export function TourTooltip() {
  const { isTourActive, currentStep, steps, nextStep, prevStep, skipTour } = useWalkthrough();
  const [pos, setPos] = useState<TooltipPosition | null>(null);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [visible, setVisible] = useState(false);

  const step = steps[currentStep];

  const updatePosition = useCallback(() => {
    if (!step) return;

    if (step.placement === 'center' || step.target === 'body') {
      setPos({ top: 0, left: 0, placement: 'center' });
      setSpotlight(null);
      setVisible(true);
      return;
    }

    const el = document.querySelector(step.target);
    if (!el) {
      // fallback to center if element not found
      setPos({ top: 0, left: 0, placement: 'center' });
      setSpotlight(null);
      setVisible(true);
      return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const placement = step.placement ?? 'bottom';
      setPos(computePosition(rect, placement));
      setSpotlight({
        top: rect.top + window.scrollY - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      });
      setVisible(true);
    }, 300);
  }, [step]);

  useEffect(() => {
    if (!isTourActive) { setVisible(false); setSpotlight(null); return; }
    setVisible(false);
    const t = setTimeout(updatePosition, 100);
    return () => clearTimeout(t);
  }, [isTourActive, currentStep, updatePosition]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  if (!isTourActive || !step) return null;

  const isCenter = pos?.placement === 'center';
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  // arrow direction for tooltip caret
  const arrowClass: Record<string, string> = {
    bottom: 'before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white',
    top: 'before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-white',
    right: 'before:absolute before:top-1/2 before:-translate-y-1/2 before:-left-2 before:border-8 before:border-transparent before:border-r-white',
    left: 'before:absolute before:top-1/2 before:-translate-y-1/2 before:-right-2 before:border-8 before:border-transparent before:border-l-white',
    center: '',
  };

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.55)' }}
      />

      {/* Spotlight cutout */}
      {spotlight && (
        <div
          className="fixed z-[9999] pointer-events-none rounded-xl ring-4 ring-violet-400 ring-offset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            transition: 'all 0.3s ease',
          }}
        />
      )}

      {/* Tooltip */}
      {isCenter ? (
        // centered modal style
        <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
          <div
            className={`pointer-events-auto bg-white rounded-2xl shadow-2xl w-80 overflow-hidden transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <TooltipInner
              step={step}
              currentStep={currentStep}
              totalSteps={steps.length}
              isFirst={isFirst}
              isLast={isLast}
              onNext={nextStep}
              onPrev={prevStep}
              onSkip={skipTour}
            />
          </div>
        </div>
      ) : (
        <div
          className={`fixed z-[10000] w-80 pointer-events-auto transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${pos ? arrowClass[pos.placement] : ''}`}
          style={pos ? { top: pos.top, left: pos.left } : { display: 'none' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <TooltipInner
              step={step}
              currentStep={currentStep}
              totalSteps={steps.length}
              isFirst={isFirst}
              isLast={isLast}
              onNext={nextStep}
              onPrev={prevStep}
              onSkip={skipTour}
            />
          </div>
        </div>
      )}
    </>
  );
}

function TooltipInner({
  step, currentStep, totalSteps, isFirst, isLast, onNext, onPrev, onSkip,
}: {
  step: { title: string; content: string };
  currentStep: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map size={14} className="text-violet-200" />
          <span className="text-violet-200 text-xs font-medium">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <button onClick={onSkip} className="text-violet-300 hover:text-white transition-colors">
          <X size={15} />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 px-4 pt-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full flex-1 transition-all duration-300 ${
              i === currentStep ? 'bg-violet-600' : i < currentStep ? 'bg-violet-300' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <h3 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h3>
        <p className="text-slate-500 text-xs leading-relaxed">{step.content}</p>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <button
          onClick={onSkip}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Skip tour
        </button>
        <div className="flex gap-2">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={12} /> Back
            </button>
          )}
          <button
            onClick={onNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            {isLast ? '🎉 Finish' : <>Next <ChevronRight size={12} /></>}
          </button>
        </div>
      </div>
    </>
  );
}