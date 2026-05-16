"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification } from "@/types";
import { notifications as seedNotifications } from "@/mock/data";

type Theme = "dark" | "light";

type Toast = {
  id: string;
  title: string;
  message?: string;
  tone?: Notification["tone"];
};

type AppState = {
  theme: Theme;
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  notifications: Notification[];
  toasts: Toast[];
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
  markNotificationsRead: () => void;
  addNotification: (notification: Notification) => void;
  pushToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      sidebarCollapsed: false,
      commandOpen: false,
      notifications: seedNotifications,
      toasts: [],
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      markNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({ ...notification, unread: false })),
        })),
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 8) })),
      pushToast: (toast) => {
        const id = crypto.randomUUID();
        set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }));
        setTimeout(() => get().removeToast(id), 4200);
      },
      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
    }),
    {
      name: "zenithos-ui",
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
);
