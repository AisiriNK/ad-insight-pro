import { useAppStore } from "@/services/store";
import { useDashboardData } from "@/hooks/useAnalytics";
import { KPIGrid } from "@/components/KPIGrid";
import { DynamicChart } from "@/components/DynamicChart";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { dashboardData, uploadResult } = useAppStore();
  const datasetId = uploadResult?.datasetId || null;

  // If we already have data from analysis, use it; otherwise fetch
  const { data: fetchedData, isLoading, error } = useDashboardData(
    dashboardData ? null : datasetId
  );

  const data = dashboardData || fetchedData;

  if (isLoading) return <div className="container py-8"><LoadingSkeleton /></div>;

  if (error) {
    return (
      <div className="container py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Failed to load dashboard</h2>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">No data available</h2>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file first and run analysis to see your dashboard.
        </p>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="container py-8 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          AI-powered advertising data analysis
        </p>
      </div>

      <KPIGrid kpis={summary.kpis} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summary.charts.map((chart, i) => (
          <DynamicChart key={chart.id} config={chart} />
        ))}
      </div>
    </div>
  );
}
