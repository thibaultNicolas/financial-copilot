import type { UserProfile } from "@/types";

const DEFAULT_MONTHLY_BUDGET: UserProfile["monthlyBudget"] = {
  fixedExpenses: 0,
  variableExpenses: 0,
  sportsHobbies: 0,
  travel: 0,
  petCare: 0,
  other: 0,
};

/**
 * Build a full profile payload for the API (fills missing required fields with defaults).
 * Reusable from dashboard, tests, or any client that sends profile to /api/recommendations.
 */
export function normalizeProfileForApi(
  profile: Partial<UserProfile> | null
): UserProfile | null {
  if (
    !profile?.firstName ||
    !profile?.income?.employment ||
    !profile?.accounts
  ) {
    return null;
  }
  const now = new Date().toISOString();
  return {
    id: profile.id ?? `profile-${Date.now()}`,
    firstName: profile.firstName,
    age: profile.age ?? 0,
    province: profile.province ?? "QC",
    filingStatus: profile.filingStatus ?? "SINGLE",
    income: profile.income,
    accounts: profile.accounts,
    realEstate: profile.realEstate ?? [],
    monthlyBudget: profile.monthlyBudget ?? DEFAULT_MONTHLY_BUDGET,
    lifeEvents: profile.lifeEvents ?? [],
    hasPartner: profile.hasPartner ?? false,
    partnerIncome: profile.partnerIncome,
    numberOfChildren: profile.numberOfChildren ?? 0,
    plannedChildren: profile.plannedChildren ?? 0,
    createdAt: profile.createdAt ?? now,
    updatedAt: profile.updatedAt ?? now,
  };
}
