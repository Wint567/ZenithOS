"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";

export function AuthGuard({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAppStore((state) => state.session);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, pathname, router, session]);

  if (!hydrated || !session) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="glass rounded-xl p-6 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-white/10">
            <ShieldCheck className="size-5 text-[var(--accent)]" />
          </div>
          <p className="mt-4 font-semibold">Checking workspace access</p>
          <p className="mt-2 text-sm text-foreground/45">ZenithOS is restoring your frontend-only demo session.</p>
        </div>
      </div>
    );
  }

  return children;
}
