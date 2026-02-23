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
  TAX: { bg: "#FEF2F2", text: "#EF4444" },
  SAVINGS: { bg: "#EFF6FF", text: "#3B82F6" },
  INVESTMENT: { bg: "#F5F3FF", text: "#8B5CF6" },
  PROTECTION: { bg: "#FFF7ED", text: "#F97316" },
  PLANNING: { bg: "#ECFDF5", text: "#10B981" },
};

export function RecommendationCard({ recommendation: rec, rank }: Props) {
  const category = CATEGORY_COLORS[rec.category];

  const confidenceColor =
    rec.confidenceScore >= 80
      ? "var(--ws-green)"
      : rec.confidenceScore >= 60
        ? "#F59E0B"
        : "#EF4444";

  return (
    <div
      className={cn(
        "p-6 rounded-2xl border transition-all hover:shadow-md",
        rec.requiresHumanReview
          ? "border-amber-200 bg-amber-50/30"
          : "border-gray-100 bg-white hover:border-gray-200",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          {/* Rank */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 text-gray-400 bg-gray-100">
            {rank}
          </div>

          <div>
            <h3 className="text-base font-semibold leading-tight mb-2">
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

        {/* Impact + Confidence */}
        <div className="text-right flex-shrink-0">
          <p
            className="text-lg font-bold font-numeric"
            style={{ color: "var(--ws-green)" }}
          >
            +${formatCurrency(rec.estimatedImpact)}
          </p>
          <p
            className="text-xs font-medium mt-0.5"
            style={{ color: confidenceColor }}
          >
            {rec.confidenceScore}% confidence
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4 ml-11">
        {rec.description}
      </p>

      {/* Human handoff */}
      {rec.requiresHumanReview && rec.humanHandoffReason && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-4 ml-11">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{rec.humanHandoffReason}</p>
        </div>
      )}

      {/* Action items */}
      {rec.actionItems.length > 0 && (
        <div className="space-y-1.5 ml-11">
          {rec.actionItems.map((action, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2
                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                style={{ color: "var(--ws-green)" }}
              />
              <p className="text-xs text-gray-500">{action}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sources */}
      {rec.sources.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4 ml-11">
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
  );
}
