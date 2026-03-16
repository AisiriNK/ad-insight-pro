import { useAppStore } from "@/services/store";
import { ScenariosGrid } from "@/components/ScenariosPanel";
import scenariosMock from "@/mock/scenarios.json";
import type { Scenario } from "@/types/api";

export default function ScenariosPage() {
  const { dashboardData } = useAppStore();
  const scenarios = (dashboardData?.scenarios || scenariosMock.scenarios) as Scenario[];

  return (
    <div className="container py-8 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">What-If Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Explore projected outcomes based on AI-generated scenarios
        </p>
      </div>
      <ScenariosGrid scenarios={scenarios} />
    </div>
  );
}
