import { buildSystemPrompt, buildUserPrompt } from "@/lib/openai/prompts";
import type { TaxRules, UserProfile } from "@/types";

const minimalTaxRules: TaxRules = {
  fiscalYear: 2026,
  validUntil: "2026-12-31",
  federal: {
    reerLimit: 32490,
    celiLimit: 7000,
    fhsaLimit: 8000,
    fhsaLifetimeLimit: 40000,
    basicPersonalAmount: 16129,
  },
  federal_brackets: [
    { min: 0, max: 57375, rate: 0.15 },
    { min: 57375, max: null, rate: 0.33 },
  ],
  quebec: {
    basicPersonalAmount: 17183,
    provincialTaxBrackets: [
      { min: 0, max: 51780, rate: 0.14 },
      { min: 51780, max: null, rate: 0.2575 },
    ],
  },
};

describe("buildSystemPrompt", () => {
  it("returns a string containing the fiscal year and REER limit", () => {
    const prompt = buildSystemPrompt(minimalTaxRules);
    expect(prompt).toContain("2026");
    expect(prompt).toContain("32,490");
    expect(prompt).toContain("Canadian");
  });
});

describe("buildUserPrompt", () => {
  it("returns a string containing profile name and income", () => {
    const profile: UserProfile = {
      id: "p1",
      firstName: "Jane",
      age: 35,
      province: "QC",
      filingStatus: "SINGLE",
      income: {
        employment: {
          grossAnnualSalary: 80000,
          employerName: "Acme",
          province: "QC",
        },
      },
      accounts: [],
      realEstate: [],
      monthlyBudget: {
        fixedExpenses: 0,
        variableExpenses: 0,
        sportsHobbies: 0,
        travel: 0,
        petCare: 0,
        other: 0,
      },
      lifeEvents: [],
      hasPartner: false,
      numberOfChildren: 0,
      plannedChildren: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const prompt = buildUserPrompt(profile);
    expect(prompt).toContain("Jane");
    expect(prompt).toContain("80,000");
  });
});
