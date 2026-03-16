import { useCallback, useState } from "react";
import { useUploadCsv, useRunAnalysis } from "@/hooks/useAnalytics";
import { useAppStore } from "@/services/store";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const { uploadStatus, uploadResult, uploadError } = useAppStore();
  const uploadMutation = useUploadCsv();
  const analysisMutation = useRunAnalysis();
  const navigate = useNavigate();

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        useAppStore.getState().setUploadError("Please upload a CSV file.");
        useAppStore.getState().setUploadStatus("error");
        return;
      }
      uploadMutation.mutate(file);
    },
    [uploadMutation]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRunAnalysis = () => {
    if (uploadResult) {
      analysisMutation.mutate(
        { datasetId: uploadResult.datasetId },
        { onSuccess: () => navigate("/dashboard") }
      );
    }
  };

  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Upload Advertising Data
        </h1>
        <p className="text-muted-foreground">
          Upload your CSV file to get AI-powered analytics and insights
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`glass-card rounded-xl p-12 text-center transition-all cursor-pointer animate-fade-in ${
          dragOver ? "border-primary border-2 bg-primary/5" : ""
        } ${uploadStatus === "uploaded" ? "border-success/30" : ""}`}
        style={{ animationDelay: "100ms" }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (uploadStatus !== "uploading") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".csv";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFile(file);
            };
            input.click();
          }
        }}
      >
        {uploadStatus === "idle" && (
          <>
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Drop CSV here or click to browse
            </h3>
            <p className="text-sm text-muted-foreground">
              Supports advertising data CSV files up to 50MB
            </p>
          </>
        )}

        {uploadStatus === "uploading" && (
          <>
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Processing your file...
            </h3>
            <p className="text-sm text-muted-foreground">
              Validating and uploading CSV data
            </p>
          </>
        )}

        {uploadStatus === "uploaded" && uploadResult && (
          <>
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Upload Complete
            </h3>
            <div className="flex items-center justify-center gap-6 mt-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>
                  <strong className="text-foreground">
                    {uploadResult.rowsProcessed.toLocaleString()}
                  </strong>{" "}
                  rows processed
                </span>
              </div>
              <div className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {uploadResult.datasetId}
              </div>
            </div>
          </>
        )}

        {uploadStatus === "error" && (
          <>
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Upload Failed
            </h3>
            <p className="text-sm text-destructive">{uploadError}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Click to try again
            </p>
          </>
        )}
      </div>

      {/* Run Analysis Button */}
      {uploadStatus === "uploaded" && (
        <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
          <button
            onClick={handleRunAnalysis}
            disabled={analysisMutation.isPending}
            className="gradient-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
          >
            {analysisMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Run AI Analysis"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
