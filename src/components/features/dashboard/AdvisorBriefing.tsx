import { FileText, HelpCircle, FolderOpen, AlertTriangle } from "lucide-react";
import type { AdvisorBriefing as AdvisorBriefingType } from "@/types";

type Props = {
  briefing: AdvisorBriefingType;
};

const URGENCY = {
  LOW: { label: "Low urgency", bg: "#EFF6FF", text: "#3B82F6" },
  MEDIUM: { label: "Medium urgency", bg: "#FFF7ED", text: "#F97316" },
  HIGH: { label: "High urgency", bg: "#FEF2F2", text: "#EF4444" },
};

export function AdvisorBriefing({ briefing }: Props) {
  const urgency = URGENCY[briefing.urgency];

  return (
    <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span className="font-semibold">Advisor Briefing</span>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: urgency.bg, color: urgency.text }}
        >
          {urgency.label}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-6">{briefing.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Complex issues */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Complex Issues
            </span>
          </div>
          <ul className="space-y-2">
            {briefing.complexIssues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                <p className="text-xs text-gray-600">{issue}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Questions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Questions to Ask
            </span>
          </div>
          <ul className="space-y-2">
            {briefing.questionsToAsk.map((q, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                <p className="text-xs text-gray-600">{q}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: "var(--ws-green)" }}
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Documents to Gather
            </span>
          </div>
          <ul className="space-y-2">
            {briefing.documentsToGather.map((doc, i) => (
              <li key={i} className="flex items-start gap-2">
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: "var(--ws-green)" }}
                />
                <p className="text-xs text-gray-600">{doc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
