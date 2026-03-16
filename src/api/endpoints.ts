import axios from "axios";
import type {
  UploadResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  DashboardData,
} from "@/types/api";

// Mock imports
import summaryMock from "@/mock/summary.json";
import insightsMock from "@/mock/insights.json";
import scenariosMock from "@/mock/scenarios.json";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Toggle: set to false to use real backend
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// === Upload CSV ===
export async function uploadCsv(file: File): Promise<UploadResponse> {
  if (USE_MOCK) {
    await delay(1500);
    if (!file.name.endsWith(".csv")) {
      throw new Error("Invalid file type. Please upload a CSV file.");
    }
    return {
      datasetId: `dataset_${Date.now()}`,
      rowsProcessed: Math.floor(Math.random() * 25000) + 5000,
      status: "uploaded",
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<UploadResponse>("/upload-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// === Run Analysis ===
export async function runAnalysis(
  request: AnalyzeRequest
): Promise<AnalyzeResponse> {
  if (USE_MOCK) {
    await delay(2000);
    return {
      summary: summaryMock.summary,
      insights: insightsMock.insights,
      scenarios: scenariosMock.scenarios,
    } as AnalyzeResponse;
  }

  const { data } = await api.post<AnalyzeResponse>("/analyze", request);
  return data;
}

// === Get Dashboard Data ===
export async function getDashboardData(
  datasetId: string
): Promise<DashboardData> {
  if (USE_MOCK) {
    await delay(800);
    return {
      summary: summaryMock.summary,
      insights: insightsMock.insights,
      scenarios: scenariosMock.scenarios,
    } as DashboardData;
  }

  const { data } = await api.get<DashboardData>(`/dashboard/${datasetId}`);
  return data;
}

export default api;
