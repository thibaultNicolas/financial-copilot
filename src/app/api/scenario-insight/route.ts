import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai/client";

type ScenarioSummary = {
  scenarioAName: string;
  scenarioBName: string;
  scenarioCName: string;
  bestScenarioName: string;
  bestScenarioDescription: string;
  totalTaxA: number;
  totalTaxB: number;
  totalTaxC: number;
  savingsVsA: number;
};

export async function POST(req: NextRequest) {
  try {
    const { profile, scenarioSummary } = (await req.json()) as {
      profile: Record<string, unknown>;
      scenarioSummary: ScenarioSummary;
    };

    if (!scenarioSummary?.bestScenarioName || scenarioSummary.savingsVsA === undefined) {
      return NextResponse.json(
        { error: "Missing scenarioSummary or required fields" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API not configured" },
        { status: 503 },
      );
    }

    const name = (profile?.firstName as string) || "You";
    const systemPrompt = `You are a Canadian tax advisor. Given the following 3-year scenario comparison, reply with exactly ONE short sentence explaining why the recommended scenario wins. Cite the actual dollar savings. No preamble, no bullet points. Be specific and direct.`;

    const userContent = `${name}'s scenarios:
- ${scenarioSummary.scenarioAName}: $${scenarioSummary.totalTaxA.toLocaleString()} total tax over 3 years (status quo)
- ${scenarioSummary.scenarioBName}: $${scenarioSummary.totalTaxB.toLocaleString()} total tax
- ${scenarioSummary.scenarioCName}: $${scenarioSummary.totalTaxC.toLocaleString()} total tax

Recommended: ${scenarioSummary.bestScenarioName} — ${scenarioSummary.bestScenarioDescription}
Savings vs status quo: $${scenarioSummary.savingsVsA.toLocaleString()} over 3 years.

Reply with one sentence only.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 120,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    const insight =
      response.choices[0]?.message?.content?.trim() ??
      "The recommended scenario reduces your total tax over the three years.";

    return NextResponse.json({ insight });
  } catch (err) {
    console.error("Scenario insight API error:", err);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 },
    );
  }
}
