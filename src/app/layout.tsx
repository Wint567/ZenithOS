import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { ToastViewport } from "@/features/notifications/toast-viewport";
import { CommandPalette } from "@/features/command-palette/command-palette";

export const metadata: Metadata = {
  title: "ZenithOS",
  description: "Premium SaaS admin dashboard portfolio application.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <CommandPalette />
          <ToastViewport />
        </ThemeProvider>
      </body>
    </html>
  );
}
