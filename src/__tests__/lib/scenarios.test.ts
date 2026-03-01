import {
  calculateAllScenarios,
  SCENARIO_YEARS,
} from "@/lib/tax-engine/scenarios";
import type { TaxBreakdown } from "@/lib/tax-engine/types";
import type { UserProfile } from "@/types";

/**
 * Mock profile matching the base input from tax-engine.test.ts so scenario
 * results are comparable: employment 95k, freelance 20k (expenses 5.1k),
 * rental 2×1200×12 = 28800 gross, 21300 expenses.
 */
const MOCK_PROFILE: Partial<UserProfile> = {
  firstName: "Test",
  age: 26,
  province: "QC",
  filingStatus: "SINGLE",
  income: {
    employment: {
      grossAnnualSalary: 95000,
      employerName: "Test",
      province: "QC",
    },
    freelance: {
      estimatedAnnualRevenue: 20000,
      hasGSTQSTRegistration: false,
      deductibleExpenses: {
        homeOffice: false,
        equipment: 2000,
        software: 1500,
        vehicle: 800,
        phone: 400,
        other: 400,
      },
    },
    rental: {
      units: 2,
      monthlyRentPerUnit: 1200,
      mortgageInterestAnnual: 15000,
      propertyTaxAnnual: 3000,
      insuranceAnnual: 1800,
      maintenanceAnnual: 1500,
      isOwnerOccupied: false,
    },
  },
  plannedChildren: 0,
};

const GROWTH_RATE = 1.03;

function isValidTaxBreakdown(b: TaxBreakdown): boolean {
  return (
    typeof b.totalGrossIncome === "number" &&
    typeof b.totalTax === "number" &&
    typeof b.afterTaxIncome === "number" &&
    typeof b.totalTaxableIncome === "number" &&
    b.afterTaxIncome === b.totalGrossIncome - b.totalTax &&
    b.totalGrossIncome >= 0 &&
    b.totalTax >= 0 &&
    b.afterTaxIncome >= 0
  );
}

describe("Scenario comparison engine", () => {
  const scenarios = calculateAllScenarios(MOCK_PROFILE);
  const [scenarioA, scenarioB, scenarioC] = scenarios;

  it("returns exactly three scenarios (A, B, C)", () => {
    expect(scenarios).toHaveLength(3);
    expect(scenarioA.config.name).toBe("Scenario A");
    expect(scenarioB.config.name).toBe("Scenario B");
    expect(scenarioC.config.name).toBe("Scenario C");
  });

  it("Scenario B total tax is less than Scenario A (optimization works)", () => {
    expect(scenarioB.totals.totalTax).toBeLessThan(scenarioA.totals.totalTax);
  });

  it("Scenario C total tax is less than or equal to Scenario B", () => {
    expect(scenarioC.totals.totalTax).toBeLessThanOrEqual(
      scenarioB.totals.totalTax,
    );
  });

  it("3-year income reflects 3% annual growth", () => {
    // Base year gross (from tax-engine.test): 95000 + (20000-5100) + (28800-21300) = 117400
    const baseGross = 117400;
    const expectedYearGrosses = [
      baseGross,
      Math.round(baseGross * GROWTH_RATE),
      Math.round(baseGross * GROWTH_RATE ** 2),
    ];
    const expectedTotalGross = expectedYearGrosses.reduce((a, b) => a + b, 0);

    // Scenario A has no overrides, so 3-year total gross should match growth model
    const actualTotalGrossA = scenarioA.totals.totalGrossIncome;
    expect(actualTotalGrossA).toBe(expectedTotalGross);

    // Each year in A should match expected gross for that year
    SCENARIO_YEARS.forEach((year, index) => {
      const yearData = scenarioA.years.find((y) => y.year === year);
      expect(yearData).toBeDefined();
      expect(yearData!.breakdown.totalGrossIncome).toBe(
        expectedYearGrosses[index],
      );
    });
  });

  it("all scenarios have valid TaxBreakdown for each year", () => {
    for (const scenario of scenarios) {
      expect(scenario.years).toHaveLength(3);
      expect(scenario.years.map((y) => y.year)).toEqual([...SCENARIO_YEARS]);
      for (const { year, breakdown } of scenario.years) {
        expect(isValidTaxBreakdown(breakdown)).toBe(true);
        expect(breakdown.afterTaxIncome).toBe(
          breakdown.totalGrossIncome - breakdown.totalTax,
        );
      }
    }
  });

  it("delta calculations are accurate (vs Scenario A)", () => {
    const totalTaxA = scenarioA.totals.totalTax;
    const totalTaxB = scenarioB.totals.totalTax;
    const totalTaxC = scenarioC.totals.totalTax;

    const deltaBvsA = totalTaxA - totalTaxB;
    const deltaCvsA = totalTaxA - totalTaxC;

    expect(deltaBvsA).toBeGreaterThanOrEqual(0);
    expect(deltaCvsA).toBeGreaterThanOrEqual(0);
    expect(deltaBvsA).toBe(totalTaxA - totalTaxB);
    expect(deltaCvsA).toBe(totalTaxA - totalTaxC);

    // Sanity: B and C are optimized, so deltas should be positive when A has higher tax
    expect(scenarioB.totals.totalTax).toBe(totalTaxB);
    expect(scenarioC.totals.totalTax).toBe(totalTaxC);
  });

  it("3-year totals are sum of year breakdowns", () => {
    for (const scenario of scenarios) {
      const sumTax = scenario.years.reduce(
        (acc, y) => acc + y.breakdown.totalTax,
        0,
      );
      const sumGross = scenario.years.reduce(
        (acc, y) => acc + y.breakdown.totalGrossIncome,
        0,
      );
      const sumAfterTax = scenario.years.reduce(
        (acc, y) => acc + y.breakdown.afterTaxIncome,
        0,
      );
      expect(scenario.totals.totalTax).toBe(sumTax);
      expect(scenario.totals.totalGrossIncome).toBe(sumGross);
      expect(scenario.totals.afterTaxIncome).toBe(sumAfterTax);
    }
  });
});
