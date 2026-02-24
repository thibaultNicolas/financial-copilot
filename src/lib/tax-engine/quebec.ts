import type { TaxBracket } from "./types";

// 2026 Quebec provincial brackets
export const QUEBEC_BRACKETS_2026: TaxBracket[] = [
  { min: 0, max: 51780, rate: 0.14 },
  { min: 51780, max: 103545, rate: 0.19 },
  { min: 103545, max: 126000, rate: 0.24 },
  { min: 126000, max: null, rate: 0.2575 },
];

export const QUEBEC_CONSTANTS_2026 = {
  basicPersonalAmount: 17183,
  basicPersonalAmountCredit: 17183 * 0.14, // ~$2,406
  abatementRate: 0.165, // 16.5% federal abatement for QC residents
  qppMaxPensionableEarnings: 73200,
  qppBasicExemption: 3500,
  qppContributionRate: 0.054,
  qppMaxContribution: 4038,
  qppSecondContributionRate: 0.04,
  qppSecondAdditionalMax: 75800,
  workPremiumCredit: 1200, // approximate
};

// Calculate Quebec provincial tax
export const calculateQuebecTax = (taxableIncome: number): number => {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  for (const bracket of QUEBEC_BRACKETS_2026) {
    const max = bracket.max ?? Infinity;
    if (taxableIncome <= bracket.min) break;
    const taxableInBracket = Math.min(taxableIncome, max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return Math.max(0, Math.round(tax));
};

// Apply Quebec basic personal amount credit
export const applyQuebecBasicPersonalCredit = (quebecTax: number): number => {
  const credit = QUEBEC_CONSTANTS_2026.basicPersonalAmountCredit;
  return Math.max(0, Math.round(quebecTax - credit));
};

// Calculate federal abatement (QC residents get 16.5% reduction on federal tax)
export const calculateQuebecAbatement = (
  federalTaxAfterCredits: number,
): number => {
  return Math.round(
    federalTaxAfterCredits * QUEBEC_CONSTANTS_2026.abatementRate,
  );
};

// Get marginal Quebec rate
export const getMarginalQuebecRate = (taxableIncome: number): number => {
  for (let i = QUEBEC_BRACKETS_2026.length - 1; i >= 0; i--) {
    if (taxableIncome > QUEBEC_BRACKETS_2026[i].min) {
      return QUEBEC_BRACKETS_2026[i].rate;
    }
  }
  return QUEBEC_BRACKETS_2026[0].rate;
};

// Calculate QPP contribution (Quebec Pension Plan)
export const calculateQPPContribution = (employmentIncome: number): number => {
  const {
    qppMaxPensionableEarnings,
    qppBasicExemption,
    qppContributionRate,
    qppMaxContribution,
  } = QUEBEC_CONSTANTS_2026;

  const pensionableEarnings =
    Math.min(employmentIncome, qppMaxPensionableEarnings) - qppBasicExemption;
  if (pensionableEarnings <= 0) return 0;

  return Math.min(
    Math.round(pensionableEarnings * qppContributionRate),
    qppMaxContribution,
  );
};
