import { create } from "zustand";

export type Notification = {
  title: string;
  description: React.ReactNode;
  type: "success" | "error" | "info";
  duration?: number;
};

interface NotificationStore {
  currentId: number;
  notifications: (Notification & { id: number })[];

  // Actions
  addNotification: (notification: Notification) => number;
  removeNotification: (id: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  currentId: 0,
  notifications: [],

  addNotification: (notification) => {
    const id = get().currentId;
    set((state) => ({
      currentId: state.currentId + 1,
      notifications: [...state.notifications, { ...notification, id }],
    }));
    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
