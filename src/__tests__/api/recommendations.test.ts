import { recommendationsRequestSchema } from "@/lib/validation/profileSchema";

describe("POST /api/recommendations", () => {
  it("rejects request with missing profile", () => {
    const result = recommendationsRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects request with invalid profile (missing required fields)", () => {
    const result = recommendationsRequestSchema.safeParse({
      profile: {
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
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts request with valid profile (includes id)", () => {
    const result = recommendationsRequestSchema.safeParse({
      profile: {
        id: "profile-1",
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
      },
    });
    expect(result.success).toBe(true);
  });
});
