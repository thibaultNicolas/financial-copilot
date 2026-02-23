import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";

// ============================================
// TYPES
// ============================================

type ProfileStore = {
  profile: Partial<UserProfile> | null;
  isComplete: boolean;
  currentStep: number;
  totalSteps: number;

  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetProfile: () => void;
  checkCompletion: () => boolean;
};

// ============================================
// REQUIRED FIELDS TO CONSIDER PROFILE COMPLETE
// ============================================

const REQUIRED_FIELDS: (keyof UserProfile)[] = [
  "firstName",
  "age",
  "province",
  "income",
  "accounts",
];

// ============================================
// STORE
// ============================================

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isComplete: false,
      currentStep: 1,
      totalSteps: 4,

      setProfile: (profile) =>
        set({ profile, isComplete: get().checkCompletion() }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
          isComplete: get().checkCompletion(),
        })),

      setStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      resetProfile: () =>
        set({ profile: null, isComplete: false, currentStep: 1 }),

      checkCompletion: () => {
        const { profile } = get();
        if (!profile) return false;
        return REQUIRED_FIELDS.every(
          (field) => profile[field] !== undefined && profile[field] !== null,
        );
      },
    }),
    {
      name: "financial-copilot-profile", // localStorage key
      partialize: (state) => ({
        // only persist profile data, not UI state
        profile: state.profile,
        isComplete: state.isComplete,
      }),
    },
  ),
);
