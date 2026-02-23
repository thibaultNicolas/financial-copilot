import { Brain } from "lucide-react";

const STEPS = [
  "Analyzing your income sources...",
  "Calculating tax optimization opportunities...",
  "Evaluating contribution room across accounts...",
  "Assessing life event impact on cash flow...",
  "Generating prioritized recommendations...",
];

export function LoadingRecommendations() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Brain className="w-8 h-8 text-emerald-400 animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">
          Analyzing your financial profile
        </h2>
        <p className="text-sm text-muted-foreground">
          GPT-4o-mini is reviewing your complete situation
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2">
        {STEPS.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm text-muted-foreground animate-pulse"
            style={{ animationDelay: `${index * 0.4}s` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
