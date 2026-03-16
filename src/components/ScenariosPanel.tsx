import type { Scenario } from "@/types/api";
import { ArrowUpRight, TrendingUp } from "lucide-react";

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export function ScenarioCard({
  scenario,
  delay = 0,
}: {
  scenario: Scenario;
  delay?: number;
}) {
  return (
    <div
      className="glass-card rounded-lg p-5 animate-fade-in hover:border-primary/30 transition-colors"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-md bg-accent/10 text-accent">
          <TrendingUp className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{scenario.scenario}</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {scenario.assumption}
      </p>

      <div className="space-y-3">
        {scenario.expected_revenue_increase != null && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Revenue Increase</span>
            <span className="text-sm font-semibold text-success flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              {formatCurrency(scenario.expected_revenue_increase)}
            </span>
          </div>
        )}
        {scenario.expected_net_revenue_increase != null && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Net Revenue Increase</span>
            <span className="text-sm font-semibold text-success flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              {formatCurrency(scenario.expected_net_revenue_increase)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <span className="text-sm font-mono text-muted-foreground">
            {(scenario.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function ScenariosGrid({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scenarios.map((scenario, i) => (
        <ScenarioCard key={i} scenario={scenario} delay={i * 100} />
      ))}
    </div>
  );
}
