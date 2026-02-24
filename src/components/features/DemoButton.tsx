"use client";

import { useRouter } from "@/i18n/navigation";
import { useProfileStore } from "@/store/profile";
import type { UserProfile } from "@/types";

const DEMO_PROFILE: Partial<UserProfile> = {
  firstName: "Nicolas",
  age: 26,
  province: "QC",
  filingStatus: "SINGLE",
  hasPartner: false,
  partnerIncome: 0,
  income: {
    employment: {
      grossAnnualSalary: 95000,
      employerName: "Inputkit",
      province: "QC",
    },
    freelance: {
      estimatedAnnualRevenue: 20000,
      hasGSTQSTRegistration: true,
      deductibleExpenses: {
        homeOffice: true,
        equipment: 1000,
        software: 500,
        vehicle: 2000,
        phone: 1200,
        other: 400,
      },
    },
    rental: {
      units: 2,
      monthlyRentPerUnit: 1200,
      mortgageInterestAnnual: 14000,
      propertyTaxAnnual: 3500,
      insuranceAnnual: 1800,
      maintenanceAnnual: 2000,
      isOwnerOccupied: false,
    },
  },
  accounts: [
    {
      id: "1",
      type: "CELI",
      currentBalance: 20000,
      contributionRoom: 2000,
      institution: "Desjardins",
    },
    {
      id: "2",
      type: "CRYPTO",
      currentBalance: 20,
      institution: "Wealthsimple",
    },
  ],
  realEstate: [
    {
      id: "1",
      type: "PRIMARY_RESIDENCE",
      estimatedValue: 500000,
      mortgageBalance: 250000,
      mortgageRate: 4.0,
      isOwnerOccupied: true,
    },
    {
      id: "2",
      type: "RENTAL",
      estimatedValue: 475000,
      mortgageBalance: 267000,
      mortgageRate: 4.0,
      isOwnerOccupied: false,
    },
  ],
  lifeEvents: [
    {
      id: "1",
      type: "CHILD",
      label: "2 planned children",
      estimatedYear: 2027,
      estimatedCost: 15000,
      priority: "HIGH",
    },
  ],
  monthlyBudget: {
    fixedExpenses: 2000,
    variableExpenses: 500,
    sportsHobbies: 500,
    travel: 200,
    petCare: 200,
    other: 0,
  },
  numberOfChildren: 0,
  plannedChildren: 2,
};

type Props = {
  label?: string;
};

export function DemoButton({ label = "View live demo →" }: Props) {
  const router = useRouter();
  const { updateProfile, setStep } = useProfileStore();

  const handleDemo = () => {
    updateProfile(DEMO_PROFILE);
    setStep(4); // Mark onboarding as complete
    router.push("/dashboard");
  };

  return (
    <button
      type="button"
      onClick={handleDemo}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all"
    >
      {label}
    </button>
  );
}
