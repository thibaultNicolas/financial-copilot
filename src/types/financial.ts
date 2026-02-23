// ============================================
// INCOME
// ============================================

export type EmploymentIncome = {
  grossAnnualSalary: number;
  employerName: string;
  province: "QC" | "ON" | "BC" | "AB" | "OTHER";
};

export type FreelanceIncome = {
  estimatedAnnualRevenue: number;
  hasGSTQSTRegistration: boolean;
  deductibleExpenses: {
    homeOffice: boolean;
    equipment: number;
    software: number;
    vehicle: number;
    phone: number;
    other: number;
  };
};

export type RentalIncome = {
  units: number;
  monthlyRentPerUnit: number;
  mortgageInterestAnnual: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  maintenanceAnnual: number;
  isOwnerOccupied: boolean;
};

export type Income = {
  employment: EmploymentIncome;
  freelance?: FreelanceIncome;
  rental?: RentalIncome;
};

// ============================================
// ACCOUNTS & INVESTMENTS
// ============================================

export type Account = {
  id: string;
  type: "CELI" | "REER" | "CRI" | "FHSA" | "NON_REGISTERED" | "CRYPTO";
  currentBalance: number;
  contributionRoom?: number; // CELI, REER, FHSA only
  institution?: string;
};

export type RealEstate = {
  id: string;
  type: "PRIMARY_RESIDENCE" | "RENTAL";
  estimatedValue: number;
  mortgageBalance: number;
  mortgageRate: number;
  mortgageMaturityDate?: string;
  isOwnerOccupied: boolean;
};

// ============================================
// LIFE PROFILE
// ============================================

export type LifeEvent = {
  type: "MARRIAGE" | "CHILD" | "RENOVATION" | "TRAVEL" | "CAR" | "OTHER";
  estimatedYear: number;
  estimatedCost: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  label: string;
};

export type MonthlyBudget = {
  fixedExpenses: number; // rent, insurance, etc.
  variableExpenses: number; // groceries, leisure, etc.
  sportsHobbies: number;
  travel: number;
  petCare: number;
  other: number;
};

// ============================================
// USER PROFILE
// ============================================

export type UserProfile = {
  // Identity
  id: string;
  firstName: string;
  age: number;
  province: "QC" | "ON" | "BC" | "AB" | "OTHER";
  filingStatus: "SINGLE" | "COMMON_LAW" | "MARRIED";

  // Finances
  income: Income;
  accounts: Account[];
  realEstate: RealEstate[];
  monthlyBudget: MonthlyBudget;

  // Life
  lifeEvents: LifeEvent[];
  hasPartner: boolean;
  partnerIncome?: number;
  numberOfChildren: number;
  plannedChildren: number;

  // Meta
  createdAt: string;
  updatedAt: string;
};

// ============================================
// RECOMMENDATIONS
// ============================================

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export type RecommendationSource = {
  label: string;
  url?: string;
  fiscalYear: number;
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  category: "TAX" | "SAVINGS" | "INVESTMENT" | "PROTECTION" | "PLANNING";
  priority: number; // 1 = highest
  estimatedImpact: number; // estimated annual $
  confidenceScore: number; // 0-100
  confidenceLevel: ConfidenceLevel;
  requiresHumanReview: boolean;
  sources: RecommendationSource[];
  actionItems: string[];
  humanHandoffReason?: string; // when requiresHumanReview is true
};

export type RecommendationReport = {
  profileId: string;
  generatedAt: string;
  fiscalYear: number;
  totalEstimatedImpact: number;
  recommendations: Recommendation[];
  advisorBriefing?: AdvisorBriefing;
};

// ============================================
// ADVISOR HANDOFF
// ============================================

export type AdvisorBriefing = {
  summary: string;
  complexIssues: string[];
  questionsToAsk: string[];
  documentsToGather: string[];
  urgency: "LOW" | "MEDIUM" | "HIGH";
};

// ============================================
// TAX RULES
// ============================================

export type TaxRules = {
  fiscalYear: number;
  validUntil: string;
  federal: {
    reerLimit: number;
    celiLimit: number;
    fhsaLimit: number;
    fhsaLifetimeLimit: number;
    basicPersonalAmount: number;
  };
  quebec: {
    provincialTaxBrackets: TaxBracket[];
    basicPersonalAmount: number;
  };
  federal_brackets: TaxBracket[];
};

export type TaxBracket = {
  min: number;
  max: number | null;
  rate: number;
};
