import type { Recommendation } from "@/types";

/**
 * Tailwind class strings for recommendation category badges.
 * Shared so any component (cards, filters, lists) can use the same styling.
 */
export const RECOMMENDATION_CATEGORY_COLORS: Record<
  Recommendation["category"],
  string
> = {
  TAX: "bg-red-500/10 text-red-400 border-red-500/20",
  SAVINGS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  INVESTMENT: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  PROTECTION: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  PLANNING: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};
