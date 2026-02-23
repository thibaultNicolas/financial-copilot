import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, ExternalLink, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types'

type Props = {
  recommendation: Recommendation
  rank: number
}

const CATEGORY_COLORS: Record<Recommendation['category'], string> = {
  TAX:        'bg-red-500/10 text-red-400 border-red-500/20',
  SAVINGS:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  INVESTMENT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  PROTECTION: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  PLANNING:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export function RecommendationCard({ recommendation: rec, rank }: Props) {
  const confidenceColor =
    rec.confidenceScore >= 80 ? 'text-emerald-400' :
    rec.confidenceScore >= 60 ? 'text-yellow-400' :
    'text-red-400'

  return (
    <Card className={cn(
      'border-border bg-card transition-all duration-200 hover:border-emerald-500/30',
      rec.requiresHumanReview && 'border-yellow-500/30'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Rank */}
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {rank}
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold leading-tight">{rec.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={CATEGORY_COLORS[rec.category]}>
                  {rec.category}
                </Badge>

                {rec.requiresHumanReview && (
                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Advisor Required
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Impact + Confidence */}
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-emerald-400">
              +${rec.estimatedImpact.toLocaleString()}
            </p>
            <p className={cn('text-xs font-medium', confidenceColor)}>
              {rec.confidenceScore}% confidence
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {rec.description}
        </p>

        {/* Human handoff reason */}
        {rec.requiresHumanReview && rec.humanHandoffReason && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-400">{rec.humanHandoffReason}</p>
          </div>
        )}

        {/* Action items */}
        {rec.actionItems.length > 0 && (
          <div className="space-y-1.5">
            {rec.actionItems.map((action, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">{action}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sources */}
        {rec.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {rec.sources.map((source, i) => (
              
                key={i}
                href={source.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-400 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {source.label} ({source.fiscalYear})
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}