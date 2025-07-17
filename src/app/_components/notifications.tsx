"use client";

import { CheckCircle, Info, X, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { useNotificationStore, type Notification } from "~/stores";

export function useNotification() {
  const { addNotification, removeNotification } = useNotificationStore();

  const notify = (notification: Notification) => {
    const id = addNotification(notification);
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration ?? 5000);
  };

  return { notify };
}

const getNotificationStyle = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        borderClass: "border-green-500 bg-green-500/5",
      };
    case "error":
      return {
        icon: <XCircle className="text-destructive h-5 w-5" />,
        borderClass: "border-destructive bg-destructive/5",
      };
    case "info":
      return {
        icon: <Info className="h-5 w-5 text-blue-500" />,
        borderClass: "border-blue-500",
      };
    default:
      return {
        icon: null,
        borderClass: "border-border",
      };
  }
};

export function Notifications() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed right-0 bottom-0 z-50 m-4 flex w-full flex-col-reverse gap-3 sm:m-6 sm:max-w-md">
      {notifications.map((n) => {
        const { icon, borderClass } = getNotificationStyle(n.type);
        return (
          <div key={n.id} className="rounded-lg bg-white">
            <div
              className={cn(
                "bg-card relative flex w-full items-start gap-4 rounded-lg border p-4 shadow-lg",
                borderClass,
              )}
            >
              <button
                className="absolute top-0 right-0 m-1 p-1 hover:cursor-pointer"
                onClick={() => removeNotification(n.id)}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mt-0.5 flex-shrink-0">{icon}</div>

              <div className="flex-grow">
                <h3 className="text-card-foreground font-semibold">
                  {n.title}
                </h3>
                {n.description && (
                  <span className="text-muted-foreground mt-1 text-sm">
                    {n.description}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
