import { create } from "zustand";
import type { RecommendationReport } from "@/types";

// ============================================
// TYPES
// ============================================

type RecommendationsStore = {
  report: RecommendationReport | null;
  isLoading: boolean;
  error: string | null;
  lastGeneratedAt: string | null;

  // Actions
  setReport: (report: RecommendationReport) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearReport: () => void;
};

// ============================================
// STORE
// ============================================

export const useRecommendationsStore = create<RecommendationsStore>()(
  (set) => ({
    report: null,
    isLoading: false,
    error: null,
    lastGeneratedAt: null,

    setReport: (report) =>
      set({
        report,
        lastGeneratedAt: new Date().toISOString(),
        error: null,
      }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error, isLoading: false }),

    clearReport: () =>
      set({ report: null, lastGeneratedAt: null, error: null }),
  }),
);
