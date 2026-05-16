"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { Button } from "@/shared/ui/button";

const icons = {
  brand: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: TriangleAlert,
};

export function ToastViewport() {
  const toasts = useAppStore((state) => state.toasts);
  const remove = useAppStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[80] grid w-[min(24rem,calc(100vw-2rem))] gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.tone ?? "brand"];
          return (
            <motion.div
              key={toast.id}
              className="glass rounded-xl p-4"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
            >
              <div className="flex gap-3">
                <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-white/10">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{toast.title}</p>
                  {toast.message ? <p className="mt-1 text-sm text-foreground/55">{toast.message}</p> : null}
                </div>
                <Button size="icon" variant="ghost" className="size-8" onClick={() => remove(toast.id)} aria-label="Dismiss toast">
                  <X className="size-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
