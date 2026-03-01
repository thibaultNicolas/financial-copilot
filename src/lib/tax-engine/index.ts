export type {
  FilingStatus,
  TaxBracket,
  TaxBreakdown,
  ScenarioInput,
  ScenarioResult,
} from "./types";
export { calculateTax } from "./calculator";
export {
  calculateNetRentalIncome,
  calculateFreelanceNetIncome,
  calculateRRSPTaxSavings,
} from "./deductions";
export { FEDERAL_BRACKETS_2026, FEDERAL_CONSTANTS_2026 } from "./federal";
export { QUEBEC_BRACKETS_2026, QUEBEC_CONSTANTS_2026 } from "./quebec";
export {
  SCENARIO_YEARS,
  buildScenarioA,
  buildScenarioB,
  buildScenarioC,
  calculateScenario,
  calculateAllScenarios,
} from "./scenarios";
export type {
  ScenarioConfig,
  ScenarioYear,
  ScenarioYearKey,
  ScenarioYearOverrides,
  ScenarioTotals,
  ScenarioComparison,
} from "./scenarios";
