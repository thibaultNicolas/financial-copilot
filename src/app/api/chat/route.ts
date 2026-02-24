import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai/client";
import { calculateTax } from "@/lib/tax-engine";
import type { UserProfile } from "@/types";
import type { Recommendation } from "@/types";
import type { ScenarioInput } from "@/lib/tax-engine";

export async function POST(req: NextRequest) {
  try {
    const { message, profile, recommendations, history } = await req.json();

    if (!message || !profile) {
      return NextResponse.json(
        { error: "Missing message or profile" },
        { status: 400 },
      );
    }

    // Calculate real tax breakdown for context
    const taxInput: ScenarioInput = {
      employmentIncome: profile.income?.employment?.grossAnnualSalary ?? 0,
      freelanceIncome: profile.income?.freelance?.estimatedAnnualRevenue ?? 0,
      rentalGrossIncome:
        (profile.income?.rental?.units ?? 0) *
        (profile.income?.rental?.monthlyRentPerUnit ?? 0) *
        12,
      rentalExpenses:
        (profile.income?.rental?.mortgageInterestAnnual ?? 0) +
        (profile.income?.rental?.propertyTaxAnnual ?? 0) +
        (profile.income?.rental?.insuranceAnnual ?? 0) +
        (profile.income?.rental?.maintenanceAnnual ?? 0),
      rrspContribution: 0,
      freelanceExpenses:
        (profile.income?.freelance?.deductibleExpenses?.equipment ?? 0) +
        (profile.income?.freelance?.deductibleExpenses?.software ?? 0) +
        (profile.income?.freelance?.deductibleExpenses?.vehicle ?? 0) +
        (profile.income?.freelance?.deductibleExpenses?.phone ?? 0) +
        (profile.income?.freelance?.deductibleExpenses?.other ?? 0),
      province: profile.province ?? "QC",
      filingStatus: profile.filingStatus ?? "SINGLE",
      age: profile.age ?? 30,
    };

    const taxBreakdown = calculateTax(taxInput);

    const systemPrompt = `You are a Canadian financial planning assistant embedded in Financial Copilot, an AI-powered tax optimization tool.

You are helping ${profile.firstName}, a ${profile.age}-year-old in ${profile.province}.

THEIR REAL TAX SITUATION (calculated with actual CRA/Revenu Québec 2026 rules):
- Total gross income: $${taxBreakdown.totalGrossIncome.toLocaleString()}
- Employment: $${taxBreakdown.employmentIncome.toLocaleString()}
- Freelance (net): $${taxBreakdown.freelanceIncome.toLocaleString()}
- Rental (net): $${taxBreakdown.rentalIncome.toLocaleString()}
- Taxable income: $${taxBreakdown.totalTaxableIncome.toLocaleString()}
- Federal tax: $${taxBreakdown.federalTax.toLocaleString()}
- Quebec tax: $${taxBreakdown.quebecTax.toLocaleString()}
- QPP contribution: $${taxBreakdown.qppContribution.toLocaleString()}
- EI premium: $${taxBreakdown.eiPremium.toLocaleString()}
- Total tax: $${taxBreakdown.totalTax.toLocaleString()}
- Effective tax rate: ${taxBreakdown.effectiveTaxRate}%
- Marginal combined rate: ${Math.round(taxBreakdown.marginalCombinedRate * 100)}%
- After-tax income: $${taxBreakdown.afterTaxIncome.toLocaleString()}
- RRSP contribution room: $${taxBreakdown.rrspContributionRoom.toLocaleString()}
- RRSP tax savings if maxed: $${taxBreakdown.rrspTaxSavingsIfMaxed.toLocaleString()}

THEIR AI RECOMMENDATIONS:
${recommendations?.map((r: Recommendation, i: number) => `${i + 1}. ${r.title} — estimated impact: $${r.estimatedImpact.toLocaleString()} (${r.confidenceScore}% confidence)`).join("\n") ?? "None yet"}

RULES:
- Answer concisely (2-4 sentences max unless complex question)
- Always cite specific dollar amounts from their real tax breakdown
- Never invent tax figures — only use what's calculated above
- If a question requires a licensed advisor, say so clearly
- Be direct and specific, not generic
- Fiscal year: 2026`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
    });

    const reply =
      response.choices[0]?.message?.content ??
      "Sorry, I could not generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
