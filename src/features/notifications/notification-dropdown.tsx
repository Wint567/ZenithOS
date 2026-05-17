"use client";

import { Bell, CheckCheck, Circle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Dropdown } from "@/shared/ui/dropdown";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useWorkspaceStore } from "@/store/use-workspace-store";

const labels = {
  growth: "Growth",
  commerce: "Commerce",
  security: "Security",
  system: "System",
};

export function NotificationDropdown() {
  const notifications = useWorkspaceStore((state) => state.notifications);
  const markRead = useWorkspaceStore((state) => state.markNotificationsRead);
  const unread = notifications.filter((notification) => notification.unread).length;
  const grouped = notifications.reduce<Record<string, typeof notifications>>((acc, notification) => {
    const key = notification.category ?? "system";
    acc[key] = [...(acc[key] ?? []), notification];
    return acc;
  }, {});

  return (
    <Dropdown
      trigger={
        <Button variant="secondary" size="icon" aria-label="Open notifications" className="relative">
          <Bell className="size-4" />
          {unread ? (
            <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-black">
              {unread}
            </span>
          ) : null}
        </Button>
      }
    >
      {() => (
        <div>
          <div className="flex items-center justify-between px-2 py-2">
            <div>
              <p className="font-semibold">Notifications</p>
              <p className="text-xs text-foreground/40">{unread} unread across workspace signals</p>
            </div>
            <button type="button" onClick={markRead} className="inline-flex items-center gap-1 text-xs font-medium text-foreground/55 hover:text-foreground">
              <CheckCheck className="size-3" /> Mark all
            </button>
          </div>
          <div className="max-h-[28rem] overflow-y-auto">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="py-2">
                <div className="mb-1 flex items-center justify-between px-2">
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-foreground/35">{labels[group as keyof typeof labels] ?? "System"}</p>
                  <Badge>{items.length}</Badge>
                </div>
                <AnimatePresence initial={false}>
                  {items.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      className="rounded-lg p-3 transition hover:bg-white/[0.06]"
                    >
                      <div className="flex items-start gap-3">
                        <Circle className={`mt-1 size-2 fill-current ${notification.unread ? "text-[var(--accent)]" : "text-white/20"}`} />
                        <div>
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="mt-1 text-xs leading-5 text-foreground/55">{notification.message}</p>
                          <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-foreground/35">{notification.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </Dropdown>
  );
}
