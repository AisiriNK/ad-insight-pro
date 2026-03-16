import { useAppStore } from "@/services/store";
import { InsightsGrid } from "@/components/InsightsPanel";
import { Brain } from "lucide-react";

export default function InsightsPage() {
  const { dashboardData } = useAppStore();

  if (!dashboardData) {
    return (
      <div className="container py-16 text-center">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">No insights yet</h2>
        <p className="text-sm text-muted-foreground">
          Upload data and run analysis to generate AI insights.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">AI Insights</h1>
        <p className="text-sm text-muted-foreground">
          Machine learning-powered observations from your advertising data
        </p>
      </div>
      <InsightsGrid insights={dashboardData.insights} />
    </div>
  );
}
