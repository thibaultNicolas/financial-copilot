import { formatCurrency } from "@/lib/utils/format";
import type { UserProfile } from "@/types";

type Props = {
  profile: Partial<UserProfile>;
};

export function ProfileSummary({ profile }: Props) {
  const totalIncome =
    (profile.income?.employment?.grossAnnualSalary ?? 0) +
    (profile.income?.freelance?.estimatedAnnualRevenue ?? 0) +
    (profile.income?.rental?.units ?? 0) *
      (profile.income?.rental?.monthlyRentPerUnit ?? 0) *
      12;

  const totalAssets =
    profile.accounts?.reduce((sum, a) => sum + a.currentBalance, 0) ?? 0;

  const totalEquity =
    profile.realEstate?.reduce(
      (sum, r) => sum + (r.estimatedValue - r.mortgageBalance),
      0,
    ) ?? 0;

  const stats = [
    { label: "Annual income", value: totalIncome, icon: "💼" },
    { label: "Registered assets", value: totalAssets, icon: "🏦" },
    { label: "Real estate equity", value: totalEquity, icon: "🏠" },
    {
      label: "Net worth estimate",
      value: totalAssets + totalEquity,
      icon: "📈",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hey {profile.firstName} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            AI-powered financial analysis · {profile.province} · Fiscal year
            2026
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: "var(--ws-green-light)",
            color: "var(--ws-green-dark)",
          }}
        >
          🇨🇦 Canada only
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">{stat.label}</p>
              <span className="text-base">{stat.icon}</span>
            </div>
            <p className="text-xl font-bold font-numeric text-gray-900">
              ${formatCurrency(stat.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
