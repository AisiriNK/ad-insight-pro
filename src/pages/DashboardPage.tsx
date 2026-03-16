import { useAppStore } from "@/services/store";
import { KPIGrid } from "@/components/KPIGrid";
import { DynamicChart } from "@/components/DynamicChart";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import summaryMock from "@/mock/summary.json";
import insightsMock from "@/mock/insights.json";
import scenariosMock from "@/mock/scenarios.json";
import type { DashboardData } from "@/types/api";
import { useEffect } from "react";

const mockData: DashboardData = {
  summary: summaryMock.summary,
  insights: insightsMock.insights,
  scenarios: scenariosMock.scenarios,
} as DashboardData;

export default function DashboardPage() {
  const { dashboardData, setDashboardData } = useAppStore();

  useEffect(() => {
    if (!dashboardData) {
      setDashboardData(mockData);
    }
  }, [dashboardData, setDashboardData]);

  const data = dashboardData || mockData;

  return (
    <div className="container py-8 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          AI-powered advertising data analysis
        </p>
      </div>

      <KPIGrid kpis={data.summary.kpis} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.summary.charts.map((chart) => (
          <DynamicChart key={chart.id} config={chart} />
        ))}
      </div>
    </div>
  );
}
