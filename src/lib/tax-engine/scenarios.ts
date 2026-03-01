import { calculateTax } from "./calculator";
import { calculateRRSPContributionRoom } from "./deductions";
import { FEDERAL_CONSTANTS_2026 } from "./federal";
import type { ScenarioInput, TaxBreakdown, FilingStatus } from "./types";
import type { UserProfile } from "@/types";

// ─── Scenario years (fixed 3-year window) ─────────────────────
export const SCENARIO_YEARS = [2026, 2027, 2028] as const;
export type ScenarioYearKey = (typeof SCENARIO_YEARS)[number];

/** Per-year overrides applied when calculating a scenario. */
export type ScenarioYearOverrides = {
  rrspContribution?: number;
  incorporateFreelance?: boolean;
  filingStatus?: FilingStatus;
  additionalDeductions?: number;
};

/** Configuration for a single scenario (name, description, year overrides). */
export type ScenarioConfig = {
  name: string;
  description: string;
  years: readonly [number, number, number];
  /** Overrides per year (2026, 2027, 2028). Omitted keys use base profile values. */
  yearOverrides: Partial<Record<ScenarioYearKey, ScenarioYearOverrides>>;
};

/** One year's result within a scenario. */
export type ScenarioYear = {
  year: ScenarioYearKey;
  breakdown: TaxBreakdown;
};

/** Aggregated totals over the 3-year scenario window. */
export type ScenarioTotals = {
  totalGrossIncome: number;
  totalTaxableIncome: number;
  totalDeductions: number;
  totalTax: number;
  totalFederalTax: number;
  totalQuebecTax: number;
  totalQppContribution: number;
  totalEiPremium: number;
  afterTaxIncome: number;
  effectiveTaxRatePct: number; // weighted average
};

/** Full result of running one scenario: year-by-year breakdowns + 3-year totals. */
export type ScenarioComparison = {
  config: ScenarioConfig;
  years: ScenarioYear[];
  totals: ScenarioTotals;
};

const INCOME_GROWTH_RATE = 1.03; // 3% annual growth

/** Build base ScenarioInput from user profile (year 0 = no growth). */
function profileToBaseInput(profile: Partial<UserProfile>): ScenarioInput {
  const employment = profile.income?.employment?.grossAnnualSalary ?? 0;
  const freelanceRevenue =
    profile.income?.freelance?.estimatedAnnualRevenue ?? 0;
  const freelanceExpenses =
    (profile.income?.freelance?.deductibleExpenses?.equipment ?? 0) +
    (profile.income?.freelance?.deductibleExpenses?.software ?? 0) +
    (profile.income?.freelance?.deductibleExpenses?.vehicle ?? 0) +
    (profile.income?.freelance?.deductibleExpenses?.phone ?? 0) +
    (profile.income?.freelance?.deductibleExpenses?.other ?? 0);
  const rental = profile.income?.rental;
  const rentalGross =
    (rental?.units ?? 0) * (rental?.monthlyRentPerUnit ?? 0) * 12;
  const rentalExpenses =
    (rental?.mortgageInterestAnnual ?? 0) +
    (rental?.propertyTaxAnnual ?? 0) +
    (rental?.insuranceAnnual ?? 0) +
    (rental?.maintenanceAnnual ?? 0);

  return {
    employmentIncome: employment,
    freelanceIncome: freelanceRevenue,
    rentalGrossIncome: rentalGross,
    rentalExpenses,
    rrspContribution: 0,
    freelanceExpenses,
    province: profile.province ?? "QC",
    filingStatus: (profile.filingStatus as FilingStatus) ?? "SINGLE",
    age: profile.age ?? 30,
  };
}

/** Apply 3% annual income growth for year index 0, 1, 2. */
function applyGrowth(base: ScenarioInput, yearIndex: 0 | 1 | 2): ScenarioInput {
  if (yearIndex === 0) return { ...base };
  const factor = Math.pow(INCOME_GROWTH_RATE, yearIndex);
  return {
    ...base,
    employmentIncome: Math.round(base.employmentIncome * factor),
    freelanceIncome: Math.round(base.freelanceIncome * factor),
    rentalGrossIncome: Math.round(base.rentalGrossIncome * factor),
    // Expenses grow with income for simplicity
    freelanceExpenses: Math.round(base.freelanceExpenses * factor),
    rentalExpenses: Math.round(base.rentalExpenses * factor),
  };
}

/** Merge year overrides into input. Cap personal freelance at 20k when incorporateFreelance is true. */
function applyOverrides(
  input: ScenarioInput,
  overrides: ScenarioYearOverrides | undefined,
): ScenarioInput {
  if (!overrides) return input;
  let freelanceIncome = input.freelanceIncome;
  if (overrides.incorporateFreelance && input.freelanceIncome > 20_000) {
    freelanceIncome = 20_000;
  }
  return {
    ...input,
    ...(overrides.rrspContribution !== undefined && {
      rrspContribution: overrides.rrspContribution,
    }),
    ...(overrides.filingStatus !== undefined && {
      filingStatus: overrides.filingStatus,
    }),
    ...(overrides.additionalDeductions !== undefined && {
      additionalDeductions: overrides.additionalDeductions,
    }),
    freelanceIncome,
  };
}

/** Resolve effective overrides for a year (inject max RRSP for optimize/life scenarios). */
function resolveOverrides(
  config: ScenarioConfig,
  year: ScenarioYearKey,
  grownInput: ScenarioInput,
): ScenarioYearOverrides {
  const base = config.yearOverrides[year] ?? {};
  const isOptimizeOrLife =
    config.name === "Scenario B" || config.name === "Scenario C";
  const rrspContribution = isOptimizeOrLife
    ? getMaxRRSPContribution(grownInput)
    : base.rrspContribution;
  return {
    ...base,
    ...(rrspContribution !== undefined && { rrspContribution }),
  };
}

/** Compute max RRSP contribution for a given input (current-year room from earned income). */
function getMaxRRSPContribution(input: ScenarioInput): number {
  const earned =
    input.employmentIncome +
    Math.max(0, input.freelanceIncome - input.freelanceExpenses);
  return Math.min(
    calculateRRSPContributionRoom(earned),
    FEDERAL_CONSTANTS_2026.rrspMaxContribution,
  );
}

/** Build Scenario A: status quo (current situation, no changes). */
export function buildScenarioA(profile: Partial<UserProfile>): ScenarioConfig {
  const name = profile?.firstName ? ` for ${profile.firstName}` : "";
  return {
    name: "Scenario A",
    description: `Status quo${name} — current situation, no changes.`,
    years: [2026, 2027, 2028],
    yearOverrides: {},
  };
}

/** Build Scenario B: optimize now (max RRSP, max freelance deductions, incorporate if freelance > 20k). */
export function buildScenarioB(profile: Partial<UserProfile>): ScenarioConfig {
  const base = profileToBaseInput(profile);
  const hasFreelanceOver20k =
    base.freelanceIncome - base.freelanceExpenses > 20_000;
  const incorporate = hasFreelanceOver20k;

  return {
    name: "Scenario B",
    description:
      "Optimize now — max RRSP, max freelance deductions" +
      (incorporate ? ", incorporate freelance (income > $20k)." : "."),
    years: [2026, 2027, 2028],
    yearOverrides: {
      2026: { incorporateFreelance: incorporate },
      2027: { incorporateFreelance: incorporate },
      2028: { incorporateFreelance: incorporate },
    },
  };
}

/** Build Scenario C: life events optimized (B + marriage + planned children RESP). */
export function buildScenarioC(profile: Partial<UserProfile>): ScenarioConfig {
  const scenarioB = buildScenarioB(profile);
  const plannedChildren = profile.plannedChildren ?? 0;
  const respNotional = plannedChildren > 0 ? 2_500 * plannedChildren : 0;

  const withLife: Partial<Record<ScenarioYearKey, ScenarioYearOverrides>> = {};
  for (const y of SCENARIO_YEARS) {
    const b = scenarioB.yearOverrides[y] ?? {};
    withLife[y] = {
      ...b,
      filingStatus: "MARRIED",
      additionalDeductions: (b.additionalDeductions ?? 0) + respNotional,
    };
  }

  return {
    name: "Scenario C",
    description:
      "Life events optimized — Scenario B + marriage filing status" +
      (plannedChildren > 0
        ? ` + planned RESP ($${respNotional.toLocaleString()}/yr).`
        : "."),
    years: [2026, 2027, 2028],
    yearOverrides: withLife,
  };
}

/** Aggregate year breakdowns into 3-year totals. */
function aggregateTotals(years: ScenarioYear[]): ScenarioTotals {
  let totalGrossIncome = 0;
  let totalTaxableIncome = 0;
  let totalDeductions = 0;
  let totalTax = 0;
  let totalFederalTax = 0;
  let totalQuebecTax = 0;
  let totalQppContribution = 0;
  let totalEiPremium = 0;

  for (const { breakdown } of years) {
    totalGrossIncome += breakdown.totalGrossIncome;
    totalTaxableIncome += breakdown.totalTaxableIncome;
    totalDeductions += breakdown.totalDeductions;
    totalTax += breakdown.totalTax;
    totalFederalTax += breakdown.federalTax;
    totalQuebecTax += breakdown.quebecTax;
    totalQppContribution += breakdown.qppContribution;
    totalEiPremium += breakdown.eiPremium;
  }

  const afterTaxIncome = totalGrossIncome - totalTax;
  const effectiveTaxRatePct =
    totalGrossIncome > 0
      ? Math.round((totalTax / totalGrossIncome) * 10000) / 100
      : 0;

  return {
    totalGrossIncome,
    totalTaxableIncome,
    totalDeductions,
    totalTax,
    totalFederalTax,
    totalQuebecTax,
    totalQppContribution,
    totalEiPremium,
    afterTaxIncome,
    effectiveTaxRatePct,
  };
}

/**
 * Run a single scenario: apply 3% income growth per year, apply config overrides,
 * call calculateTax for each year, return year-by-year breakdowns and 3-year totals.
 */
export function calculateScenario(
  profile: Partial<UserProfile>,
  config: ScenarioConfig,
): ScenarioComparison {
  const base = profileToBaseInput(profile);
  const years: ScenarioYear[] = [];

  SCENARIO_YEARS.forEach((year, index) => {
    const yearIndex = index as 0 | 1 | 2;
    const grown = applyGrowth(base, yearIndex);
    const overrides = resolveOverrides(config, year, grown);
    const input = applyOverrides(grown, overrides);
    const breakdown = calculateTax(input);
    years.push({ year, breakdown });
  });

  const totals = aggregateTotals(years);
  return {
    config,
    years,
    totals,
  };
}

/**
 * Run all three pre-defined scenarios (A, B, C) for the given profile.
 * Returns array of ScenarioComparison ready for display.
 */
export function calculateAllScenarios(
  profile: Partial<UserProfile>,
): ScenarioComparison[] {
  const configs = [
    buildScenarioA(profile),
    buildScenarioB(profile),
    buildScenarioC(profile),
  ];
  return configs.map((config) => calculateScenario(profile, config));
}
