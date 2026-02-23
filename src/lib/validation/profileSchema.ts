import { z } from "zod";

// ============================================
// REUSABLE ENUMS & SUB-SCHEMAS (for forms + API)
// ============================================

export const provinceEnum = z.enum(["QC", "ON", "BC", "AB", "OTHER"]);
export const filingStatusEnum = z.enum(["SINGLE", "COMMON_LAW", "MARRIED"]);
export const accountTypeEnum = z.enum([
  "CELI",
  "REER",
  "CRI",
  "FHSA",
  "NON_REGISTERED",
  "CRYPTO",
]);
export const realEstateTypeEnum = z.enum(["PRIMARY_RESIDENCE", "RENTAL"]);
export const lifeEventTypeEnum = z.enum([
  "MARRIAGE",
  "CHILD",
  "RENOVATION",
  "TRAVEL",
  "CAR",
  "OTHER",
]);
export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const accountSchema = z.object({
  id: z.string(),
  type: accountTypeEnum,
  currentBalance: z.number().min(0),
  contributionRoom: z.optional(z.number()),
  institution: z.optional(z.string()),
});

export const realEstateSchema = z.object({
  id: z.string(),
  type: realEstateTypeEnum,
  estimatedValue: z.number().min(0),
  mortgageBalance: z.number().min(0),
  mortgageRate: z.number().min(0),
  mortgageMaturityDate: z.optional(z.string()),
  isOwnerOccupied: z.boolean(),
});

export const lifeEventSchema = z.object({
  type: lifeEventTypeEnum,
  estimatedYear: z.number(),
  estimatedCost: z.number().min(0),
  priority: priorityEnum,
  label: z.string(),
});

export const monthlyBudgetSchema = z.object({
  fixedExpenses: z.number().min(0),
  variableExpenses: z.number().min(0),
  sportsHobbies: z.number().min(0),
  travel: z.number().min(0),
  petCare: z.number().min(0),
  other: z.number().min(0),
});

// ============================================
// FULL PROFILE SCHEMA (API validation)
// ============================================

/**
 * Shared Zod schema for UserProfile.
 * Single source of truth for API validation and type-safe profile shape.
 */
export const profileSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1),
  age: z.number().min(18).max(100),
  province: provinceEnum,
  filingStatus: filingStatusEnum,
  income: z.object({
    employment: z.object({
      grossAnnualSalary: z.number().min(0),
      employerName: z.string(),
      province: z.enum(["QC", "ON", "BC", "AB", "OTHER"]),
    }),
    freelance: z.optional(
      z.object({
        estimatedAnnualRevenue: z.number().min(0),
        hasGSTQSTRegistration: z.boolean(),
        deductibleExpenses: z.object({
          homeOffice: z.boolean(),
          equipment: z.number(),
          software: z.number(),
          vehicle: z.number(),
          phone: z.number(),
          other: z.number(),
        }),
      })
    ),
    rental: z.optional(
      z.object({
        units: z.number().min(1),
        monthlyRentPerUnit: z.number().min(0),
        mortgageInterestAnnual: z.number().min(0),
        propertyTaxAnnual: z.number().min(0),
        insuranceAnnual: z.number().min(0),
        maintenanceAnnual: z.number().min(0),
        isOwnerOccupied: z.boolean(),
      })
    ),
  }),
  accounts: z.array(accountSchema),
  realEstate: z.array(realEstateSchema),
  monthlyBudget: monthlyBudgetSchema,
  lifeEvents: z.array(lifeEventSchema),
  hasPartner: z.boolean(),
  partnerIncome: z.optional(z.number()),
  numberOfChildren: z.number().min(0),
  plannedChildren: z.number().min(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const recommendationsRequestSchema = z.object({
  profile: profileSchema,
});

export type ProfileSchema = z.infer<typeof profileSchema>;
