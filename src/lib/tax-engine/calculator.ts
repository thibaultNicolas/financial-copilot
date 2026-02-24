import {
  calculateFederalTax,
  applyFederalBasicPersonalCredit,
  getMarginalFederalRate,
  calculateEIPremium,
  FEDERAL_CONSTANTS_2026,
} from "./federal";

import {
  calculateQuebecTax,
  applyQuebecBasicPersonalCredit,
  calculateQuebecAbatement,
  getMarginalQuebecRate,
  calculateQPPContribution,
} from "./quebec";

import {
  calculateRRSPTaxSavings,
  calculateRRSPContributionRoom,
} from "./deductions";

import type { ScenarioInput, TaxBreakdown } from "./types";

export const calculateTax = (input: ScenarioInput): TaxBreakdown => {
  const {
    employmentIncome,
    freelanceIncome,
    rentalGrossIncome,
    rentalExpenses,
    rrspContribution,
    freelanceExpenses,
    province,
  } = input;

  // ─── INCOME ───────────────────────────────────────────────
  const netRentalIncome = rentalGrossIncome - rentalExpenses;
  const netFreelanceIncome = Math.max(0, freelanceIncome - freelanceExpenses);
  const totalGrossIncome =
    employmentIncome + netFreelanceIncome + Math.max(0, netRentalIncome);

  // ─── DEDUCTIONS ───────────────────────────────────────────
  const rrspDeduction = Math.min(
    rrspContribution,
    calculateRRSPContributionRoom(employmentIncome + netFreelanceIncome),
  );
  const totalDeductions = rrspDeduction;

  // ─── TAXABLE INCOME ───────────────────────────────────────
  const taxableIncome = Math.max(0, totalGrossIncome - totalDeductions);

  // ─── FEDERAL TAX ──────────────────────────────────────────
  const federalTaxBeforeCredits = calculateFederalTax(taxableIncome);
  const federalTaxAfterBPA = applyFederalBasicPersonalCredit(
    federalTaxBeforeCredits,
  );

  // Quebec abatement — QC residents get 16.5% off federal
  const quebecAbatement =
    province === "QC" ? calculateQuebecAbatement(federalTaxAfterBPA) : 0;
  const federalTax = Math.max(0, federalTaxAfterBPA - quebecAbatement);

  // ─── QUEBEC PROVINCIAL TAX ────────────────────────────────
  const quebecTaxBeforeCredits =
    province === "QC" ? calculateQuebecTax(taxableIncome) : 0;
  const quebecTax =
    province === "QC"
      ? applyQuebecBasicPersonalCredit(quebecTaxBeforeCredits)
      : 0;

  // ─── PAYROLL ──────────────────────────────────────────────
  const qppContribution =
    province === "QC" ? calculateQPPContribution(employmentIncome) : 0;
  const eiPremium = calculateEIPremium(employmentIncome);

  // ─── TOTALS ───────────────────────────────────────────────
  const totalTax = federalTax + quebecTax + qppContribution + eiPremium;
  const afterTaxIncome = Math.max(0, totalGrossIncome - totalTax);
  const effectiveTaxRate =
    totalGrossIncome > 0
      ? Math.round((totalTax / totalGrossIncome) * 10000) / 100
      : 0;

  // ─── MARGINAL RATES ───────────────────────────────────────
  const marginalFederalRate = getMarginalFederalRate(taxableIncome);
  const marginalQuebecRate =
    province === "QC" ? getMarginalQuebecRate(taxableIncome) : 0;
  const effectiveFederalMarginal =
    province === "QC" ? marginalFederalRate * (1 - 0.165) : marginalFederalRate;
  const marginalCombinedRate = effectiveFederalMarginal + marginalQuebecRate;

  // ─── RRSP SAVINGS ─────────────────────────────────────────
  const rrspContributionRoom = calculateRRSPContributionRoom(
    employmentIncome + netFreelanceIncome,
  );
  const rrspTaxSavingsIfMaxed = calculateRRSPTaxSavings(
    rrspContributionRoom - rrspDeduction,
    taxableIncome,
    province,
  );

  return {
    employmentIncome,
    freelanceIncome: netFreelanceIncome,
    rentalIncome: netRentalIncome,
    totalGrossIncome,

    rrspDeduction,
    freelanceExpenses,
    rentalExpenses,
    unionDues: 0,
    totalDeductions,

    totalTaxableIncome: taxableIncome,

    federalTaxBeforeCredits,
    basicPersonalAmountFederal: FEDERAL_CONSTANTS_2026.basicPersonalAmount,
    federalTax,

    quebecTaxBeforeCredits,
    basicPersonalAmountQuebec: province === "QC" ? 17183 : 0,
    quebecAbatement,
    quebecTax,

    qppContribution,
    eiPremium,

    totalTax,
    effectiveTaxRate,
    marginalFederalRate,
    marginalQuebecRate,
    marginalCombinedRate,
    afterTaxIncome,

    rrspContributionRoom,
    rrspTaxSavingsIfMaxed,
    tfsaRoom: FEDERAL_CONSTANTS_2026.tfsaRoom,
  };
};
