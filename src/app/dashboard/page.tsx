"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileSummary } from "@/components/features/dashboard/ProfileSummary";
import { RecommendationCard } from "@/components/features/dashboard/RecommendationCard";
import { AdvisorBriefing } from "@/components/features/dashboard/AdvisorBriefing";
import { LoadingRecommendations } from "@/components/features/dashboard/LoadingRecommendations";
import { useProfileStore } from "@/store/profile";
import { useRecommendationsStore } from "@/store/recommendations";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
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
    if (!profile?.firstName) router.push("/onboarding");
  }, [profile, router]);

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
    router.push("/");
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
                Regenerate
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 rounded-full text-gray-400 hover:text-gray-600 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              Start over
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
            {/* Header */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your recommendations</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Fiscal year {report.fiscalYear} ·{" "}
                  {report.recommendations.length} actions identified
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">
                  Total estimated impact
                </p>
                <p
                  className="text-3xl font-bold font-numeric"
                  style={{ color: "var(--ws-green)" }}
                >
                  +${report.totalEstimatedImpact.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--ws-green)" }}
                />
                AI recommendation
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                Advisor required
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {report.recommendations.map((rec, index) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  rank={index + 1}
                />
              ))}
            </div>

            {report.advisorBriefing && (
              <>
                <Separator className="bg-gray-100" />
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Ready for your advisor
                  </h2>
                  <AdvisorBriefing briefing={report.advisorBriefing} />
                </div>
              </>
            )}

            {/* Disclaimer */}
            <div
              className="p-5 rounded-2xl text-center"
              style={{ background: "var(--ws-gray-50)" }}
            >
              <p className="text-xs text-gray-400 leading-relaxed">
                This analysis is for informational purposes only and does not
                constitute financial advice. Tax rules reference: Canada Revenue
                Agency & Revenu Québec {report.fiscalYear}. Always consult a
                qualified financial advisor before making financial decisions.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
