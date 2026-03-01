"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Reading your financial profile...", duration: 2000 },
  { label: "Running tax calculations...", duration: 3000 },
  { label: "Identifying optimization opportunities...", duration: 5000 },
  { label: "Ranking by financial impact...", duration: 8000 },
  { label: "Generating recommendations...", duration: 15000 },
];

export function LoadingRecommendations() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => e + 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const totalDuration = STEPS.reduce((sum, s) => sum + s.duration, 0);
  const progress = Math.min((elapsed / totalDuration) * 100, 95);

  let currentStep = 0;
  if (elapsed >= totalDuration) {
    currentStep = STEPS.length - 1;
  } else {
    let total = 0;
    for (let i = 0; i < STEPS.length; i++) {
      total += STEPS[i].duration;
      if (elapsed < total) {
        currentStep = i;
        break;
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div
          className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
          style={{
            borderColor: "var(--ws-green-light)",
            borderTopColor: "var(--ws-green)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          🧠
        </div>
      </div>

      {/* Current step */}
      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-gray-800">
          {STEPS[currentStep]?.label}
        </p>
        <p className="text-sm text-gray-400">
          Powered by GPT-4o + CRA 2026 tax rules
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: "var(--ws-green)",
          }}
        />
      </div>

      {/* Step indicators */}
      <div className="space-y-2 w-56">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
              style={{
                background:
                  i <= currentStep ? "var(--ws-green)" : "#E9ECEF",
              }}
            />
            <p
              className="text-xs transition-all"
              style={{
                color:
                  i === currentStep
                    ? "var(--ws-gray-900)"
                    : i < currentStep
                      ? "var(--ws-green)"
                      : "#9CA3AF",
                fontWeight: i === currentStep ? 600 : 400,
              }}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
