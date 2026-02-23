import Link from "next/link";
import { Shield, Flag, GitMerge } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-6 h-6" style={{ color: "var(--ws-green)" }} />,
    title: "Clear human/AI boundary",
    description:
      "The system knows exactly what it can recommend confidently, and when to hand off to a human advisor. Every recommendation shows its confidence score.",
  },
  {
    icon: <Flag className="w-6 h-6" style={{ color: "var(--ws-green)" }} />,
    title: "Canadian tax rules 2026",
    description:
      "RRSP, TFSA, FHSA, CRI, Quebec provincial brackets — all verified against CRA and Revenu Québec. No hallucinated figures.",
  },
  {
    icon: <GitMerge className="w-6 h-6" style={{ color: "var(--ws-green)" }} />,
    title: "Multi-income optimization",
    description:
      "Employment salary, freelance contracts, rental income — the system optimizes across all sources simultaneously, something no spreadsheet can do.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--ws-green)" }}
            >
              <span className="text-white text-xs font-bold">FC</span>
            </div>
            <span className="text-base font-semibold tracking-tight">
              Financial Copilot
            </span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">
            Wealthsimple AI Builders Submission
          </span>
          <Link
            href="/onboarding"
            className="cursor-pointer text-sm font-semibold px-5 py-2 rounded-full text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "var(--ws-green)" }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-up"
          style={{
            background: "var(--ws-green-light)",
            color: "var(--ws-green-dark)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse-green inline-block"
            style={{ background: "var(--ws-green)" }}
          />
          AI recommends · Humans decide
        </div>

        <h1
          className="text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up delay-100"
          style={{ color: "var(--ws-gray-900)" }}
        >
          Your money,
          <br />
          <span style={{ color: "var(--ws-green)" }}>finally optimized.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
          Financial Copilot analyzes your complete Canadian financial picture —
          employment, freelance, rental income, all your accounts — and tells
          you exactly what to do next, in order of impact.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
          <Link
            href="/onboarding"
            className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 hover:shadow-xl hover:scale-105 transition-all"
            style={{ background: "var(--ws-green)" }}
          >
            Analyze my finances
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{ background: "var(--ws-gray-50)" }}
        className="border-y border-gray-100 py-12 animate-fade-up delay-400"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            {
              value: "3 income",
              label: "sources analyzed simultaneously",
              mono: false,
            },
            {
              value: "$14,800+",
              label: "average annual tax savings identified",
              mono: true,
            },
            {
              value: "100%",
              label: "Canadian tax rules, verified 2026",
              mono: false,
            },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                className={`text-3xl font-bold mb-1 ${stat.mono ? "font-numeric" : ""}`}
                style={{ color: "var(--ws-green)" }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for real complexity</h2>
          <p className="text-gray-500 text-lg">
            Not just a calculator. A system that thinks about your whole
            picture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group"
              style={{ background: "white" }}
            >
              <div
                className="p-3 rounded-2xl inline-flex mb-4"
                style={{ background: "var(--ws-green-light)" }}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--ws-green)] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ background: "var(--ws-gray-900)" }}
        className="py-20 text-center"
      >
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to see your financial picture?
          </h2>
          <p className="text-gray-400 mb-8">
            Takes 3 minutes. No account required.
          </p>
          <Link
            href="/onboarding"
            className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base hover:opacity-90 hover:scale-105 transition-all"
            style={{ background: "var(--ws-green)", color: "white" }}
          >
            Get started — it&apos;s free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center">
        <p className="text-xs text-gray-400">
          For informational purposes only. Not financial advice. Always consult
          a qualified financial advisor before making financial decisions.
        </p>
      </footer>
    </main>
  );
}
