"use client";

import { useState, useMemo } from "react";
import { calculateTax } from "@/lib/tax-engine";
import { formatCurrency } from "@/lib/utils/format";
import type { UserProfile } from "@/types";
import type { ScenarioInput } from "@/lib/tax-engine";

type Props = {
  profile: Partial<UserProfile>;
};

type SliderConfig = {
  key: keyof ScenarioInput;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

export function TaxSimulator({ profile }: Props) {
  const baseInput = useMemo(
    (): ScenarioInput => ({
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
    }),
    [profile],
  );

  const [overrides, setOverrides] = useState<Partial<ScenarioInput>>({});

  const currentInput: ScenarioInput = { ...baseInput, ...overrides };
  const baseResult = useMemo(() => calculateTax(baseInput), [baseInput]);
  const currentResult = useMemo(
    () => calculateTax(currentInput),
    [currentInput],
  );

  const taxDelta = currentResult.totalTax - baseResult.totalTax;
  const afterTaxDelta =
    currentResult.afterTaxIncome - baseResult.afterTaxIncome;

  const sliders: SliderConfig[] = [
    {
      key: "rrspContribution",
      label: "RRSP Contribution",
      min: 0,
      max: Math.min(baseResult.rrspContributionRoom, 32490),
      step: 500,
      format: (v) => `$${formatCurrency(v)}`,
    },
    {
      key: "freelanceExpenses",
      label: "Freelance Deductions",
      min: 0,
      max: Math.round((currentInput.freelanceIncome ?? 0) * 0.6),
      step: 500,
      format: (v) => `$${formatCurrency(v)}`,
    },
  ];

  const handleSlider = (key: keyof ScenarioInput, value: number) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setOverrides({});

  const hasChanges = Object.keys(overrides).length > 0;

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="p-6 border-b border-gray-100"
        style={{ background: "var(--ws-gray-50)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Tax Simulator</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Adjust sliders to see real-time tax impact
            </p>
          </div>
          {hasChanges && (
            <button
              onClick={reset}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Sliders */}
        <div className="space-y-6">
          {sliders.map((slider) => {
            const value = (currentInput[slider.key] as number) ?? 0;
            const pct = slider.max > 0 ? (value / slider.max) * 100 : 0;

            return (
              <div key={slider.key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {slider.label}
                  </label>
                  <span
                    className="text-sm font-bold font-numeric"
                    style={{ color: "var(--ws-green)" }}
                  >
                    {slider.format(value)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={value}
                    onChange={(e) =>
                      handleSlider(slider.key, Number(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--ws-green) ${pct}%, #E9ECEF ${pct}%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{slider.format(slider.min)}</span>
                  <span>Max: {slider.format(slider.max)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Results comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Before */}
          <div className="p-4 rounded-2xl border border-gray-100">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
              Current
            </p>
            <div className="space-y-2">
              <Row
                label="Taxable income"
                value={`$${formatCurrency(baseResult.totalTaxableIncome)}`}
              />
              <Row
                label="Federal tax"
                value={`$${formatCurrency(baseResult.federalTax)}`}
              />
              <Row
                label="Quebec tax"
                value={`$${formatCurrency(baseResult.quebecTax)}`}
              />
              <Row
                label="QPP + EI"
                value={`$${formatCurrency(baseResult.qppContribution + baseResult.eiPremium)}`}
              />
              <div className="pt-2 border-t border-gray-100">
                <Row
                  label="Total tax"
                  value={`$${formatCurrency(baseResult.totalTax)}`}
                  bold
                />
                <Row
                  label="After-tax income"
                  value={`$${formatCurrency(baseResult.afterTaxIncome)}`}
                  bold
                />
                <Row
                  label="Effective rate"
                  value={`${baseResult.effectiveTaxRate}%`}
                />
              </div>
            </div>
          </div>

          {/* After */}
          <div
            className="p-4 rounded-2xl border"
            style={{
              borderColor: hasChanges ? "var(--ws-green)" : "#F1F3F5",
              background: hasChanges ? "var(--ws-green-light)" : "white",
            }}
          >
            <p
              className="text-xs mb-3 font-medium uppercase tracking-wide"
              style={{ color: hasChanges ? "var(--ws-green-dark)" : "#9CA3AF" }}
            >
              Optimized
            </p>
            <div className="space-y-2">
              <Row
                label="Taxable income"
                value={`$${formatCurrency(currentResult.totalTaxableIncome)}`}
              />
              <Row
                label="Federal tax"
                value={`$${formatCurrency(currentResult.federalTax)}`}
              />
              <Row
                label="Quebec tax"
                value={`$${formatCurrency(currentResult.quebecTax)}`}
              />
              <Row
                label="QPP + EI"
                value={`$${formatCurrency(currentResult.qppContribution + currentResult.eiPremium)}`}
              />
              <div className="pt-2 border-t border-gray-100">
                <Row
                  label="Total tax"
                  value={`$${formatCurrency(currentResult.totalTax)}`}
                  bold
                />
                <Row
                  label="After-tax income"
                  value={`$${formatCurrency(currentResult.afterTaxIncome)}`}
                  bold
                />
                <Row
                  label="Effective rate"
                  value={`${currentResult.effectiveTaxRate}%`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delta summary */}
        {hasChanges && (
          <div
            className="p-4 rounded-2xl text-center animate-fade-up"
            style={{
              background: taxDelta < 0 ? "var(--ws-green-light)" : "#FEF2F2",
            }}
          >
            <p
              className="text-sm font-medium mb-1"
              style={{
                color: taxDelta < 0 ? "var(--ws-green-dark)" : "#DC2626",
              }}
            >
              {taxDelta < 0 ? "🎉 Tax savings" : "⚠️ Tax increase"}
            </p>
            <p
              className="text-3xl font-bold font-numeric"
              style={{ color: taxDelta < 0 ? "var(--ws-green)" : "#DC2626" }}
            >
              {taxDelta < 0 ? "-" : "+"}${formatCurrency(Math.abs(taxDelta))}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              After-tax income {afterTaxDelta >= 0 ? "+" : ""}$
              {formatCurrency(afterTaxDelta)} vs current
            </p>
            <p
              className="text-xs mt-2"
              style={{ color: "var(--ws-green-dark)" }}
            >
              Marginal rate:{" "}
              {Math.round(currentResult.marginalCombinedRate * 100)}% combined (
              {Math.round(
                currentResult.marginalFederalRate * 100 * (1 - 0.165),
              )}
              % federal + {Math.round(currentResult.marginalQuebecRate * 100)}%
              Quebec)
            </p>
          </div>
        )}

        {/* Marginal rate breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Marginal Rate Breakdown
          </p>
          <MarginalBar
            label="Federal (after QC abatement)"
            rate={currentResult.marginalFederalRate * (1 - 0.165)}
            color="var(--ws-green)"
          />
          <MarginalBar
            label="Quebec provincial"
            rate={currentResult.marginalQuebecRate}
            color="#3B82F6"
          />
          <MarginalBar
            label="Combined marginal rate"
            rate={currentResult.marginalCombinedRate}
            color="var(--ws-gray-900)"
            total
          />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function Row({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-xs ${bold ? "font-semibold text-gray-700" : "text-gray-500"}`}
      >
        {label}
      </span>
      <span
        className={`text-xs font-numeric ${bold ? "font-bold text-gray-900" : "text-gray-700"}`}
      >
        {value}
      </span>
    </div>
  );
}

function MarginalBar({
  label,
  rate,
  color,
  total = false,
}: {
  label: string;
  rate: number;
  color: string;
  total?: boolean;
}) {
  const pct = Math.round(rate * 100);
  return (
    <div className={total ? "pt-2 border-t border-gray-100" : ""}>
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-xs ${total ? "font-semibold text-gray-700" : "text-gray-500"}`}
        >
          {label}
        </span>
        <span className="text-xs font-bold font-numeric" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct * 1.66, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}
