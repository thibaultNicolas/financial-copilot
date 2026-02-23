import { render, screen } from "@testing-library/react";
import { RecommendationCard } from "@/components/features/dashboard/RecommendationCard";
import type { Recommendation } from "@/types";

const mockRecommendation: Recommendation = {
  id: "rec-1",
  title: "Maximize RRSP contributions",
  description:
    "Contributing to your RRSP will reduce your taxable income significantly.",
  category: "TAX",
  priority: 1,
  estimatedImpact: 4200,
  confidenceScore: 92,
  confidenceLevel: "HIGH",
  requiresHumanReview: false,
  sources: [{ label: "CRA — RRSP 2026", fiscalYear: 2026 }],
  actionItems: ["Contribute before March 1", "Invest in ETFs"],
};

describe("RecommendationCard", () => {
  it("renders the title", () => {
    render(<RecommendationCard recommendation={mockRecommendation} rank={1} />);
    expect(screen.getByText("Maximize RRSP contributions")).toBeInTheDocument();
  });

  it("renders the estimated impact", () => {
    render(<RecommendationCard recommendation={mockRecommendation} rank={1} />);
    expect(screen.getByText("+$4,200")).toBeInTheDocument();
  });

  it("renders the confidence score", () => {
    render(<RecommendationCard recommendation={mockRecommendation} rank={1} />);
    expect(screen.getByText("92% confidence")).toBeInTheDocument();
  });

  it("renders action items", () => {
    render(<RecommendationCard recommendation={mockRecommendation} rank={1} />);
    expect(screen.getByText("Contribute before March 1")).toBeInTheDocument();
    expect(screen.getByText("Invest in ETFs")).toBeInTheDocument();
  });

  it("does not show advisor badge when review not required", () => {
    render(<RecommendationCard recommendation={mockRecommendation} rank={1} />);
    expect(screen.queryByText("Advisor Required")).not.toBeInTheDocument();
  });

  it("shows advisor badge when human review required", () => {
    const rec = {
      ...mockRecommendation,
      requiresHumanReview: true,
      humanHandoffReason: "This requires a CPA review.",
    };
    render(<RecommendationCard recommendation={rec} rank={1} />);
    expect(screen.getByText("Advisor Required")).toBeInTheDocument();
    expect(screen.getByText("This requires a CPA review.")).toBeInTheDocument();
  });

  it("renders the rank number", () => {
    render(<RecommendationCard recommendation={mockRecommendation} rank={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
