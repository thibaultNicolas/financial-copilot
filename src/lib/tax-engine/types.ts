export type FilingStatus = "SINGLE" | "MARRIED" | "COMMON_LAW";

export type TaxBracket = {
  min: number;
  max: number | null;
  rate: number;
};

export type TaxBreakdown = {
  employmentIncome: number;
  freelanceIncome: number;
  rentalIncome: number;
  totalGrossIncome: number;
  rrspDeduction: number;
  freelanceExpenses: number;
  rentalExpenses: number;
  unionDues: number;
  totalDeductions: number;
  totalTaxableIncome: number;
  federalTaxBeforeCredits: number;
  basicPersonalAmountFederal: number;
  federalTax: number;
  quebecTaxBeforeCredits: number;
  basicPersonalAmountQuebec: number;
  quebecAbatement: number;
  quebecTax: number;
  qppContribution: number;
  eiPremium: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalFederalRate: number;
  marginalQuebecRate: number;
  marginalCombinedRate: number;
  afterTaxIncome: number;
  rrspContributionRoom: number;
  rrspTaxSavingsIfMaxed: number;
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
  additionalDeductions?: number;
};

export type ScenarioResult = {
  input: ScenarioInput;
  breakdown: TaxBreakdown;
  label: string;
};
