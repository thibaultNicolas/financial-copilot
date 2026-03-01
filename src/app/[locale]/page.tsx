import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/features/LanguageToggle";
import { DemoButton } from "@/components/features/DemoButton";
import { Check } from "lucide-react";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-white">
      {/* Nav: left logo + wordmark, center tagline (desktop), right toggle + CTA */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "var(--ws-green)" }}
            >
              <span className="text-white text-sm font-bold">FC</span>
            </div>
            <span className="text-base font-semibold tracking-tight text-gray-900">
              Financial Copilot
            </span>
          </div>
          <span className="hidden sm:block text-xs text-gray-500 truncate">
            {t("home.badge")}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <LanguageToggle />
            <Link
              href="/onboarding"
              className="cursor-pointer text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90"
              style={{ background: "var(--ws-green)" }}
            >
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero: asymmetric 60/40 */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-16 md:pt-20 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left 60% */}
          <div className="text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 animate-fade-up"
              style={{
                background: "var(--ws-green-light)",
                color: "var(--ws-green-dark)",
              }}
            >
              {t("home.badge")}
            </div>
            <h1
              className={`${instrumentSerif.className} ${instrumentSerif.variable} text-8xl md:text-9xl font-normal tracking-tight text-left leading-[0.9] mb-6 animate-fade-up delay-100`}
              style={{ color: "var(--ws-gray-900)" }}
            >
              {t("home.title1")}
              <br />
              <span className="italic">
                {t("home.title2Prefix")}
                <span
                  style={{
                    borderBottom: "3px solid var(--ws-green)",
                    paddingBottom: "2px",
                  }}
                >
                  {t("home.title2Highlight")}
                </span>
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl text-left mb-8 leading-relaxed animate-fade-up delay-200">
              {t("home.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link
                href="/onboarding"
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition-all"
                style={{ background: "var(--ws-green)" }}
              >
                {t("home.cta")} →
              </Link>
              <DemoButton label={t("home.demo")} />
            </div>
            <p className="text-sm text-gray-400 mt-6 animate-fade-up delay-400">
              {t("home.socialProof")}
            </p>
          </div>

          {/* Right 40%: CSS dashboard mockup — hidden on mobile */}
          <div className="hidden md:flex relative justify-center lg:justify-end animate-fade-up delay-200">
            <div
              className="w-full max-w-sm rounded-2xl bg-white border border-gray-200 overflow-hidden animate-float"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.12)" }}
            >
              {/* Header bar: traffic lights + title */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Financial Copilot
                </span>
              </div>
              <div className="p-4 space-y-3">
                {/* Card 1: green */}
                <div
                  className="rounded-xl p-4 border-l-4 flex gap-3"
                  style={{
                    background: "var(--ws-green-light)",
                    borderLeftColor: "var(--ws-green)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "var(--ws-green)" }}
                  >
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 text-sm">
                      Maximize RRSP Contributions
                    </div>
                    <div
                      className="text-lg font-bold mt-0.5"
                      style={{ color: "var(--ws-green)" }}
                    >
                      +$5,000
                    </div>
                    <div
                      className="text-xs mt-1"
                      style={{ color: "var(--ws-green-dark)" }}
                    >
                      85% confidence
                    </div>
                    <span
                      className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{
                        background: "var(--ws-green)",
                        color: "white",
                      }}
                    >
                      TAX
                    </span>
                  </div>
                </div>
                {/* Card 2: blue */}
                <div className="rounded-xl p-4 border-l-4 border-blue-400 bg-blue-50 flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-blue-500 shrink-0">
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 text-sm">
                      Open TFSA Account
                    </div>
                    <div className="text-lg font-bold text-blue-600 mt-0.5">
                      +$3,000
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      90% confidence
                    </div>
                    <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500 text-white">
                      SAVINGS
                    </span>
                  </div>
                </div>
                {/* Card 3: amber */}
                <div className="rounded-xl p-4 border-l-4 border-amber-400 bg-amber-50 flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-amber-500 shrink-0">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 text-sm">
                      Review Mortgage Options
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <svg
                        className="w-3.5 h-3.5 text-amber-600 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span className="text-xs font-medium text-amber-700">
                        Advisor Required
                      </span>
                    </div>
                    <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500 text-white">
                      ADVISOR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats: dark, 4 in a row */}
      <section
        className="py-16 animate-fade-up delay-400"
        style={{ background: "#0D1117" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center md:text-left pt-4 border-t-2 border-[var(--ws-green)]">
              <div
                className="text-6xl font-bold font-numeric tracking-tight mb-1"
                style={{ color: "var(--ws-green)" }}
              >
                {t("home.stats.savings")}
              </div>
              <div className="text-sm text-gray-400">{t("home.stats.savingsSub")}</div>
            </div>
            <div className="text-center md:text-left pt-4 border-t-2 border-[var(--ws-green)]">
              <div
                className="text-6xl font-bold font-numeric tracking-tight mb-1"
                style={{ color: "var(--ws-green)" }}
              >
                {t("home.stats.income")}
              </div>
              <div className="text-sm text-gray-400">{t("home.stats.incomeSub")}</div>
            </div>
            <div className="text-center md:text-left pt-4 border-t-2 border-[var(--ws-green)]">
              <div
                className="text-6xl font-bold font-numeric tracking-tight mb-1"
                style={{ color: "var(--ws-green)" }}
              >
                {t("home.stats.rules")}
              </div>
              <div className="text-sm text-gray-400">{t("home.stats.rulesSub")}</div>
            </div>
            <div className="text-center md:text-left pt-4 border-t-2 border-[var(--ws-green)]">
              <div
                className="text-6xl font-bold font-numeric tracking-tight mb-1"
                style={{ color: "var(--ws-green)" }}
              >
                {t("home.stats.minComplete")}
              </div>
              <div className="text-sm text-gray-400">{t("home.stats.minCompleteSub")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-left mb-12 text-gray-900">
          {t("howItWorks.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative px-0 md:px-4 mb-12">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gray-200" />
          <div className="relative md:px-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4"
              style={{ background: "var(--ws-green)" }}
            >
              1
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("howItWorks.step1.title")}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("howItWorks.step1.desc")}
            </p>
          </div>
          <div className="relative md:px-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4"
              style={{ background: "var(--ws-green)" }}
            >
              2
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("howItWorks.step2.title")}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("howItWorks.step2.desc")}
            </p>
          </div>
          <div className="relative md:px-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4"
              style={{ background: "var(--ws-green)" }}
            >
              3
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("howItWorks.step3.title")}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("howItWorks.step3.desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Features: alternating */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-100">
        {/* Feature 1: text left, tax bars right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t("home.features.tax.title")}
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {t("home.features.tax.description")}
            </p>
          </div>
          <div className="order-first lg:order-0">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 max-w-md">
              <div className="text-xs font-medium text-gray-500 mb-4">
                Tax breakdown
              </div>
              <div className="space-y-4">
                {[
                  { label: "Federal", pct: 42, color: "var(--ws-green)" },
                  { label: "Quebec", pct: 28, color: "#3b82f6" },
                  { label: "QPP", pct: 4, color: "#8b5cf6" },
                  { label: "EI", pct: 2, color: "#6366f1" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{row.label}</span>
                      <span className="font-medium">{row.pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${row.pct}%`,
                          background: row.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: table left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 border-t border-gray-100">
          <div className="order-first lg:order-0">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 max-w-md overflow-hidden">
              <div className="text-xs font-medium text-gray-500 mb-4">
                3-year comparison
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="font-medium text-gray-500 py-2">Scenario</div>
                <div className="font-medium text-gray-500 py-2 text-center">A</div>
                <div className="font-medium text-gray-500 py-2 text-center">B</div>
                <div className="font-medium text-gray-500 py-2 text-center">
                  C
                  <span
                    className="block mt-0.5 text-[10px] font-semibold"
                    style={{ color: "var(--ws-green)" }}
                  >
                    Recommended
                  </span>
                </div>
                <div className="py-3 text-gray-600 border-t border-gray-100">
                  Salaried
                </div>
                <div className="py-3 border-t border-gray-100 font-numeric text-center">
                  $42k
                </div>
                <div className="py-3 border-t border-gray-100 font-numeric text-center">
                  $44k
                </div>
                <div className="py-3 border-t border-gray-100 font-numeric text-center text-green-600">
                  $39k
                </div>
                <div className="py-3 text-gray-600 border-t border-gray-100">
                  Incorporated
                </div>
                <div className="py-3 border-t border-gray-100 font-numeric text-center">
                  $38k
                </div>
                <div className="py-3 border-t border-gray-100 font-numeric text-center">
                  $41k
                </div>
                <div className="py-3 border-t border-gray-100 font-numeric text-center text-green-600">
                  $36k
                </div>
                <div className="py-3 text-gray-600 border-t border-gray-100 col-span-4 text-xs text-gray-400">
                  Year 1 / Year 3 tax liability
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t("home.features.multi.title")}
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {t("home.features.multi.description")}
            </p>
          </div>
        </div>

        {/* Feature 3: text left, chat right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 border-t border-gray-100">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t("home.features.boundary.title")}
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {t("home.features.boundary.description")}
            </p>
          </div>
          <div className="order-first lg:order-0">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 max-w-md shadow-sm relative">
              <span
                className="absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500"
              >
                GPT-4o
              </span>
              <div className="space-y-4 pr-14">
                <div className="flex justify-end">
                  <div
                    className="rounded-2xl rounded-tr-md px-4 py-3 text-sm max-w-[88%]"
                    style={{ background: "var(--ws-green-light)" }}
                  >
                    Should I max my RRSP or TFSA first given my $95k salary and
                    $20k freelance?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-md px-4 py-3 text-sm bg-gray-100 text-gray-700 max-w-[92%] leading-relaxed">
                    Based on your $95k + $20k freelance, RRSP saves ~$2,400 more
                    in 2026 in Quebec.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 px-6"
        style={{ background: "#0A0A0A" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-left mb-4">
              {t("home.ctaSection.title")}
            </h2>
            <p className="text-gray-400 text-lg mb-8">{t("home.ctaSection.subtitle")}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/onboarding"
                className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base hover:opacity-90 transition-all text-white"
                style={{ background: "var(--ws-green)" }}
              >
                {t("home.ctaSection.cta")}
              </Link>
              <DemoButton label={t("home.demo")} />
            </div>
          </div>
          <div className="flex flex-col gap-4 text-right lg:min-w-[240px]">
            <span className="text-sm text-gray-400 inline-flex items-center justify-end gap-2">
              <Check className="w-4 h-4 shrink-0" style={{ color: "var(--ws-green)" }} />
              {t("home.ctaSection.badge1")}
            </span>
            <span className="text-sm text-gray-400 inline-flex items-center justify-end gap-2">
              <Check className="w-4 h-4 shrink-0" style={{ color: "var(--ws-green)" }} />
              {t("home.ctaSection.badge2")}
            </span>
            <span className="text-sm text-gray-400 inline-flex items-center justify-end gap-2">
              <Check className="w-4 h-4 shrink-0" style={{ color: "var(--ws-green)" }} />
              {t("home.ctaSection.badge3")}
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-6 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-800"
        style={{ background: "#111827" }}
      >
        <span className="text-sm text-gray-400">
          Financial Copilot · AI-powered tax planning
        </span>
        <p className="text-xs text-gray-500">
          {t("home.footerDisclaimer")}
        </p>
      </footer>
    </main>
  );
}
