"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProfileSummary } from "@/components/features/dashboard/ProfileSummary";
import { RecommendationCard } from "@/components/features/dashboard/RecommendationCard";
import { AdvisorBriefing } from "@/components/features/dashboard/AdvisorBriefing";
import { LoadingRecommendations } from "@/components/features/dashboard/LoadingRecommendations";
import { useProfileStore } from "@/store/profile";
import { useRecommendationsStore } from "@/store/recommendations";

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

  // Redirect if no profile
  useEffect(() => {
    if (!profile?.firstName) {
      router.push("/onboarding");
    }
  }, [profile, router]);

  // Auto-generate on first load
  useEffect(() => {
    if (profile?.firstName && !report && !isLoading) {
      generateRecommendations();
    }
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
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">
          Financial Copilot
        </span>
        <div className="flex items-center gap-3">
          {report && (
            <Button
              variant="outline"
              size="sm"
              onClick={generateRecommendations}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              Regenerate
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2 text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </Button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Profile Summary */}
        <ProfileSummary profile={profile} />

        <Separator />

        {/* Loading state */}
        {isLoading && <LoadingRecommendations />}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-16 space-y-4">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              onClick={generateRecommendations}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Recommendations */}
        {report && !isLoading && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Your Recommendations</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Fiscal year {report.fiscalYear} ·{" "}
                  {report.recommendations.length} actions identified
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Total estimated impact
                </p>
                <p className="text-xl font-bold text-emerald-400">
                  +${report.totalEstimatedImpact.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                AI recommendation
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                Requires advisor
              </div>
            </div>

            {/* Recommendation cards */}
            <div className="space-y-4">
              {report.recommendations.map((rec, index) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  rank={index + 1}
                />
              ))}
            </div>

            {/* Advisor Briefing */}
            {report.advisorBriefing && (
              <>
                <Separator />
                <div>
                  <h2 className="text-lg font-bold mb-4">
                    Ready for your advisor
                  </h2>
                  <AdvisorBriefing briefing={report.advisorBriefing} />
                </div>
              </>
            )}

            {/* Footer disclaimer */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground text-center">
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
