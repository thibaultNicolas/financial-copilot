# Financial Copilot — Cursor Rules

## Project context

- **Product**: Canadian (Quebec-focused) financial planning assistant. Tax optimization, registered accounts (REER, CELI, FHSA, CRI), income types (employment, freelance, rental), life events, and recommendations with confidence scores.
- **Path alias**: `@/` → `src/` (use `@/lib`, `@/types`, `@/components`, `@/store`, `@/hooks` in imports).

## Language

- **All** code, comments, prompts, and UI text in **English** only: variable names, function names, comments, types, constants, AI instructions, user-facing copy.
- No French in source files (`.ts`, `.tsx`, `.json`, `.js`), except for external references (e.g. CRA/ARC document URLs if needed).
- Git commit messages in English.

## Stack

- **Next.js 16** App Router + **TypeScript** strict (`tsconfig.json`: `"strict": true`).
- **React 19**.
- **Tailwind CSS 4** + **shadcn/ui** (style: `new-york`, config in `components.json`); Radix UI primitives; **lucide-react** for icons.
- **Zustand** for global state (`src/store/`: e.g. `profile.ts`, `recommendations.ts`).
- **Zod** for all validation (schemas and runtime checks).
- **React Hook Form** + **@hookform/resolvers** for forms.
- **OpenAI** (official SDK) for GPT-based recommendations.
- **Recharts** for charts and financial visualizations.
- **Framer Motion** for animations.

## Code style

- TypeScript strict only; no `any`; use proper types from `@/types` (e.g. `src/types/financial.ts`, `src/types/index.ts`).
- Prefer **named exports** over default exports.
- Use **async/await**; avoid `.then()`.
- API routes under **`src/app/api/`** (App Router).
- Types in **`src/types/`**; re-export shared types via `src/types/index.ts`.
- Business logic in **`src/lib/`** (e.g. `calculations/`, `openai/`, `tax-rules/`, `utils.ts`).
- Components are **presentational**; keep business logic in `src/lib` or stores.

## AI / LLM rules

- **Never** use LLM output for tax figures without validating against **`src/lib/tax-rules/`** (e.g. `2026.json`).
- Every recommendation must include a **confidence score** and **source** (tax rule or doc reference).
- **Flag low confidence (<70%)** for human handoff; never suggest auto-execution on low confidence.
- For legal/succession/incorporation/CRI/real estate, cap confidence and require human advisor review (see `src/lib/openai/prompts.ts`).

## Financial rules

- **Never** store sensitive financial data in `localStorage` (or other unencrypted client storage).
- Store **monetary values as integers (cents)**; format for display (e.g. dollars) in UI only.
- Always show **fiscal year** (and province when relevant) on tax-related calculations.
- Tax rules files have **`validUntil`**; always check validity before using (e.g. `src/lib/tax-rules/2026.json`).

## Error handling

- API routes: use **try/catch** with **typed errors**; never leak raw API/stack traces to the client.
- User-facing errors must be **human-readable**.
- Log LLM calls (input/output) for debugging where appropriate.

## Security

- API keys and secrets only in **`.env.local`**; never in client code or committed files.
- Validate **all** user inputs with **Zod** before processing.
- No automatic execution of financial decisions; always require **explicit user confirmation** for actions.

## Component structure

- **`src/components/ui/`** — shadcn primitives only (align with `components.json` aliases).
- **`src/components/`** — feature-specific and layout components (e.g. `features/`, `layout/` when added).
- Use **`@/lib/utils`** (e.g. `cn`) for class merging; keep styling consistent with Tailwind + shadcn.
