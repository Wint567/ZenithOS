"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return children;
}
