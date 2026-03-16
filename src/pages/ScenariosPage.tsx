import { useAppStore } from "@/services/store";
import { ScenariosGrid } from "@/components/ScenariosPanel";
import { FlaskConical } from "lucide-react";

export default function ScenariosPage() {
  const { dashboardData } = useAppStore();

  if (!dashboardData) {
    return (
      <div className="container py-16 text-center">
        <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">No scenarios yet</h2>
        <p className="text-sm text-muted-foreground">
          Upload data and run analysis to generate what-if scenarios.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">What-If Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Explore projected outcomes based on AI-generated scenarios
        </p>
      </div>
      <ScenariosGrid scenarios={dashboardData.scenarios} />
    </div>
  );
}
