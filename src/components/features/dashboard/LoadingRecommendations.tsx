const STEPS = [
  "Analyzing your income sources...",
  "Calculating tax optimization opportunities...",
  "Evaluating contribution room across accounts...",
  "Assessing life event impact on cash flow...",
  "Generating prioritized recommendations...",
];

export function LoadingRecommendations() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-10">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
          style={{
            borderColor: "var(--ws-green-light)",
            borderTopColor: "var(--ws-green)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🧠</span>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">
          Analyzing your financial profile
        </h2>
        <p className="text-sm text-gray-500">
          GPT-4o is reviewing your complete situation
        </p>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        {STEPS.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm text-gray-400"
            style={{
              animation: `fadeUp 0.5s ease forwards`,
              animationDelay: `${index * 0.3}s`,
              opacity: 0,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-green"
              style={{ background: "var(--ws-green)" }}
            />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
