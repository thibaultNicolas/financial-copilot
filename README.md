# Financial Copilot

Financial Copilot is an AI-assisted tax and planning tool for Canadians with complex situations: multiple income sources (employment, freelance, rental), registered accounts (RRSP, TFSA, FHSA), and life events (marriage, children, incorporation). It produces prioritized, confidence-scored recommendations and 3-year scenario comparisons using real CRA and Revenu Québec 2026 rules—not estimates. The hard part is keeping the AI from hallucinating tax numbers and from overstating confidence; we solve that by making a deterministic tax engine the single source of truth and using the model only for interpretation and language.

## The Problem

Most Canadians with complex financial situations can't access quality financial planning. A human advisor costs hundreds per hour and requires scheduling. Generic tools give generic advice and often invent or approximate tax figures. This system closes that gap: the user gets a full profile-based analysis, scenario comparison (status quo vs optimize vs life-events), and natural-language answers—all grounded in the same calculated numbers. The boundary between what the system decides and what requires a human is explicit and enforced in code and prompts.

## What the AI Actually Does

**Layer 1 — Tax Engine (pure deterministic math)**  
No LLM. All dollar amounts come from `src/lib/tax-engine/`: federal and Quebec brackets, basic personal amounts, QPP, EI, RRSP room, abatement. Inputs: employment, freelance, rental, RRSP contribution, province, filing status, age. Outputs: taxable income, federal tax, Quebec tax, total tax, after-tax income, marginal rates. Scenarios (A/B/C) run the same engine with different overrides (e.g. max RRSP, incorporate freelance, marriage + RESP) and 3% income growth over 2026–2028. The UI and the AI both consume these results; neither invents a number.

**Layer 2 — AI Interpretation Layer**  
GPT-4o-mini reads the user profile and the **injected** tax rules (limits, brackets from verified JSON). It outputs a structured list of recommendations: title, description, category, priority, estimated impact, **confidence score (0–100)**, **confidence level (HIGH/MEDIUM/LOW)**, and **requiresHumanReview** (boolean). It does not invent brackets or limits; the system prompt forbids it. Confidence is guided by prompt rules (e.g. never >70% for legal/succession; always handoff for CRI, incorporation, succession).

**Layer 3 — Conversational Layer**  
GPT-4o answers follow-up questions in the chat. The system prompt includes the **real calculated tax breakdown** (from the engine) and the user's recommendations. Every answer is grounded in those figures. A separate endpoint generates a one-sentence scenario insight (“why this scenario wins”) using the same 3-year totals and deltas from the engine.

## Human/AI Boundary

**AI decides autonomously**

- Which accounts to prioritize (contribution room + marginal rate from the engine)
- Order of recommendations by financial impact
- Confidence score for each recommendation (0–100, HIGH/MEDIUM/LOW)
- Whether to flag for human advisor (prompt instructs: flag when confidence would be <70% for complex/legal/succession, and always for CRI, incorporation, succession, complex real estate)
- Tax savings and 3-year scenario totals (all from the engine; AI only explains them)

**Requires human advisor (hard-coded in prompts, never overridden by AI)**

- CRI/LIRA withdrawal strategies (legal complexity)
- Incorporation decisions (irreversible, tax-law dependent)
- Succession planning
- Any recommendation with confidence <70% (prompt instructs handoff)
- Any recommendation with `requiresHumanReview: true` (UI shows “Advisor Required” and optional `humanHandoffReason`)

The model is instructed to always set `requiresHumanReview: true` for the categories above and to never claim >70% confidence on legal or succession matters.

## Failure Modes & Mitigations

| Failure mode | Mitigation |
|-------------|------------|
| **LLM tax hallucination** | All figures come from the tax engine or from verified JSON tax rules injected into the prompt. Model is instructed never to invent numbers. |
| **False confidence** | Every recommendation has an explicit 0–100 confidence score and HIGH/MEDIUM/LOW. Prompt defines bands (e.g. 90–100% = clear-cut; <50% = mandatory handoff). UI color-codes by score. |
| **Incomplete profile** | Validation and onboarding collect required fields before recommendations; missing data can be detected and surfaced. |
| **Outdated rules** | Tax data has a `validUntil` date (`tax-rules/2026.json`); API logs a warning when rules are stale. |
| **Irreversible decisions** | Recommendations that require professional review are hard-flagged with `requiresHumanReview` and an “Advisor Required” badge; handoff reason and advisor briefing (when present) prepare a human to take over. |

## Technical Architecture

- **Next.js 16**, TypeScript (strict), App Router, API routes for recommendations, chat, scenario-insight.
- **Tax engine**: `src/lib/tax-engine/` — `federal.ts`, `quebec.ts`, `deductions.ts`, `calculator.ts`, `scenarios.ts`. ~400+ lines of Canadian tax math; no LLM dependency; unit-tested for exact amounts and scenario ordering (e.g. Scenario B total tax < Scenario A).
- **Models**: GPT-4o-mini for recommendations (temperature 0.2); GPT-4o for chat and scenario insight (temperature 0.3).
- **Validation**: Zod on all API inputs; profile and recommendation request schemas.
- **State**: Zustand (profile, recommendations report).
- **i18n**: next-intl for EN/FR.
- **Tests**: Jest; coverage includes tax engine, scenarios, calculations, store, API, and components. Run: `npm test`.

## Tax Rules Sources

- **Federal brackets**: [CRA – Canadian income tax rates (individuals)](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html)
- **RRSP limit**: [CRA – RRSP deduction limit](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/registered-retirement-savings-plan-rrsp.html)
- **TFSA limit**: [CRA – TFSA dollar limit](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html)
- **FHSA**: [CRA – First Home Savings Account](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html)
- **Quebec brackets**: [Revenu Québec – Income tax rates](https://www.revenuquebec.ca/en/citizens/tax-situation/income-tax-rates/)
- **QPP**: [Revenu Québec – Quebec Pension Plan](https://www.revenuquebec.ca/en/citizens/retirement-and-retirement-savings/quebec-pension-plan/)
- **Quebec abatement**: [CRA – Quebec abatement (16.5%)](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/tax-calculation-quebec-abatement.html)

Engine constants and brackets are in `federal.ts` and `quebec.ts`; the recommendations API uses `src/lib/tax-rules/2026.json` for prompt injection.

## What I'd Build Next

1. **Document ingestion** — Upload T4, T5, rental statements; parse and auto-populate profile fields (income, deductions, account balances).
2. **CRA MyAccount integration** — Pull real RRSP/TFSA/FHSA contribution room via CRA API (or secure linking) so recommendations use actual room, not estimates.
3. **Year-round tax-loss harvesting alerts** — Monitor non-registered positions (e.g. from linked accounts or manual input), flag realized/unrealized gains and loss-harvesting opportunities before year-end.

## Live Demo

[Add your Vercel URL here after deployment.]

Use “View live demo” (or equivalent) to skip onboarding and see a pre-filled profile with recommendations and scenario comparison.

---

*This tool is for informational purposes only and does not constitute financial advice. Consult a qualified advisor before making financial decisions.*
