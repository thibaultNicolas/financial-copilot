import { FEDERAL_CONSTANTS_2026 } from "./federal";

// Calculate net rental income (gross - expenses)
export const calculateNetRentalIncome = (
  units: number,
  monthlyRentPerUnit: number,
  mortgageInterest: number,
  propertyTax: number,
  insurance: number,
  maintenance: number,
): number => {
  const gross = units * monthlyRentPerUnit * 12;
  const expenses = mortgageInterest + propertyTax + insurance + maintenance;
  return gross - expenses; // Can be negative (rental loss)
};

// Calculate total freelance deductible expenses
export const calculateFreelanceNetIncome = (
  revenue: number,
  equipment: number,
  software: number,
  vehicle: number,
  phone: number,
  other: number,
): { netIncome: number; totalExpenses: number } => {
  const totalExpenses = equipment + software + vehicle + phone + other;
  return {
    netIncome: Math.max(0, revenue - totalExpenses),
    totalExpenses,
  };
};

// Calculate RRSP tax savings for a given contribution
export const calculateRRSPTaxSavings = (
  contribution: number,
  taxableIncomeBeforeRRSP: number,
  province: string,
): number => {
  // Simplified — uses marginal rate at current income level
  // A proper implementation would recalculate full tax both ways
  const federalMarginalRate =
    taxableIncomeBeforeRRSP > 114750
      ? 0.26
      : taxableIncomeBeforeRRSP > 57375
        ? 0.205
        : 0.15;

  const provincialMarginalRate =
    province === "QC"
      ? taxableIncomeBeforeRRSP > 103545
        ? 0.24
        : taxableIncomeBeforeRRSP > 51780
          ? 0.19
          : 0.14
      : 0.0905; // Ontario approximate

  // Quebec abatement reduces federal by 16.5%
  const effectiveFederalRate =
    province === "QC" ? federalMarginalRate * (1 - 0.165) : federalMarginalRate;

  const combinedMarginalRate = effectiveFederalRate + provincialMarginalRate;
  return Math.round(contribution * combinedMarginalRate);
};

// Calculate RRSP contribution room based on prior year earned income
export const calculateRRSPContributionRoom = (
  priorYearEarnedIncome: number,
): number => {
  const { rrspLimitRate, rrspMaxContribution } = FEDERAL_CONSTANTS_2026;
  return Math.min(
    Math.round(priorYearEarnedIncome * rrspLimitRate),
    rrspMaxContribution,
  );
};
