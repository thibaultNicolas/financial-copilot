import { calculateTax } from "@/lib/tax-engine";

const BASE_INPUT = {
  employmentIncome: 95000,
  freelanceIncome: 20000,
  rentalGrossIncome: 28800, // 2 units * $1200 * 12
  rentalExpenses: 21300, // mortgage interest + tax + insurance + maintenance
  rrspContribution: 0,
  freelanceExpenses: 5100,
  province: "QC",
  filingStatus: "SINGLE" as const,
  age: 26,
};

describe("Tax Engine — calculateTax", () => {
  it("calculates total gross income correctly", () => {
    const result = calculateTax(BASE_INPUT);
    // Net freelance: 20000 - 5100 = 14900
    // Net rental: 28800 - 21300 = 7500
    // Total: 95000 + 14900 + 7500 = 117400
    expect(result.totalGrossIncome).toBe(117400);
  });

  it("calculates taxable income after RRSP deduction", () => {
    const result = calculateTax({ ...BASE_INPUT, rrspContribution: 10000 });
    expect(result.rrspDeduction).toBe(10000);
    expect(result.totalTaxableIncome).toBe(107400);
  });

  it("caps RRSP deduction at contribution room", () => {
    // Room = 18% of (95000 + 14900) = 18% of 109900 = 19782, capped at 32490
    const result = calculateTax({ ...BASE_INPUT, rrspContribution: 50000 });
    expect(result.rrspDeduction).toBeLessThanOrEqual(32490);
  });

  it("applies Quebec abatement (16.5% reduction on federal)", () => {
    const result = calculateTax(BASE_INPUT);
    expect(result.quebecAbatement).toBeGreaterThan(0);
    expect(result.federalTax).toBeLessThan(result.federalTaxBeforeCredits);
  });

  it("calculates QPP contribution for QC residents", () => {
    const result = calculateTax(BASE_INPUT);
    expect(result.qppContribution).toBeGreaterThan(0);
    expect(result.qppContribution).toBeLessThanOrEqual(4038);
  });

  it("calculates EI premium correctly", () => {
    const result = calculateTax(BASE_INPUT);
    expect(result.eiPremium).toBeGreaterThan(0);
    expect(result.eiPremium).toBeLessThanOrEqual(1090);
  });

  it("after-tax income is gross minus total tax", () => {
    const result = calculateTax(BASE_INPUT);
    expect(result.afterTaxIncome).toBe(
      result.totalGrossIncome - result.totalTax,
    );
  });

  it("effective tax rate is between 0 and 100", () => {
    const result = calculateTax(BASE_INPUT);
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeLessThan(100);
  });

  it("RRSP savings reduce tax when contributed", () => {
    const without = calculateTax(BASE_INPUT);
    const with10k = calculateTax({ ...BASE_INPUT, rrspContribution: 10000 });
    expect(with10k.totalTax).toBeLessThan(without.totalTax);
  });

  it("handles zero income gracefully", () => {
    const result = calculateTax({
      ...BASE_INPUT,
      employmentIncome: 0,
      freelanceIncome: 0,
      rentalGrossIncome: 0,
      rentalExpenses: 0,
    });
    expect(result.totalTax).toBeGreaterThanOrEqual(0);
    expect(result.afterTaxIncome).toBeGreaterThanOrEqual(0);
  });

  it("combined marginal rate for QC is reasonable (30-50%)", () => {
    const result = calculateTax(BASE_INPUT);
    expect(result.marginalCombinedRate).toBeGreaterThan(0.3);
    expect(result.marginalCombinedRate).toBeLessThan(0.6);
  });
});
