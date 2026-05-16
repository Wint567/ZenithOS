import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-white text-black shadow-2xl">
            <Zap className="size-5 fill-black" />
          </div>
          <div>
            <p className="text-lg font-semibold">ZenithOS</p>
            <p className="text-xs text-foreground/45">Executive operating system</p>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
