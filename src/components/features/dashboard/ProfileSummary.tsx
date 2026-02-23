import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, Wallet, TrendingUp } from "lucide-react";
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
    {
      icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
      label: "Total Annual Income",
      value: `$${totalIncome.toLocaleString()}`,
    },
    {
      icon: <Wallet className="w-4 h-4 text-blue-400" />,
      label: "Registered Assets",
      value: `$${totalAssets.toLocaleString()}`,
    },
    {
      icon: <Building2 className="w-4 h-4 text-purple-400" />,
      label: "Real Estate Equity",
      value: `$${totalEquity.toLocaleString()}`,
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-orange-400" />,
      label: "Net Worth Estimate",
      value: `$${(totalAssets + totalEquity).toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Welcome, {profile.firstName} 👋</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here's your complete financial analysis for fiscal year 2026
          </p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          Quebec · {profile.filingStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                {stat.icon}
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
