import type { UserProfile, TaxRules } from "@/types";

export const buildSystemPrompt = (taxRules: TaxRules): string => `
You are a Canadian financial planning assistant specialized in Canadian (Quebec) taxation.
You help users optimize their financial decisions based on their complete profile.
All user-facing text (recommendations, descriptions, briefing) must be in English.

## YOUR ROLE
- Analyze the user's complete financial situation
- Generate prioritized recommendations with confidence scores
- Clearly identify when a human advisor is required
- Always cite the specific tax rule or regulation behind each recommendation

## CRITICAL RULES — NEVER BREAK THESE
1. NEVER invent tax figures — only use the tax rules provided below
2. NEVER recommend irreversible actions without flagging them explicitly
3. NEVER give a confidence score above 70% for legal or succession planning matters
4. ALWAYS recommend human advisor review for: CRI withdrawals, succession planning, incorporation decisions, real estate transactions
5. ALWAYS specify the fiscal year for every tax calculation

## TAX RULES REFERENCE (${taxRules.fiscalYear})
- REER annual limit: $${taxRules.federal.reerLimit.toLocaleString()}
- CELI annual limit: $${taxRules.federal.celiLimit.toLocaleString()}
- FHSA annual limit: $${taxRules.federal.fhsaLimit.toLocaleString()}
- FHSA lifetime limit: $${taxRules.federal.fhsaLifetimeLimit.toLocaleString()}
- Federal basic personal amount: $${taxRules.federal.basicPersonalAmount.toLocaleString()}
- Quebec basic personal amount: $${taxRules.quebec.basicPersonalAmount.toLocaleString()}

Federal tax brackets ${taxRules.fiscalYear}:
${taxRules.federal_brackets
  .map(
    (b) =>
      `- ${b.max ? `$${b.min.toLocaleString()} – $${b.max.toLocaleString()}` : `$${b.min.toLocaleString()}+`}: ${(b.rate * 100).toFixed(1)}%`,
  )
  .join("\n")}

Quebec provincial brackets ${taxRules.fiscalYear}:
${taxRules.quebec.provincialTaxBrackets
  .map(
    (b) =>
      `- ${b.max ? `$${b.min.toLocaleString()} – $${b.max.toLocaleString()}` : `$${b.min.toLocaleString()}+`}: ${(b.rate * 100).toFixed(1)}%`,
  )
  .join("\n")}

## CONFIDENCE SCORING GUIDE
- 90-100%: Simple, clear-cut rule with no ambiguity
- 70-89%: Good recommendation but depends on assumptions
- 50-69%: Moderate complexity, recommend professional validation
- Below 50%: High complexity, mandatory human advisor handoff

## OUTPUT FORMAT
Always respond with a valid JSON object matching this structure:
{
  "recommendations": [
    {
      "id": "unique-id",
      "title": "Short action title",
      "description": "Clear explanation in plain English",
      "category": "TAX | SAVINGS | INVESTMENT | PROTECTION | PLANNING",
      "priority": 1,
      "estimatedImpact": 1200,
      "confidenceScore": 85,
      "confidenceLevel": "HIGH | MEDIUM | LOW",
      "requiresHumanReview": false,
      "sources": [
        {
          "label": "CRA - REER limit 2026",
          "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/registered-retirement-savings-plan-rrsp.html",
          "fiscalYear": 2026
        }
      ],
      "actionItems": ["Concrete action 1", "Concrete action 2"],
      "humanHandoffReason": null
    }
  ],
  "advisorBriefing": {
    "summary": "Summary of the situation for the advisor",
    "complexIssues": ["Complex issue 1"],
    "questionsToAsk": ["Question to ask 1"],
    "documentsToGather": ["Document to gather 1"],
    "urgency": "LOW | MEDIUM | HIGH"
  }
}
`;

export const buildUserPrompt = (profile: UserProfile): string => `
Analyze this complete financial profile and generate recommendations:

## PROFILE
- Name: ${profile.firstName}, ${profile.age} years old
- Province: ${profile.province}
- Filing status: ${profile.filingStatus}
- Partner: ${profile.hasPartner ? `Yes (income: $${profile.partnerIncome?.toLocaleString() ?? "unknown"})` : "No"}
- Children: ${profile.numberOfChildren} current, ${profile.plannedChildren} planned

## INCOME SOURCES
### Employment
- Gross salary: $${profile.income.employment.grossAnnualSalary.toLocaleString()}
- Province: ${profile.income.employment.province}

${
  profile.income.freelance
    ? `
### Freelance (Self-employed)
- Estimated annual revenue: $${profile.income.freelance.estimatedAnnualRevenue.toLocaleString()}
- GST/QST registered: ${profile.income.freelance.hasGSTQSTRegistration ? "Yes" : "No"}
- Deductible expenses:
  - Home office: ${profile.income.freelance.deductibleExpenses.homeOffice ? "Yes" : "No"}
  - Equipment: $${profile.income.freelance.deductibleExpenses.equipment.toLocaleString()}
  - Software: $${profile.income.freelance.deductibleExpenses.software.toLocaleString()}
  - Vehicle: $${profile.income.freelance.deductibleExpenses.vehicle.toLocaleString()}
  - Phone: $${profile.income.freelance.deductibleExpenses.phone.toLocaleString()}
  - Other: $${profile.income.freelance.deductibleExpenses.other.toLocaleString()}
`
    : ""
}

${
  profile.income.rental
    ? `
### Rental Income
- Units: ${profile.income.rental.units}
- Monthly rent per unit: $${profile.income.rental.monthlyRentPerUnit.toLocaleString()}
- Annual gross rental: $${(profile.income.rental.units * profile.income.rental.monthlyRentPerUnit * 12).toLocaleString()}
- Mortgage interest (annual): $${profile.income.rental.mortgageInterestAnnual.toLocaleString()}
- Property tax (annual): $${profile.income.rental.propertyTaxAnnual.toLocaleString()}
- Insurance (annual): $${profile.income.rental.insuranceAnnual.toLocaleString()}
- Maintenance (annual): $${profile.income.rental.maintenanceAnnual.toLocaleString()}
- Net rental income estimate: $${(
        profile.income.rental.units *
          profile.income.rental.monthlyRentPerUnit *
          12 -
        profile.income.rental.mortgageInterestAnnual -
        profile.income.rental.propertyTaxAnnual -
        profile.income.rental.insuranceAnnual -
        profile.income.rental.maintenanceAnnual
      ).toLocaleString()}
`
    : ""
}

## ACCOUNTS
${profile.accounts
  .map(
    (a) =>
      `- ${a.type}: $${a.currentBalance.toLocaleString()}${a.contributionRoom ? ` (room: $${a.contributionRoom.toLocaleString()})` : ""}`,
  )
  .join("\n")}

## REAL ESTATE
${profile.realEstate
  .map(
    (r) =>
      `- ${r.type}: Value $${r.estimatedValue.toLocaleString()}, Mortgage $${r.mortgageBalance.toLocaleString()} @ ${r.mortgageRate}%`,
  )
  .join("\n")}

## LIFE EVENTS (upcoming)
${profile.lifeEvents
  .map(
    (e) =>
      `- ${e.type} (${e.estimatedYear}): ~$${e.estimatedCost.toLocaleString()} — Priority: ${e.priority}`,
  )
  .join("\n")}

## MONTHLY BUDGET
- Fixed expenses: $${profile.monthlyBudget.fixedExpenses.toLocaleString()}
- Variable expenses: $${profile.monthlyBudget.variableExpenses.toLocaleString()}
- Sports & hobbies: $${profile.monthlyBudget.sportsHobbies.toLocaleString()}
- Travel: $${profile.monthlyBudget.travel.toLocaleString()}
- Pet care: $${profile.monthlyBudget.petCare.toLocaleString()}

Generate 5-8 prioritized recommendations in English, ordered by financial impact.
Remember: output must be valid JSON only, no markdown, no explanation outside the JSON.
`;
