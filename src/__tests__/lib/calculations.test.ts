import {
  totalAnnualIncome,
  totalRegisteredAssets,
  totalRealEstateEquity,
  netWorthEstimate,
  totalEstimatedImpact,
} from "@/lib/calculations";
import type { UserProfile } from "@/types";

// ============================================
// MOCK DATA
// ============================================

const mockProfile: Partial<UserProfile> = {
  firstName: "Nicolas",
  age: 30,
  province: "QC",
  income: {
    employment: {
      grossAnnualSalary: 95000,
      employerName: "Acme Corp",
      province: "QC",
    },
    freelance: {
      estimatedAnnualRevenue: 30000,
      hasGSTQSTRegistration: true,
      deductibleExpenses: {
        homeOffice: true,
        equipment: 2000,
        software: 2400,
        vehicle: 0,
        phone: 1200,
        other: 500,
      },
    },
    rental: {
      units: 3,
      monthlyRentPerUnit: 1400,
      mortgageInterestAnnual: 18000,
      propertyTaxAnnual: 4500,
      insuranceAnnual: 2400,
      maintenanceAnnual: 3000,
      isOwnerOccupied: false,
    },
  },
  accounts: [
    { id: "1", type: "CELI", currentBalance: 25000, contributionRoom: 7000 },
    { id: "2", type: "REER", currentBalance: 45000, contributionRoom: 15000 },
    { id: "3", type: "CRI", currentBalance: 18000 },
  ],
  realEstate: [
    {
      id: "1",
      type: "PRIMARY_RESIDENCE",
      estimatedValue: 550000,
      mortgageBalance: 380000,
      mortgageRate: 4.99,
      isOwnerOccupied: true,
    },
    {
      id: "2",
      type: "RENTAL",
      estimatedValue: 650000,
      mortgageBalance: 480000,
      mortgageRate: 5.25,
      isOwnerOccupied: false,
    },
  ],
};

// ============================================
// INCOME
// ============================================

describe("totalAnnualIncome", () => {
  it("sums employment, freelance, and gross rental income correctly", () => {
    // 95000 + 30000 + (3 * 1400 * 12) = 175400
    expect(totalAnnualIncome(mockProfile)).toBe(175400);
  });

  it("returns only employment income when no freelance or rental", () => {
    const profile: Partial<UserProfile> = {
      income: {
        employment: {
          grossAnnualSalary: 80000,
          employerName: "Corp",
          province: "QC",
        },
      },
    };
    expect(totalAnnualIncome(profile)).toBe(80000);
  });

  it("returns 0 for empty profile", () => {
    expect(totalAnnualIncome({})).toBe(0);
  });
});

// ============================================
// ASSETS
// ============================================

describe("totalRegisteredAssets", () => {
  it("sums all account balances correctly", () => {
    // 25000 + 45000 + 18000 = 88000
    expect(totalRegisteredAssets(mockProfile)).toBe(88000);
  });

  it("returns 0 when no accounts", () => {
    expect(totalRegisteredAssets({})).toBe(0);
  });
});

describe("totalRealEstateEquity", () => {
  it("calculates equity correctly", () => {
    // (550000 - 380000) + (650000 - 480000) = 170000 + 170000 = 340000
    expect(totalRealEstateEquity(mockProfile)).toBe(340000);
  });

  it("returns 0 when no real estate", () => {
    expect(totalRealEstateEquity({})).toBe(0);
  });
});

describe("netWorthEstimate", () => {
  it("calculates net worth as assets + equity", () => {
    // 88000 + 340000 = 428000
    expect(netWorthEstimate(mockProfile)).toBe(428000);
  });
});

// ============================================
// RECOMMENDATIONS
// ============================================

describe("totalEstimatedImpact", () => {
  it("sums estimated impact from recommendations", () => {
    const recs = [
      { estimatedImpact: 1200 },
      { estimatedImpact: 500 },
      { estimatedImpact: 0 },
    ];
    expect(totalEstimatedImpact(recs)).toBe(1700);
  });

  it("returns 0 for empty array", () => {
    expect(totalEstimatedImpact([])).toBe(0);
  });

  it("ignores missing estimatedImpact", () => {
    expect(
      totalEstimatedImpact([{ estimatedImpact: 100 }, {}])
    ).toBe(100);
  });
});
