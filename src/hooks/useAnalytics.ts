import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadCsv, runAnalysis, getDashboardData } from "@/api/endpoints";
import { useAppStore } from "@/services/store";
import type { AnalyzeRequest } from "@/types/api";

export function useUploadCsv() {
  const { setUploadStatus, setUploadResult, setUploadError } = useAppStore();

  return useMutation({
    mutationFn: (file: File) => uploadCsv(file),
    onMutate: () => {
      setUploadStatus("uploading");
      setUploadError(null);
    },
    onSuccess: (data) => {
      setUploadStatus("uploaded");
      setUploadResult(data);
    },
    onError: (err: Error) => {
      setUploadStatus("error");
      setUploadError(err.message || "Upload failed");
    },
  });
}

export function useRunAnalysis() {
  const { setAnalysisStatus, setDashboardData, setAnalysisError } =
    useAppStore();

  return useMutation({
    mutationFn: (req: AnalyzeRequest) => runAnalysis(req),
    onMutate: () => {
      setAnalysisStatus("analyzing");
      setAnalysisError(null);
    },
    onSuccess: (data) => {
      setAnalysisStatus("complete");
      setDashboardData(data);
    },
    onError: (err: Error) => {
      setAnalysisStatus("error");
      setAnalysisError(err.message || "Analysis failed");
    },
  });
}

export function useDashboardData(datasetId: string | null) {
  const { setDashboardData } = useAppStore();

  return useQuery({
    queryKey: ["dashboard", datasetId],
    queryFn: () => getDashboardData(datasetId!),
    enabled: !!datasetId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
