"use client";

import { StepIndicator } from "@/components/features/onboarding/StepIndicator";
import { Step1Income } from "@/components/features/onboarding/Step1Income";
import { Step2Accounts } from "@/components/features/onboarding/Step2Accounts";
import { Step3RealEstate } from "@/components/features/onboarding/Step3RealEstate";
import { Step4LifeEvents } from "@/components/features/onboarding/Step4LifeEvents";
import { useProfileStore } from "@/store/profile";
import Link from "next/link";

export default function OnboardingPage() {
  const { currentStep, nextStep, prevStep } = useProfileStore();

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
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
          <span className="text-sm text-gray-400">Step {currentStep} of 4</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight">
            {currentStep === 1 && "Tell us about your income"}
            {currentStep === 2 && "Your accounts & investments"}
            {currentStep === 3 && "Your real estate"}
            {currentStep === 4 && "Life events & budget"}
          </h1>
          <p className="text-gray-500">
            {currentStep === 1 &&
              "Employment, freelance, and rental income sources"}
            {currentStep === 2 && "All registered and non-registered accounts"}
            {currentStep === 3 && "Primary residence and investment properties"}
            {currentStep === 4 &&
              "Upcoming major expenses and monthly spending"}
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="animate-fade-up">
          {currentStep === 1 && <Step1Income onNext={nextStep} />}
          {currentStep === 2 && (
            <Step2Accounts onNext={nextStep} onBack={prevStep} />
          )}
          {currentStep === 3 && (
            <Step3RealEstate onNext={nextStep} onBack={prevStep} />
          )}
          {currentStep === 4 && <Step4LifeEvents onBack={prevStep} />}
        </div>
      </div>
    </main>
  );
}
