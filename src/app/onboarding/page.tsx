"use client";

import { StepIndicator } from "@/components/features/onboarding/StepIndicator";
import { Step1Income } from "@/components/features/onboarding/Step1Income";
import { Step2Accounts } from "@/components/features/onboarding/Step2Accounts";
import { Step3RealEstate } from "@/components/features/onboarding/Step3RealEstate";
import { useProfileStore } from "@/store/profile";

export default function OnboardingPage() {
  const { currentStep, nextStep, prevStep } = useProfileStore();

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-6 py-4">
        <span className="text-lg font-bold tracking-tight">
          Financial Copilot
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Build your financial profile</h1>
          <p className="text-muted-foreground text-sm">
            Step {currentStep} of 4 — Takes about 3 minutes
          </p>
        </div>

        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && <Step1Income onNext={nextStep} />}
        {currentStep === 2 && (
          <Step2Accounts onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 3 && (
          <Step3RealEstate onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 4 && (
          <div className="text-center text-muted-foreground py-20">
            Step 4 — Life Events (coming soon)
            <br />
            <button
              onClick={prevStep}
              className="text-emerald-400 mt-4 text-sm underline"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
