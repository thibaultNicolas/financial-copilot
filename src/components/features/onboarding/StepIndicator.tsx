"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: Props) {
  const t = useTranslations("onboarding.steps");

  const STEPS = [
    { number: 1, label: t("income") },
    { number: 2, label: t("accounts") },
    { number: 3, label: t("realEstate") },
    { number: 4, label: t("lifeEvents") },
  ];

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  isCompleted && "text-white",
                  isCurrent && "border-2 font-bold",
                  !isCompleted && !isCurrent && "bg-gray-100 text-gray-400",
                )}
                style={
                  isCompleted
                    ? { background: "var(--ws-green)" }
                    : isCurrent
                      ? {
                          borderColor: "var(--ws-green)",
                          color: "var(--ws-green)",
                          background: "var(--ws-green-light)",
                        }
                      : {}
                }
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  !isCurrent && "text-gray-400",
                )}
                style={isCurrent ? { color: "var(--ws-green)" } : {}}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className="w-16 h-0.5 mb-5 mx-1 transition-all duration-500"
                style={{
                  background:
                    currentStep > step.number ? "var(--ws-green)" : "#E9ECEF",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
