import { NextRequest, NextResponse } from "next/server";
import type { ChatCompletion } from "openai/resources/chat/completions";
import { openai } from "@/lib/openai/client";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/openai/prompts";
import { recommendationsRequestSchema } from "@/lib/validation/profileSchema";
import { totalEstimatedImpact } from "@/lib/calculations";
import type { UserProfile, RecommendationReport, TaxRules } from "@/types";
import taxRules2026 from "@/lib/tax-rules/2026.json";

// ============================================
// HELPERS
// ============================================

const isTaxRulesStale = (rules: TaxRules): boolean => {
  const validUntil = new Date(rules.validUntil);
  return new Date() > validUntil;
};

type ParsedAIResponse = Pick<
  RecommendationReport,
  "recommendations" | "advisorBriefing"
>;

const parseAIResponse = (content: string): ParsedAIResponse => {
  // Strip any accidental markdown fences
  const clean = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(clean) as unknown;

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("recommendations" in parsed) ||
    !Array.isArray((parsed as ParsedAIResponse).recommendations)
  ) {
    throw new Error(
      "Invalid AI response structure: missing recommendations array",
    );
  }

  return parsed as ParsedAIResponse;
};

// ============================================
// POST /api/recommendations
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 0. Require API key at request time (not at build time, so Vercel build succeeds)
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not set. Add it in Vercel Environment Variables (or .env.local for local dev).",
        },
        { status: 503 },
      );
    }

    // 1. Parse and validate request body
    const body = await request.json();
    const validation = recommendationsRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid profile data",
          details: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { profile } = validation.data as { profile: UserProfile };

    // 2. Check if tax rules are stale
    const taxRules = taxRules2026 as TaxRules;
    if (isTaxRulesStale(taxRules)) {
      console.warn("[recommendations] Tax rules are stale — update 2026.json");
    }

    // 3. Build prompts
    const systemPrompt = buildSystemPrompt(taxRules);
    const userPrompt = buildUserPrompt(profile);

    // 4. Call OpenAI with retry on rate limit (429)
    console.log(`[recommendations] Generating for profile: ${profile.id}`);
    const maxRetries = 2;
    const retryDelays = [3000, 6000]; // ms
    let completion: ChatCompletion | null = null;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });
        completion = result as ChatCompletion;
        break;
      } catch (err) {
        lastError = err;
        const status =
          err && typeof err === "object" && "status" in err
            ? (err as { status: number }).status
            : null;
        if (status === 429 && attempt < maxRetries) {
          const delay = retryDelays[attempt] ?? 5000;
          console.warn(
            `[recommendations] Rate limited (429), retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})`,
          );
          await new Promise((r) => setTimeout(r, delay));
        } else {
          throw err;
        }
      }
    }

    if (!completion) {
      throw lastError ?? new Error("OpenAI request failed");
    }

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty response from OpenAI");
    }

    // 5. Parse and validate AI response
    const parsed = parseAIResponse(rawContent);

    // 6. Build final report
    const report: RecommendationReport = {
      profileId: profile.id,
      generatedAt: new Date().toISOString(),
      fiscalYear: taxRules.fiscalYear,
      totalEstimatedImpact: totalEstimatedImpact(parsed.recommendations),
      recommendations: parsed.recommendations,
      advisorBriefing: parsed.advisorBriefing,
    };

    console.log(
      `[recommendations] Generated ${report.recommendations.length} recommendations`,
    );

    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error("[recommendations] Error:", error);

    // Return a more specific message when possible (e.g. API key, rate limit)
    let message = "Unable to generate recommendations. Please try again.";
    if (error && typeof error === "object") {
      const err = error as { status?: number; message?: string };
      if (err.status === 401) {
        message = "Invalid OpenAI API key. Check OPENAI_API_KEY in .env.local.";
      } else if (err.status === 429) {
        message = "OpenAI rate limit exceeded. Please try again in a moment.";
      } else if (
        err.message?.includes("API key") ||
        err.message?.includes("Incorrect API key")
      ) {
        message = "Invalid OpenAI API key. Check OPENAI_API_KEY in .env.local.";
      } else if (err.message) {
        message = err.message;
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
