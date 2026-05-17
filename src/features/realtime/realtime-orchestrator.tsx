"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";

export function RealtimeOrchestrator() {
  const pushToast = useAppStore((state) => state.pushToast);
  const simulateOperationalEvent = useWorkspaceStore((state) => state.simulateOperationalEvent);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const notification = simulateOperationalEvent();
      pushToast({ title: notification.title, message: notification.message, tone: notification.tone });
    }, 24000);
    return () => window.clearInterval(timer);
  }, [pushToast, simulateOperationalEvent]);

  return null;
}
