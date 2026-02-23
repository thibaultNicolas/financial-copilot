import type { UserProfile } from "@/types";
import { formatCurrency } from "@/lib/utils/format";

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
    { label: "Annual income", value: totalIncome, prefix: "$" },
    { label: "Registered assets", value: totalAssets, prefix: "$" },
    { label: "Real estate equity", value: totalEquity, prefix: "$" },
    {
      label: "Net worth estimate",
      value: totalAssets + totalEquity,
      prefix: "$",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hey {profile.firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s your AI-powered financial analysis for {profile.province}{" "}
          · Fiscal year 2026
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
            <p className="text-xl font-bold font-numeric">
              {stat.prefix}
              {formatCurrency(stat.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
