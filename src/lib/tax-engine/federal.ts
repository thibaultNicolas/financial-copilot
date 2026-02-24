import type { TaxBracket } from "./types";

// 2026 Federal tax brackets
export const FEDERAL_BRACKETS_2026: TaxBracket[] = [
  { min: 0, max: 57375, rate: 0.15 },
  { min: 57375, max: 114750, rate: 0.205 },
  { min: 114750, max: 158519, rate: 0.26 },
  { min: 158519, max: 220000, rate: 0.29 },
  { min: 220000, max: null, rate: 0.33 },
];

export const FEDERAL_CONSTANTS_2026 = {
  basicPersonalAmount: 16129,
  basicPersonalAmountCredit: 16129 * 0.15, // ~$2,419
  rrspLimitRate: 0.18,
  rrspMaxContribution: 32490,
  tfsaRoom: 7000,
  fhsaAnnualLimit: 8000,
  fhsaLifetimeLimit: 40000,
  eiMaxInsurableEarnings: 65700,
  eiPremiumRate: 0.0166,
  eiMaxPremium: 1090,
};

// Calculate federal tax on taxable income
export const calculateFederalTax = (taxableIncome: number): number => {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  for (const bracket of FEDERAL_BRACKETS_2026) {
    const max = bracket.max ?? Infinity;
    if (taxableIncome <= bracket.min) break;
    const taxableInBracket = Math.min(taxableIncome, max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return Math.max(0, Math.round(tax));
};

// Apply basic personal amount credit
export const applyFederalBasicPersonalCredit = (federalTax: number): number => {
  const credit = FEDERAL_CONSTANTS_2026.basicPersonalAmountCredit;
  return Math.max(0, Math.round(federalTax - credit));
};

// Get marginal federal rate for a given income
export const getMarginalFederalRate = (taxableIncome: number): number => {
  for (let i = FEDERAL_BRACKETS_2026.length - 1; i >= 0; i--) {
    if (taxableIncome > FEDERAL_BRACKETS_2026[i].min) {
      return FEDERAL_BRACKETS_2026[i].rate;
    }
  }
  return FEDERAL_BRACKETS_2026[0].rate;
};

// Calculate EI premium
export const calculateEIPremium = (employmentIncome: number): number => {
  const { eiMaxInsurableEarnings, eiPremiumRate, eiMaxPremium } =
    FEDERAL_CONSTANTS_2026;
  const insurable = Math.min(employmentIncome, eiMaxInsurableEarnings);
  return Math.min(Math.round(insurable * eiPremiumRate), eiMaxPremium);
};

// Calculate RRSP contribution room
export const calculateRRSPRoom = (previousYearIncome: number): number => {
  const { rrspLimitRate, rrspMaxContribution } = FEDERAL_CONSTANTS_2026;
  return Math.min(
    Math.round(previousYearIncome * rrspLimitRate),
    rrspMaxContribution,
  );
};
