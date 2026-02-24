"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileSummary } from "@/components/features/dashboard/ProfileSummary";
import { RecommendationCard } from "@/components/features/dashboard/RecommendationCard";
import { AdvisorBriefing } from "@/components/features/dashboard/AdvisorBriefing";
import { TaxSimulator } from "@/components/features/dashboard/TaxSimulator";
import { TaxChat } from "@/components/features/dashboard/TaxChat";
import { LoadingRecommendations } from "@/components/features/dashboard/LoadingRecommendations";
import { LanguageToggle } from "@/components/features/LanguageToggle";
import { useProfileStore } from "@/store/profile";
import { useRecommendationsStore } from "@/store/recommendations";
import { formatCurrency } from "@/lib/utils/format";
import { Link } from "@/i18n/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard");
  const { profile, resetProfile } = useProfileStore();
  const {
    report,
    isLoading,
    error,
    setReport,
    setLoading,
    setError,
    clearReport,
  } = useRecommendationsStore();

  useEffect(() => {
    if (!profile?.firstName) router.push(`/${locale}/onboarding`);
  }, [profile, router, locale]);

  useEffect(() => {
    if (profile?.firstName && !report && !isLoading) generateRecommendations();
  }, [profile]);

  const generateRecommendations = async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Failed to generate recommendations");
      }
      const data = await response.json();
      setReport(data);
      toast.success(
        `${data.recommendations.length} recommendations generated!`,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetProfile();
    clearReport();
    router.push(`/${locale}`);
  };

  if (!profile?.firstName) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--ws-green)" }}
            >
              <span className="text-white text-xs font-bold">FC</span>
            </div>
            <span className="text-base font-semibold tracking-tight">
              Financial Copilot
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            {report && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateRecommendations}
                disabled={isLoading}
                className="gap-2 rounded-full border-gray-200 text-gray-600 hover:border-gray-300 text-xs"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
                />
                {t("actions.regenerate")}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 rounded-full text-gray-400 hover:text-gray-600 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              {t("actions.startOver")}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <ProfileSummary profile={profile} />
        <Separator className="bg-gray-100" />

        {isLoading && <LoadingRecommendations />}

        {error && !isLoading && (
          <div className="text-center py-16 space-y-4">
            <p className="text-red-500 text-sm">{error}</p>
            <Button
              onClick={generateRecommendations}
              className="rounded-full px-6"
              style={{ background: "var(--ws-green)", color: "white" }}
            >
              Try Again
            </Button>
          </div>
        )}

        {report && !isLoading && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {t("recommendations.title")}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {t("recommendations.subtitle", {
                    year: report.fiscalYear,
                    count: report.recommendations.length,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">
                  {t("recommendations.impact")}
                </p>
                <p
                  className="text-3xl font-bold font-numeric"
                  style={{ color: "var(--ws-green)" }}
                >
                  +${formatCurrency(report.totalEstimatedImpact)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--ws-green)" }}
                />
                {t("recommendations.aiLabel")}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                {t("recommendations.advisorLabel")}
              </div>
            </div>

            <div className="space-y-4">
              {report.recommendations.map((rec, index) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  rank={index + 1}
                />
              ))}
            </div>

            <Separator className="bg-gray-100" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Tax Simulator</h2>
              <p className="text-gray-500 text-sm mb-6">
                Real calculations using CRA & Revenu Québec 2026 rules — not AI
                estimates.
              </p>
              <TaxSimulator profile={profile} />
            </div>

            <Separator className="bg-gray-100" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Ask your financial AI</h2>
              <p className="text-gray-500 text-sm mb-6">
                Ask any question about your situation — answers use your real
                calculated numbers.
              </p>
              <TaxChat
                profile={profile}
                recommendations={report.recommendations}
              />
            </div>

            {report.advisorBriefing && (
              <>
                <Separator className="bg-gray-100" />
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {t("advisor.title")}
                  </h2>
                  <AdvisorBriefing briefing={report.advisorBriefing} />
                </div>
              </>
            )}

            <div
              className="p-5 rounded-2xl text-center"
              style={{ background: "var(--ws-gray-50)" }}
            >
              <p className="text-xs text-gray-400 leading-relaxed">
                {t("disclaimer", { year: report.fiscalYear })}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
