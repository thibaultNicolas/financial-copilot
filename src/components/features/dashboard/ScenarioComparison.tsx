"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { calculateAllScenarios } from "@/lib/tax-engine/scenarios";
import type { ScenarioComparison as ScenarioComparisonType } from "@/lib/tax-engine/scenarios";
import { formatCurrency } from "@/lib/utils/format";
import type { UserProfile } from "@/types";
import { Sparkles } from "lucide-react";

type Props = {
  profile: Partial<UserProfile>;
};

const SCENARIO_YEARS = [2026, 2027, 2028] as const;

function ScenarioColumn({
  scenario,
  isRecommended,
  deltaVsA,
  formatCurrency: fmt,
}: {
  scenario: ScenarioComparisonType;
  isRecommended: boolean;
  deltaVsA: number | null;
  formatCurrency: (n: number) => string;
}) {
  const { config, years, totals } = scenario;
  return (
    <div
      className="rounded-xl border-2 p-4 min-h-[320px] flex flex-col"
      style={{
        borderColor: isRecommended ? "var(--ws-green)" : "var(--ws-gray-200)",
        background: isRecommended ? "var(--ws-green-light)" : "white",
      }}
    >
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <h3 className="font-bold text-base" style={{ color: "var(--ws-gray-900)" }}>
          {config.name}
        </h3>
        {isRecommended && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "var(--ws-green)",
              color: "white",
            }}
          >
            Recommended
          </span>
        )}
      </div>
      <p className="text-xs mb-4" style={{ color: "var(--ws-gray-600)" }}>
        {config.description}
      </p>
      {deltaVsA !== null && deltaVsA > 0 && (
        <p
          className="text-xs font-semibold mb-2"
          style={{ color: "var(--ws-green-dark)" }}
        >
          Save {fmt(deltaVsA)} over 3 years
        </p>
      )}
      <div className="space-y-2 flex-1">
        {SCENARIO_YEARS.map((y) => {
          const yearData = years.find((yr) => yr.year === y)?.breakdown;
          if (!yearData) return null;
          return (
            <div
              key={y}
              className="text-xs rounded-lg py-2 px-3"
              style={{ background: "var(--ws-gray-50)" }}
            >
              <div className="font-semibold mb-1" style={{ color: "var(--ws-gray-900)" }}>
                {y}
              </div>
              <div className="font-numeric space-y-0.5" style={{ color: "var(--ws-gray-600)" }}>
                <div>Taxable: {fmt(yearData.totalTaxableIncome)}</div>
                <div>Tax: {fmt(yearData.totalTax)}</div>
                <div>After-tax: {fmt(yearData.afterTaxIncome)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="mt-3 pt-3 border-t font-numeric text-sm font-semibold"
        style={{ borderColor: "var(--ws-gray-200)", color: "var(--ws-gray-900)" }}
      >
        <div>3-yr total tax: {fmt(totals.totalTax)}</div>
        <div>3-yr after-tax: {fmt(totals.afterTaxIncome)}</div>
      </div>
    </div>
  );
}

function ScenarioTab({
  scenario,
  isActive,
  onClick,
}: {
  scenario: ScenarioComparisonType;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 py-3 px-4 rounded-t-xl text-sm font-semibold transition-colors"
      style={{
        background: isActive ? "white" : "var(--ws-gray-100)",
        color: isActive ? "var(--ws-green-dark)" : "var(--ws-gray-600)",
        border: "1px solid var(--ws-gray-200)",
        borderBottom: isActive ? "none" : "1px solid var(--ws-gray-200)",
      }}
    >
      {scenario.config.name}
    </button>
  );
}

export function ScenarioComparison({ profile }: Props) {
  const scenarios = useMemo(
    () => calculateAllScenarios(profile),
    [profile],
  );

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState(false);

  const taxA = scenarios[0]?.totals.totalTax ?? 0;
  const taxB = scenarios[1]?.totals.totalTax ?? 0;
  const taxC = scenarios[2]?.totals.totalTax ?? 0;
  const bestIndex = useMemo(() => {
    let idx = 0;
    let min = taxA;
    if (taxB < min) {
      idx = 1;
      min = taxB;
    }
    if (taxC < min) idx = 2;
    return idx;
  }, [taxA, taxB, taxC]);

  const deltas = useMemo(
    () => [
      null as number | null,
      Math.max(0, taxA - taxB),
      Math.max(0, taxA - taxC),
    ],
    [taxA, taxB, taxC],
  );

  const displayInsight =
    scenarios.length === 0 || bestIndex === 0 ? null : insight;

  const hasLoadedInsight = useRef(false);

  useEffect(() => {
    if (scenarios.length === 0 || bestIndex === 0) return;
    if (hasLoadedInsight.current) return;
    hasLoadedInsight.current = true;
    const savingsVsA = taxA - (scenarios[bestIndex]?.totals.totalTax ?? 0);
    queueMicrotask(() => {
      setInsightLoading(true);
      setInsightError(false);
    });
    fetch("/api/scenario-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile,
        scenarioSummary: {
          scenarioAName: scenarios[0].config.name,
          scenarioBName: scenarios[1].config.name,
          scenarioCName: scenarios[2].config.name,
          bestScenarioName: scenarios[bestIndex].config.name,
          bestScenarioDescription: scenarios[bestIndex].config.description,
          totalTaxA: taxA,
          totalTaxB: taxB,
          totalTaxC: taxC,
          savingsVsA,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setInsight(data.insight ?? null);
      })
      .catch(() => setInsightError(true))
      .finally(() => setInsightLoading(false));
  }, [profile, scenarios, bestIndex, taxA, taxB, taxC]);

  if (scenarios.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 p-6 text-center" style={{ background: "var(--ws-gray-50)" }}>
        <p style={{ color: "var(--ws-gray-600)" }}>Add income and profile details to compare scenarios.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--ws-gray-200)", background: "white" }}>
      {/* Desktop: 3 columns */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 p-4">
        {scenarios.map((scenario, i) => (
          <ScenarioColumn
            key={scenario.config.name}
            scenario={scenario}
            isRecommended={i === bestIndex}
            deltaVsA={deltas[i]}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      {/* Mobile: tabs + single column */}
      <div className="md:hidden">
        <div className="flex border-b" style={{ borderColor: "var(--ws-gray-200)" }}>
          {scenarios.map((s, i) => (
            <ScenarioTab
              key={s.config.name}
              scenario={s}
              isActive={activeTabIndex === i}
              onClick={() => setActiveTabIndex(i)}
            />
          ))}
        </div>
        <div className="p-4">
          <ScenarioColumn
            scenario={scenarios[activeTabIndex]}
            isRecommended={activeTabIndex === bestIndex}
            deltaVsA={deltas[activeTabIndex]}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* AI insight */}
      <div
        className="border-t p-4 flex items-start gap-3"
        style={{ borderColor: "var(--ws-gray-200)", background: "var(--ws-gray-50)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--ws-green)" }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          {insightLoading && (
            <p className="text-sm" style={{ color: "var(--ws-gray-600)" }}>
              Generating insight…
            </p>
          )}
          {insightError && (
            <p className="text-sm" style={{ color: "var(--ws-gray-600)" }}>
              Could not load AI insight. The numbers above are still accurate.
            </p>
          )}
          {!insightLoading && !insightError && displayInsight && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--ws-gray-900)" }}>
              {displayInsight}
            </p>
          )}
          {!insightLoading && !insightError && !displayInsight && bestIndex === 0 && (
            <p className="text-sm" style={{ color: "var(--ws-gray-600)" }}>
              Scenario A (status quo) has the lowest tax in your situation; no change needed for these assumptions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
