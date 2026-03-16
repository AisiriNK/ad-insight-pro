import type { ChartConfig } from "@/types/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(142, 76%, 36%)",
  "hsl(262, 83%, 58%)",
  "hsl(38, 92%, 50%)",
  "hsl(346, 77%, 50%)",
  "hsl(24, 95%, 53%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(222, 47%, 9%)",
  border: "1px solid hsl(217, 33%, 17%)",
  borderRadius: "8px",
  color: "hsl(210, 40%, 96%)",
  fontSize: "12px",
};

function formatValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toString();
}

export function DynamicChart({ config }: { config: ChartConfig }) {
  const { type, data, x_axis, y_axis, title } = config;

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
              <XAxis
                dataKey={x_axis}
                tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }}
                axisLine={{ stroke: "hsl(217, 33%, 17%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatValue}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatValue(v)} />
              <Bar dataKey={y_axis!} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : type === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="revenue"
                nameKey={Object.keys(data[0]).find((k) => k !== "revenue") || "name"}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: "hsl(215, 20%, 55%)" }}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          ) : (
            <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
              <XAxis
                dataKey="platform_fee"
                name="Platform Fee"
                tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }}
                axisLine={{ stroke: "hsl(217, 33%, 17%)" }}
                tickFormatter={formatValue}
              />
              <YAxis
                dataKey="revenue"
                name="Revenue"
                tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }}
                axisLine={false}
                tickFormatter={formatValue}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatValue(v)} />
              <Scatter data={data} fill={COLORS[0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
