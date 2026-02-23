# Financial Copilot 🇨🇦

> An AI-powered financial decision tool for complex Canadian tax scenarios.
> Built as a submission for the Wealthsimple AI Builders program.

## What it does

Financial Copilot analyzes a user's complete financial profile — employment income,
freelance revenue, rental properties, registered accounts — and generates
prioritized recommendations with explicit confidence scoring and human handoff design.

## The human/AI boundary

This system is deliberately designed around one core principle:
**AI recommends, humans decide.**

- ✅ AI handles: tax optimization, contribution room analysis, scenario simulations
- 🤝 Human required: CRI withdrawals, succession planning, incorporation decisions

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **Backend**: Next.js App Router API Routes
- **AI**: OpenAI GPT-4o
- **Validation**: Zod
- **State**: Zustand
- **Forms**: React Hook Form
- **Charts**: Recharts

## Getting Started

```bash
# Install dependencies
npm install

# Add your OpenAI API key
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Run development server
npm run dev
```

## Architecture

```
src/
├── app/              # Next.js App Router pages & API routes
├── components/
│   ├── ui/           # shadcn primitives
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components
├── lib/
│   ├── openai/       # LLM client + prompts
│   ├── tax-rules/    # Verified fiscal data (2026)
│   └── calculations/ # Pure financial logic
├── store/            # Zustand global state
└── types/            # TypeScript types
```

## Failure Modes & Mitigations

| Risk | Mitigation |
|------|------------|
| LLM tax hallucination | All figures validated against verified JSON tax rules |
| False confidence | Confidence score on every recommendation |
| Incomplete profile | System detects gaps and asks before recommending |
| Outdated rules | Tax data has expiry date, system alerts if stale |
| Irreversible decisions | Hard-flagged in red, mandatory human review |

## Disclaimer

This tool is for informational purposes only and does not constitute financial advice.
Always consult a qualified financial advisor before making financial decisions.
