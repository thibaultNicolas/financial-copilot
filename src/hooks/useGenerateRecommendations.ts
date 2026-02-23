"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";
import { useRecommendationsStore } from "@/store/recommendations";
import { normalizeProfileForApi } from "@/lib/profile";

/**
 * Encapsulates recommendation generation: API call, loading, error, and optional
 * auto-trigger on first load. Reusable from dashboard or any page that needs to
 * generate recommendations.
 */
export function useGenerateRecommendations(options?: {
  /** When true, auto-generate once when profile is ready and no report exists. Default: false. */
  autoGenerate?: boolean;
}) {
  const { profile } = useProfileStore();
  const {
    report,
    isLoading,
    error,
    setReport,
    setLoading,
    setError,
    clearReport,
  } = useRecommendationsStore();
  const autoTriggeredRef = useRef(false);

  const generateRecommendations = async () => {
    const payload = normalizeProfileForApi(profile ?? null);
    if (!payload) {
      toast.error("Profile is incomplete. Please finish onboarding.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: payload }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Failed to generate recommendations");
      }

      const data = await response.json();
      setReport(data);
      toast.success(
        `${data.recommendations.length} recommendations generated!`
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

  useEffect(() => {
    if (
      !options?.autoGenerate ||
      !profile?.firstName ||
      report ||
      isLoading ||
      autoTriggeredRef.current
    ) {
      return;
    }
    autoTriggeredRef.current = true;
    generateRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run once when conditions allow
  }, [profile?.firstName, report, isLoading]);

  return {
    generateRecommendations,
    isLoading,
    error,
    report,
    clearReport,
  };
}
