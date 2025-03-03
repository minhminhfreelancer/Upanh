import React from "react";
import { Progress } from "./ui/progress";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadProgressProps {
  status?: UploadStatus;
  progress?: number;
  fileName?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const UploadProgress = ({
  status = "idle",
  progress = 0,
  fileName = "image.jpg",
  errorMessage = "An error occurred during upload. Please try again.",
  onRetry = () => {},
  onDismiss = () => {},
}: UploadProgressProps) => {
  return (
    <div className="w-full max-w-[600px] p-6 rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {status === "idle" && "Ready to upload"}
          {status === "uploading" && "Uploading..."}
          {status === "success" && "Upload complete"}
          {status === "error" && "Upload failed"}
        </h3>
        <div className="text-sm text-gray-500">{fileName}</div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <Progress
          value={progress}
          className={cn(
            "h-2",
            status === "error" && "bg-destructive/20",
            status === "success" && "bg-green-100",
          )}
        />
        <div className="flex justify-between mt-1">
          <span className="text-sm text-gray-500">
            {status === "uploading" ? `${Math.round(progress)}%` : ""}
          </span>
          <span className="text-sm text-gray-500">
            {status === "uploading" && progress < 100 ? "Uploading..." : ""}
          </span>
        </div>
      </div>

      {/* Status indicators and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === "uploading" && (
            <div className="animate-pulse text-blue-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
          )}
          {status === "error" && (
            <div className="text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
          <span
            className={cn(
              "text-sm",
              status === "success" && "text-green-500",
              status === "error" && "text-destructive",
            )}
          >
            {status === "success" && "File uploaded successfully!"}
            {status === "error" && errorMessage}
          </span>
        </div>

        <div className="flex gap-2">
          {status === "error" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
          {(status === "success" || status === "error") && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
