"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
};

export function EmptyState({ icon: Icon, title, description, action, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center"
    >
      <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.07]">
        <Icon className="size-6 text-[var(--accent)]" />
      </div>
      <h3 className="mt-5 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/50">{description}</p>
      {action ? <Button className="mt-5" variant="secondary" onClick={onAction}>{action}</Button> : null}
    </motion.div>
  );
}
