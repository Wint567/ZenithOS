import { AppShell } from "@/layouts/app-shell/app-shell";
import { AuthGuard } from "@/features/auth/auth-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
