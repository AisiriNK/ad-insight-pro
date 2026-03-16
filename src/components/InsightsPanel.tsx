import type { Insight, InsightType } from "@/types/api";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  BarChart2,
  Zap,
  Clock,
} from "lucide-react";

const iconMap: Record<InsightType, React.ReactNode> = {
  revenue_optimization: <TrendingUp className="h-4 w-4" />,
  audience_insight: <Users className="h-4 w-4" />,
  saturation: <AlertTriangle className="h-4 w-4" />,
  market_trend: <BarChart2 className="h-4 w-4" />,
  operational_issue: <Zap className="h-4 w-4" />,
  reporting_issue: <Clock className="h-4 w-4" />,
};

const severityColor: Record<InsightType, string> = {
  revenue_optimization: "text-success bg-success/10",
  audience_insight: "text-primary bg-primary/10",
  saturation: "text-warning bg-warning/10",
  market_trend: "text-info bg-info/10",
  operational_issue: "text-destructive bg-destructive/10",
  reporting_issue: "text-warning bg-warning/10",
};

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export function InsightCard({ insight, delay = 0 }: { insight: Insight; delay?: number }) {
  return (
    <div
      className="glass-card rounded-lg p-5 animate-fade-in hover:border-primary/30 transition-colors"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-md ${severityColor[insight.type]}`}>
          {iconMap[insight.type]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
          <span className="text-xs text-muted-foreground capitalize">
            {insight.type.replace(/_/g, " ")}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {insight.description}
      </p>
      <div>
        <span className="text-xs text-muted-foreground mb-1 block">Confidence</span>
        <ConfidenceBar value={insight.confidence} />
      </div>
    </div>
  );
}

export function InsightsGrid({ insights }: { insights: Insight[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {insights.map((insight, i) => (
        <InsightCard key={i} insight={insight} delay={i * 100} />
      ))}
    </div>
  );
}
