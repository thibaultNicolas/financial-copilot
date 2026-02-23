import type { UserProfile } from "@/types";

/**
 * Sum estimated impact from a list of recommendations.
 */
export function totalEstimatedImpact(
  recommendations: { estimatedImpact?: number }[]
): number {
  return recommendations.reduce(
    (sum, r) => sum + (r.estimatedImpact ?? 0),
    0
  );
}

/**
 * Total annual income: employment + freelance + gross rental.
 */
export function totalAnnualIncome(profile: Partial<UserProfile>): number {
  const employment =
    profile.income?.employment?.grossAnnualSalary ?? 0;
  const freelance =
    profile.income?.freelance?.estimatedAnnualRevenue ?? 0;
  const rental =
    (profile.income?.rental?.units ?? 0) *
    (profile.income?.rental?.monthlyRentPerUnit ?? 0) *
    12;
  return employment + freelance + rental;
}

/**
 * Sum of current balances across all registered accounts.
 */
export function totalRegisteredAssets(profile: Partial<UserProfile>): number {
  return (
    profile.accounts?.reduce((sum, a) => sum + a.currentBalance, 0) ?? 0
  );
}

/**
 * Sum of (estimatedValue - mortgageBalance) for all real estate.
 */
export function totalRealEstateEquity(profile: Partial<UserProfile>): number {
  return (
    profile.realEstate?.reduce(
      (sum, r) => sum + (r.estimatedValue - r.mortgageBalance),
      0
    ) ?? 0
  );
}

/**
 * Net worth estimate: registered assets + real estate equity.
 */
export function netWorthEstimate(profile: Partial<UserProfile>): number {
  return (
    totalRegisteredAssets(profile) + totalRealEstateEquity(profile)
  );
}
