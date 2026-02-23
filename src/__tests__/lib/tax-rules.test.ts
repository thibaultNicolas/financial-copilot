import taxRules from "@/lib/tax-rules/2026.json";
import type { TaxRules } from "@/types";

const rules = taxRules as TaxRules;

describe("Tax Rules 2026", () => {
  it("has correct fiscal year", () => {
    expect(rules.fiscalYear).toBe(2026);
  });

  it("has valid RRSP limit", () => {
    expect(rules.federal.reerLimit).toBeGreaterThan(0);
    expect(rules.federal.reerLimit).toBe(32490);
  });

  it("has valid TFSA limit", () => {
    expect(rules.federal.celiLimit).toBe(7000);
  });

  it("has valid FHSA limits", () => {
    expect(rules.federal.fhsaLimit).toBe(8000);
    expect(rules.federal.fhsaLifetimeLimit).toBe(40000);
  });

  it("has 5 federal tax brackets", () => {
    expect(rules.federal_brackets).toHaveLength(5);
  });

  it("federal brackets start at 0", () => {
    expect(rules.federal_brackets[0].min).toBe(0);
  });

  it("last federal bracket has no max (null)", () => {
    const last = rules.federal_brackets[rules.federal_brackets.length - 1];
    expect(last.max).toBeNull();
  });

  it("has 4 Quebec provincial brackets", () => {
    expect(rules.quebec.provincialTaxBrackets).toHaveLength(4);
  });

  it("federal brackets are in ascending order", () => {
    for (let i = 1; i < rules.federal_brackets.length; i++) {
      expect(rules.federal_brackets[i].min).toBeGreaterThan(
        rules.federal_brackets[i - 1].min,
      );
    }
  });

  it("has a valid expiry date", () => {
    const validUntil = new Date(rules.validUntil);
    expect(validUntil.getFullYear()).toBe(2026);
  });
});
