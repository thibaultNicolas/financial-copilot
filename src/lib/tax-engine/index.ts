export type FilingStatus = "SINGLE" | "MARRIED" | "COMMON_LAW";

export type TaxBracket = {
  min: number;
  max: number | null;
  rate: number;
};

export type TaxBreakdown = {
  // Income
  employmentIncome: number;
  freelanceIncome: number;
  rentalIncome: number;
  totalGrossIncome: number;

  // Deductions
  rrspDeduction: number;
  freelanceExpenses: number;
  rentalExpenses: number;
  unionDues: number;
  totalDeductions: number;

  // Taxable income
  totalTaxableIncome: number;

  // Federal
  federalTaxBeforeCredits: number;
  basicPersonalAmountFederal: number;
  federalTax: number;

  // Quebec
  quebecTaxBeforeCredits: number;
  basicPersonalAmountQuebec: number;
  quebecAbatement: number;
  quebecTax: number;

  // CPP / QPP / EI
  qppContribution: number;
  eiPremium: number;

  // Total
  totalTax: number;
  effectiveTaxRate: number;
  marginalFederalRate: number;
  marginalQuebecRate: number;
  marginalCombinedRate: number;
  afterTaxIncome: number;

  // RRSP
  rrspContributionRoom: number;
  rrspTaxSavingsIfMaxed: number;

  // TFSA
  tfsaRoom: number;
};

export type ScenarioInput = {
  employmentIncome: number;
  freelanceIncome: number;
  rentalGrossIncome: number;
  rentalExpenses: number;
  rrspContribution: number;
  freelanceExpenses: number;
  province: string;
  filingStatus: FilingStatus;
  age: number;
};

export type ScenarioResult = {
  input: ScenarioInput;
  breakdown: TaxBreakdown;
  label: string;
};

export { calculateTax } from "./calculator";
export {
  calculateNetRentalIncome,
  calculateFreelanceNetIncome,
  calculateRRSPTaxSavings,
} from "./deductions";
export { FEDERAL_BRACKETS_2026, FEDERAL_CONSTANTS_2026 } from "./federal";
export { QUEBEC_BRACKETS_2026, QUEBEC_CONSTANTS_2026 } from "./quebec";
export type { TaxBreakdown, ScenarioInput, ScenarioResult } from "./types";
