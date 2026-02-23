import { render, screen } from "@testing-library/react";
import { StepIndicator } from "@/components/features/onboarding/StepIndicator";

describe("StepIndicator", () => {
  it("renders all 4 steps", () => {
    render(<StepIndicator currentStep={1} />);
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Accounts")).toBeInTheDocument();
    expect(screen.getByText("Real Estate")).toBeInTheDocument();
    expect(screen.getByText("Life Events")).toBeInTheDocument();
  });

  it("shows step number for current step", () => {
    render(<StepIndicator currentStep={2} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders without crashing on step 4", () => {
    render(<StepIndicator currentStep={4} />);
    expect(screen.getByText("Life Events")).toBeInTheDocument();
  });
});
