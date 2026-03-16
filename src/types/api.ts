// === Upload API ===
export interface UploadResponse {
  datasetId: string;
  rowsProcessed: number;
  status: "uploaded" | "error";
}

// === Dashboard / Analysis API ===
export interface KPIs {
  total_revenue: number;
  total_net_revenue: number;
  total_impressions: number;
  total_data_providers: number;
  total_segments: number;
  avg_cpm: number;
}

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: "bar" | "pie" | "scatter" | "line";
  x_axis?: string;
  y_axis?: string;
  data: ChartDataPoint[];
}

export interface Summary {
  kpis: KPIs;
  charts: ChartConfig[];
}

// === Insights ===
export type InsightType =
  | "revenue_optimization"
  | "audience_insight"
  | "saturation"
  | "market_trend"
  | "operational_issue"
  | "reporting_issue";

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
}

// === Scenarios ===
export interface Scenario {
  scenario: string;
  assumption: string;
  expected_revenue_increase?: number;
  expected_net_revenue_increase?: number;
  confidence: number;
}

// === Combined ===
export interface DashboardData {
  summary: Summary;
  insights: Insight[];
  scenarios: Scenario[];
}

export interface AnalyzeRequest {
  datasetId: string;
}

export interface AnalyzeResponse extends DashboardData {}

// === App State ===
export type UploadStatus = "idle" | "uploading" | "uploaded" | "error";
export type AnalysisStatus = "idle" | "analyzing" | "complete" | "error";
