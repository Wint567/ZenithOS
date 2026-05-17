"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AtSign, Lock, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { fakeForgotPassword, fakeLogin, fakeRegister, fakeResetPassword } from "@/mock/api";
import { useAppStore } from "@/store/use-app-store";

type Mode = "login" | "register" | "forgot" | "reset";

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your ZenithOS command center.",
    action: "Sign in",
    footer: "New to ZenithOS?",
    footerLink: "Create account",
    href: "/register",
  },
  register: {
    title: "Create workspace",
    subtitle: "Launch a polished SaaS cockpit in seconds.",
    action: "Create account",
    footer: "Already have an account?",
    footerLink: "Sign in",
    href: "/login",
  },
  forgot: {
    title: "Recover access",
    subtitle: "We will send a secure reset link to your email.",
    action: "Send reset link",
    footer: "Remembered it?",
    footerLink: "Back to login",
    href: "/login",
  },
  reset: {
    title: "Reset password",
    subtitle: "Choose a strong password for your workspace.",
    action: "Update password",
    footer: "Already reset?",
    footerLink: "Sign in",
    href: "/login",
  },
};

function strength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const pushToast = useAppStore((state) => state.pushToast);
  const setSession = useAppStore((state) => state.setSession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("founder@zenithos.io");
  const [password, setPassword] = useState("Zenith2026!");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const meta = copy[mode];
  const passwordScore = useMemo(() => strength(password), [password]);
  const showPassword = mode === "login" || mode === "register" || mode === "reset";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (mode === "register" && !name.trim()) return setError("Your name is required.");
    if ((mode === "register" || mode === "reset") && password !== confirm) return setError("Passwords need to match.");
    setLoading(true);
    try {
      if (mode === "login") await fakeLogin(email, password);
      if (mode === "register") await fakeRegister(name, email, password);
      if (mode === "forgot") await fakeForgotPassword(email);
      if (mode === "reset") await fakeResetPassword(password);
      if (mode === "login" || mode === "register" || mode === "reset") {
        setSession({
          name: mode === "register" && name ? name : "Dara Founder",
          email,
          role: "Admin",
        });
      }
      pushToast({
        title: mode === "forgot" ? "Reset email sent" : "Welcome to ZenithOS",
        message: mode === "forgot" ? "Check your inbox for the next step." : "Your workspace is ready.",
        tone: "success",
      });
      router.push(mode === "forgot" ? "/reset-password" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function continueDemo() {
    setSession({ name: "Dara Founder", email: "founder@zenithos.io", role: "Admin" });
    pushToast({ title: "Demo session restored", message: "You are viewing ZenithOS as a workspace admin.", tone: "success" });
    router.push("/dashboard");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{meta.title}</h1>
          <p className="mt-2 text-sm text-foreground/55">{meta.subtitle}</p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4">
          {mode === "register" ? (
            <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} icon={<UserRound className="size-4" />} placeholder="Dara Founder" />
          ) : null}
          {mode !== "reset" ? (
            <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} icon={<AtSign className="size-4" />} placeholder="you@company.com" error={error && !email.includes("@") ? error : undefined} />
          ) : null}
          {showPassword ? (
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              icon={<Lock className="size-4" />}
              error={error && password.length < 8 ? error : undefined}
            />
          ) : null}
          {mode === "register" || mode === "reset" ? (
            <>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <span key={step} className={`h-1.5 rounded-full ${passwordScore >= step ? "bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" : "bg-white/10"}`} />
                ))}
              </div>
              <Input label="Confirm password" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} icon={<Lock className="size-4" />} />
            </>
          ) : null}
          {error && !(error.includes("email") || error.includes("password")) ? <p className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
          <Button type="submit" loading={loading} className="mt-2 w-full" size="lg">
            {meta.action}
          </Button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm text-foreground/55">
          <span>{meta.footer}</span>
          <Link href={meta.href} className="font-medium text-foreground hover:text-white">
            {meta.footerLink}
          </Link>
        </div>
        {mode === "login" ? (
          <div className="mt-4 grid gap-3">
            <Button variant="secondary" className="w-full" onClick={continueDemo}>Continue as demo admin</Button>
            <Link href="/forgot-password" className="block text-center text-sm text-foreground/45 hover:text-foreground">
              Forgot password?
            </Link>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
