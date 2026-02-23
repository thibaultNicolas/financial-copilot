import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, HelpCircle, FolderOpen, AlertTriangle } from "lucide-react";
import type { AdvisorBriefing as AdvisorBriefingType } from "@/types";

type Props = {
  briefing: AdvisorBriefingType;
};

const URGENCY_COLORS = {
  LOW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function AdvisorBriefing({ briefing }: Props) {
  return (
    <Card className="border-yellow-500/30 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-yellow-400" />
            Advisor Briefing
          </CardTitle>
          <Badge className={URGENCY_COLORS[briefing.urgency]}>
            {briefing.urgency} urgency
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{briefing.summary}</p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Complex issues */}
        {briefing.complexIssues.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Complex Issues
              </p>
            </div>
            {briefing.complexIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 pl-5">
                <div className="w-1 h-1 rounded-full bg-yellow-400 flex-shrink-0 mt-1.5" />
                <p className="text-xs text-muted-foreground">{issue}</p>
              </div>
            ))}
          </div>
        )}

        {/* Questions to ask */}
        {briefing.questionsToAsk.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Questions to Ask Your Advisor
              </p>
            </div>
            {briefing.questionsToAsk.map((q, i) => (
              <div key={i} className="flex items-start gap-2 pl-5">
                <div className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                <p className="text-xs text-muted-foreground">{q}</p>
              </div>
            ))}
          </div>
        )}

        {/* Documents to gather */}
        {briefing.documentsToGather.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Documents to Gather
              </p>
            </div>
            {briefing.documentsToGather.map((doc, i) => (
              <div key={i} className="flex items-start gap-2 pl-5">
                <div className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                <p className="text-xs text-muted-foreground">{doc}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
