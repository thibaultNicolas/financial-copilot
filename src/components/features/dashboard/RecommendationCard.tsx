import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import type { Recommendation } from "@/types";

type Props = {
  recommendation: Recommendation;
  rank: number;
};

const CATEGORY_COLORS: Record<
  Recommendation["category"],
  { bg: string; text: string }
> = {
  TAX: { bg: "#FEF2F2", text: "#DC2626" },
  SAVINGS: { bg: "#EFF6FF", text: "#2563EB" },
  INVESTMENT: { bg: "#F5F3FF", text: "#7C3AED" },
  PROTECTION: { bg: "#FFF7ED", text: "#EA580C" },
  PLANNING: { bg: "#ECFDF5", text: "#059669" },
};

export function RecommendationCard({ recommendation: rec, rank }: Props) {
  const category = CATEGORY_COLORS[rec.category];

  const confidenceColor =
    rec.confidenceScore >= 80
      ? "#059669"
      : rec.confidenceScore >= 60
        ? "#D97706"
        : "#DC2626";

  const confidenceBg =
    rec.confidenceScore >= 80
      ? "#ECFDF5"
      : rec.confidenceScore >= 60
        ? "#FFFBEB"
        : "#FEF2F2";

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all hover:shadow-sm",
        rec.requiresHumanReview
          ? "border-amber-200 bg-white"
          : "border-gray-100 bg-white hover:border-gray-200",
      )}
    >
      {/* Top accent bar */}
      <div
        className="h-1 rounded-t-2xl"
        style={{
          background: rec.requiresHumanReview ? "#FCD34D" : "var(--ws-green)",
        }}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Rank */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white"
              style={{
                background: rec.requiresHumanReview
                  ? "#F59E0B"
                  : "var(--ws-green)",
              }}
            >
              {rank}
            </div>

            {/* Title + badges */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold leading-tight mb-2 text-gray-900">
                {rec.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: category.bg, color: category.text }}
                >
                  {rec.category}
                </span>
                {rec.requiresHumanReview && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Advisor Required
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Impact + Confidence — right side */}
          <div className="text-right flex-shrink-0 space-y-1">
            <p
              className="text-xl font-bold font-numeric"
              style={{ color: "var(--ws-green)" }}
            >
              +${formatCurrency(rec.estimatedImpact)}
            </p>
            <span
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: confidenceBg, color: confidenceColor }}
            >
              {rec.confidenceScore}% confidence
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-4 pl-10">
          {rec.description}
        </p>

        {/* Human handoff warning */}
        {rec.requiresHumanReview && rec.humanHandoffReason && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 mb-4 ml-10">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              {rec.humanHandoffReason}
            </p>
          </div>
        )}

        {/* Action items */}
        {rec.actionItems.length > 0 && (
          <div className="space-y-2 pl-10 mb-4">
            {rec.actionItems.map((action, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2
                  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--ws-green)" }}
                />
                <p className="text-xs text-gray-500 leading-relaxed">
                  {action}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Sources */}
        {rec.sources.length > 0 && (
          <div className="flex flex-wrap gap-3 pl-10 pt-2 border-t border-gray-50">
            {rec.sources.map((source, i) => (
              <a
                key={i}
                href={source.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {source.label} ({source.fiscalYear})
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
