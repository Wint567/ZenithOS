"use client";

import { Bell, Circle } from "lucide-react";
import { useEffect } from "react";
import { Dropdown } from "@/shared/ui/dropdown";
import { Button } from "@/shared/ui/button";
import { useAppStore } from "@/store/use-app-store";

export function NotificationDropdown() {
  const notifications = useAppStore((state) => state.notifications);
  const addNotification = useAppStore((state) => state.addNotification);
  const markRead = useAppStore((state) => state.markNotificationsRead);
  const pushToast = useAppStore((state) => state.pushToast);
  const unread = notifications.filter((notification) => notification.unread).length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      const notification = {
        id: crypto.randomUUID(),
        title: "Live update",
        message: "A new high-intent customer entered the expansion pipeline.",
        time: "Now",
        unread: true,
        tone: "brand" as const,
      };
      addNotification(notification);
      pushToast({ title: notification.title, message: notification.message, tone: notification.tone });
    }, 32000);
    return () => window.clearInterval(timer);
  }, [addNotification, pushToast]);

  return (
    <Dropdown
      trigger={
        <Button variant="secondary" size="icon" aria-label="Open notifications" className="relative">
          <Bell className="size-4" />
          {unread ? <span className="absolute right-2 top-2 size-2 rounded-full bg-[var(--accent)]" /> : null}
        </Button>
      }
    >
      {() => (
        <div>
          <div className="flex items-center justify-between px-2 py-2">
            <p className="font-semibold">Notifications</p>
            <button type="button" onClick={markRead} className="text-xs font-medium text-foreground/55 hover:text-foreground">
              Mark read
            </button>
          </div>
          <div className="grid gap-1">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-lg p-3 transition hover:bg-white/[0.06]">
                <div className="flex items-start gap-3">
                  <Circle className={`mt-1 size-2 fill-current ${notification.unread ? "text-[var(--accent)]" : "text-white/20"}`} />
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="mt-1 text-xs leading-5 text-foreground/55">{notification.message}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-foreground/35">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Dropdown>
  );
}
