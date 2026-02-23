import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  number: number;
  label: string;
};

const STEPS: Step[] = [
  { number: 1, label: "Income" },
  { number: 2, label: "Accounts" },
  { number: 3, label: "Real Estate" },
  { number: 4, label: "Life Events" },
];

type Props = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  isCompleted && "bg-emerald-500 text-white",
                  isCurrent &&
                    "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-muted text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent ? "text-emerald-400" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mb-4 mx-1 transition-all duration-300",
                  currentStep > step.number ? "bg-emerald-500" : "bg-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
