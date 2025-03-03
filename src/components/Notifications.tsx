import React from "react";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type NotificationType = "success" | "error" | "info";

export interface NotificationProps {
  type?: NotificationType;
  title?: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

const Notifications = ({
  type = "info",
  title = "Notification",
  message = "This is a notification message",
  duration = 5000,
  onClose = () => {},
}: NotificationProps) => {
  const { toast } = useToast();

  // Function to show a notification
  const showNotification = () => {
    const icons = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <AlertCircle className="h-5 w-5 text-red-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
    };

    toast({
      variant: type === "error" ? "destructive" : "default",
      title: (
        <div className="flex items-center gap-2">
          {icons[type]}
          <span>{title}</span>
        </div>
      ),
      description: message,
      duration: duration,
      action: (
        <button
          onClick={() => {
            onClose();
          }}
          className="rounded-full p-1 hover:bg-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      ),
    });
  };

  // Component for demonstration purposes
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-[350px]">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Preview</h3>

        <div className="flex items-center gap-2 p-3 rounded-md border">
          {type === "success" && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {type === "info" && <Info className="h-5 w-5 text-blue-500" />}
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>

        <button
          onClick={showNotification}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Show Notification
        </button>
      </div>

      {/* Toaster component to display the actual notifications */}
      <Toaster />
    </div>
  );
};

export default Notifications;
