import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { openai } from '@/lib/openai/client'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/openai/prompts'
import type { UserProfile, RecommendationReport, TaxRules } from '@/types'
import taxRules2026 from '@/lib/tax-rules/2026.json'

// ============================================
// VALIDATION SCHEMA
// ============================================

const requestSchema = z.object({
  profile: z.object({
    id: z.string(),
    firstName: z.string().min(1),
    age: z.number().min(18).max(100),
    province: z.enum(['QC', 'ON', 'BC', 'AB', 'OTHER']),
    filingStatus: z.enum(['SINGLE', 'COMMON_LAW', 'MARRIED']),
    income: z.object({
      employment: z.object({
        grossAnnualSalary: z.number().min(0),
        employerName: z.string(),
        province: z.enum(['QC', 'ON', 'BC', 'AB', 'OTHER']),
      }),
      freelance: z.optional(z.object({
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
      })),
      rental: z.optional(z.object({
        units: z.number().min(1),
        monthlyRentPerUnit: z.number().min(0),
        mortgageInterestAnnual: z.number().min(0),
        propertyTaxAnnual: z.number().min(0),
        insuranceAnnual: z.number().min(0),
        maintenanceAnnual: z.number().min(0),
        isOwnerOccupied: z.boolean(),
      })),
    }),
    accounts: z.array(z.object({
      id: z.string(),
      type: z.enum(['CELI', 'REER', 'CRI', 'FHSA', 'NON_REGISTERED', 'CRYPTO']),
      currentBalance: z.number().min(0),
      contributionRoom: z.optional(z.number()),
      institution: z.optional(z.string()),
    })),
    realEstate: z.array(z.object({
      id: z.string(),
      type: z.enum(['PRIMARY_RESIDENCE', 'RENTAL']),
      estimatedValue: z.number().min(0),
      mortgageBalance: z.number().min(0),
      mortgageRate: z.number().min(0),
      mortgageMaturityDate: z.optional(z.string()),
      isOwnerOccupied: z.boolean(),
    })),
    monthlyBudget: z.object({
      fixedExpenses: z.number().min(0),
      variableExpenses: z.number().min(0),
      sportsHobbies: z.number().min(0),
      travel: z.number().min(0),
      petCare: z.number().min(0),
      other: z.number().min(0),
    }),
    lifeEvents: z.array(z.object({
      type: z.enum(['MARRIAGE', 'CHILD', 'RENOVATION', 'TRAVEL', 'CAR', 'OTHER']),
      estimatedYear: z.number(),
      estimatedCost: z.number().min(0),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      label: z.string(),
    })),
    hasPartner: z.boolean(),
    partnerIncome: z.optional(z.number()),
    numberOfChildren: z.number().min(0),
    plannedChildren: z.number().min(0),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
})

// ============================================
// HELPERS
// ============================================

const isTaxRulesStale = (rules: TaxRules): boolean => {
  const validUntil = new Date(rules.validUntil)
  return new Date() > validUntil
}

type ParsedAIResponse = Pick<RecommendationReport, 'recommendations' | 'advisorBriefing'>

const parseAIResponse = (content: string): ParsedAIResponse => {
  // Strip any accidental markdown fences
  const clean = content
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  const parsed = JSON.parse(clean) as unknown

  if (!parsed || typeof parsed !== 'object' || !('recommendations' in parsed) || !Array.isArray((parsed as ParsedAIResponse).recommendations)) {
    throw new Error('Invalid AI response structure: missing recommendations array')
  }

  return parsed as ParsedAIResponse
}

// ============================================
// POST /api/recommendations
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const validation = requestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid profile data',
          details: validation.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { profile } = validation.data as { profile: UserProfile }

    // 2. Check if tax rules are stale
    const taxRules = taxRules2026 as TaxRules
    if (isTaxRulesStale(taxRules)) {
      console.warn('[recommendations] Tax rules are stale — update 2026.json')
    }

    // 3. Build prompts
    const systemPrompt = buildSystemPrompt(taxRules)
    const userPrompt = buildUserPrompt(profile)

    // 4. Call OpenAI GPT-4o
    console.log(`[recommendations] Generating for profile: ${profile.id}`)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.2, // Low temperature for financial advice consistency
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    const rawContent = completion.choices[0]?.message?.content

    if (!rawContent) {
      throw new Error('Empty response from OpenAI')
    }

    // 5. Parse and validate AI response
    const parsed = parseAIResponse(rawContent)

    // 6. Build final report
    const report: RecommendationReport = {
      profileId: profile.id,
      generatedAt: new Date().toISOString(),
      fiscalYear: taxRules.fiscalYear,
      totalEstimatedImpact: parsed.recommendations.reduce(
        (sum: number, r: { estimatedImpact: number }) => sum + (r.estimatedImpact || 0),
        0
      ),
      recommendations: parsed.recommendations,
      advisorBriefing: parsed.advisorBriefing,
    }

    console.log(`[recommendations] Generated ${report.recommendations.length} recommendations`)

    return NextResponse.json(report, { status: 200 })

  } catch (error) {
    console.error('[recommendations] Error:', error)
    return NextResponse.json(
      { error: 'Unable to generate recommendations. Please try again.' },
      { status: 500 }
    )
  }
}