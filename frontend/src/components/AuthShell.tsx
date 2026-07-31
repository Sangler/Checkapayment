import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface AuthShellProps {
  badge: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ badge, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <div className="min-h-screen">
        <main className="relative flex min-h-screen flex-col justify-center px-6 py-12 lg:px-16">
          <Link
            to="/"
            className="absolute left-6 top-6 font-display text-lg font-extrabold tracking-tighter lg:hidden"
          >
            CheckAPay<span className="text-primary">.</span>
          </Link>

          <div className="mx-auto w-full max-w-md">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-primary">
              {badge}
            </div>
            <h1 className="mb-4 font-display text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              {title}
            </h1>
            <p className="mb-10 text-base leading-relaxed text-muted-foreground">{subtitle}</p>

            {children}
          </div>

          <div className="mx-auto mt-12 flex w-full max-w-md items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              ← Back to site
            </Link>
            <span>© 2026 CheckAPay</span>
          </div>
        </main>
      </div>
    </div>
  );
}

function TerminalStat({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-2xl font-bold tabular-nums">{value}</div>
      <div
        className={`font-mono text-[11px] ${positive ? "text-primary" : "text-muted-foreground"}`}
      >
        {delta}
      </div>
    </div>
  );
}
