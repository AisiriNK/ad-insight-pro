import { useAppStore } from "@/services/store";
import { InsightsGrid } from "@/components/InsightsPanel";
import insightsMock from "@/mock/insights.json";
import type { Insight } from "@/types/api";

export default function InsightsPage() {
  const { dashboardData } = useAppStore();
  const insights = (dashboardData?.insights || insightsMock.insights) as Insight[];

  return (
    <div className="container py-8 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">AI Insights</h1>
        <p className="text-sm text-muted-foreground">
          Machine learning-powered observations from your advertising data
        </p>
      </div>
      <InsightsGrid insights={insights} />
    </div>
  );
}
