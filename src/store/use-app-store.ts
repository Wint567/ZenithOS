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

type Session = {
  name: string;
  email: string;
  role: "Owner" | "Admin";
};

type AppState = {
  session: Session | null;
  theme: Theme;
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  notifications: Notification[];
  toasts: Toast[];
  realtimeActivity: string[];
  onboardingDone: string[];
  setSession: (session: Session | null) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
  markNotificationsRead: () => void;
  addNotification: (notification: Notification) => void;
  simulateRealtimeEvent: () => void;
  toggleOnboardingStep: (step: string) => void;
  pushToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      session: null,
      sidebarCollapsed: false,
      commandOpen: false,
      notifications: seedNotifications,
      toasts: [],
      realtimeActivity: [
        "Northstar Labs upgraded to Scale",
        "Payment retry succeeded for Atlas Billing",
        "Nova Insights conversion report completed",
      ],
      onboardingDone: ["Create first project", "Invite team members"],
      setSession: (session) => set({ session }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      markNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({ ...notification, unread: false })),
        })),
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 14) })),
      simulateRealtimeEvent: () => {
        const events = [
          { title: "New enterprise order", message: "HelioWorks purchased 48 Pulse AI seats.", tone: "success" as const, category: "commerce" as const },
          { title: "Payment update", message: "Invoice INV-2026-0517 was paid by Northstar Labs.", tone: "success" as const, category: "commerce" as const },
          { title: "New teammate joined", message: "Samira Okafor accepted the workspace invitation.", tone: "brand" as const, category: "growth" as const },
          { title: "System alert", message: "API latency returned to normal after a brief spike.", tone: "warning" as const, category: "system" as const },
          { title: "Security signal", message: "A new SSO device was approved by policy.", tone: "brand" as const, category: "security" as const },
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        const notification: Notification = {
          id: crypto.randomUUID(),
          title: event.title,
          message: event.message,
          time: "Now",
          timestamp: Date.now(),
          category: event.category,
          unread: true,
          tone: event.tone,
        };
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 14),
          realtimeActivity: [event.message, ...state.realtimeActivity].slice(0, 8),
        }));
        get().pushToast({ title: event.title, message: event.message, tone: event.tone });
      },
      toggleOnboardingStep: (step) =>
        set((state) => ({
          onboardingDone: state.onboardingDone.includes(step)
            ? state.onboardingDone.filter((item) => item !== step)
            : [...state.onboardingDone, step],
        })),
      pushToast: (toast) => {
        const id = crypto.randomUUID();
        set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }));
        setTimeout(() => get().removeToast(id), 4200);
      },
      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
    }),
    {
      name: "zenithos-ui",
      partialize: (state) => ({
        theme: state.theme,
        session: state.session,
        sidebarCollapsed: state.sidebarCollapsed,
        onboardingDone: state.onboardingDone,
      }),
    },
  ),
);
