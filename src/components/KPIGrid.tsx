import type { KPIs } from "@/types/api";
import {
  DollarSign,
  TrendingUp,
  Eye,
  Users,
  Layers,
  BarChart2,
} from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  delay?: number;
}

function KPICard({ label, value, icon, trend, delay = 0 }: KPICardProps) {
  return (
    <div
      className="glass-card rounded-lg p-5 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {trend && (
        <p className="text-xs text-success mt-1 font-medium">{trend}</p>
      )}
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function formatCurrency(n: number): string {
  return `$${formatNumber(n)}`;
}

export function KPIGrid({ kpis }: { kpis: KPIs }) {
  const cards: Omit<KPICardProps, "delay">[] = [
    {
      label: "Total Revenue",
      value: formatCurrency(kpis.total_revenue),
      icon: <DollarSign className="h-4 w-4" />,
      trend: "+12.5% vs last period",
    },
    {
      label: "Net Revenue",
      value: formatCurrency(kpis.total_net_revenue),
      icon: <TrendingUp className="h-4 w-4" />,
      trend: "+8.3% vs last period",
    },
    {
      label: "Impressions",
      value: formatNumber(kpis.total_impressions),
      icon: <Eye className="h-4 w-4" />,
    },
    {
      label: "Data Providers",
      value: kpis.total_data_providers.toString(),
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Segments",
      value: kpis.total_segments.toString(),
      icon: <Layers className="h-4 w-4" />,
    },
    {
      label: "Avg CPM",
      value: `$${kpis.avg_cpm.toFixed(2)}`,
      icon: <BarChart2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <KPICard key={card.label} {...card} delay={i * 80} />
      ))}
    </div>
  );
}
