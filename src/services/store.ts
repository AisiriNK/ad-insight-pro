import { create } from "zustand";
import type {
  UploadResponse,
  DashboardData,
  UploadStatus,
  AnalysisStatus,
} from "@/types/api";

interface AppState {
  // Upload
  uploadStatus: UploadStatus;
  uploadResult: UploadResponse | null;
  uploadError: string | null;

  // Analysis
  analysisStatus: AnalysisStatus;
  dashboardData: DashboardData | null;
  analysisError: string | null;

  // Theme
  darkMode: boolean;

  // Actions
  setUploadStatus: (status: UploadStatus) => void;
  setUploadResult: (result: UploadResponse | null) => void;
  setUploadError: (error: string | null) => void;
  setAnalysisStatus: (status: AnalysisStatus) => void;
  setDashboardData: (data: DashboardData | null) => void;
  setAnalysisError: (error: string | null) => void;
  toggleDarkMode: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  uploadStatus: "idle",
  uploadResult: null,
  uploadError: null,
  analysisStatus: "idle",
  dashboardData: null,
  analysisError: null,
  darkMode: true,

  setUploadStatus: (status) => set({ uploadStatus: status }),
  setUploadResult: (result) => set({ uploadResult: result }),
  setUploadError: (error) => set({ uploadError: error }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setDashboardData: (data) => set({ dashboardData: data }),
  setAnalysisError: (error) => set({ analysisError: error }),
  toggleDarkMode: () =>
    set((s) => {
      const next = !s.darkMode;
      document.documentElement.classList.toggle("dark", next);
      return { darkMode: next };
    }),
  reset: () =>
    set({
      uploadStatus: "idle",
      uploadResult: null,
      uploadError: null,
      analysisStatus: "idle",
      dashboardData: null,
      analysisError: null,
    }),
}));
