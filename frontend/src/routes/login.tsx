import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AuthShell } from "../components/AuthShell";
import { api } from "../lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — CheckAPay" },
      {
        name: "description",
        content:
          "Sign in to CheckAPay to create bills, send payment links, and manage stablecoin payments and CAD cashouts.",
      },
      { property: "og:title", content: "Log in — CheckAPay Terminal" },
      {
        property: "og:description",
        content:
          "Access your treasury console, active settlement flows, and payment splitter contracts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    try {
      const response = await api.post("/auth/login", { email, password });
      setStatus({ type: "success", message: response.data.message });
      navigate({ to: "/dashboard" });
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response
          ? (error.response as { data?: { error?: string } }).data?.error || "Unable to sign in right now."
          : "Unable to sign in right now.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <AuthShell
      badge="SESSION // AUTHENTICATE"
      title={
        <>
          Return to your <span className="text-primary">business dashboard</span>.
        </>
      }
      subtitle="Sign in to create bills, send QR payments, and manage your stablecoin cashouts to CAD."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field
          label="Work email"
          id="email"
          type="email"
          placeholder="treasury@company.com"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="font-mono text-[11px] uppercase tracking-widest text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            className="w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary"
          />
          Keep this device authorized for 30 days
        </label>

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
        >
          LOG IN
          <span className="font-mono transition-transform group-hover:translate-x-1">→</span>
        </button>

        {status.message ? (
          <p className={`text-sm ${status.type === "error" ? "text-red-500" : "text-primary"}`}>
            {status.message}
          </p>
        ) : null}

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SsoButton label="APPLE" icon={<AppleIcon className="h-4 w-4" />} />
          <SsoButton label="GOOGLE" icon={<GoogleIcon className="h-4 w-4" />} />
        </div>

        <p className="pt-4 text-center text-sm text-muted-foreground">
          No account yet?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

function Field({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function SsoButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-card/60"
    >
      {icon}
      {label}
    </button>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.417 2.06-1.25 2.86-.897.86-1.99 1.36-3.083 1.27-.037-1.09.44-2.13 1.24-2.9.9-.87 2.113-1.36 3.093-1.23zM20.03 17.24c-.393.9-.86 1.79-1.407 2.61-.75 1.12-1.363 1.9-1.83 2.34-.72.72-1.49 1.09-2.31 1.11-.593.01-1.31-.16-2.15-.51-.84-.35-1.61-.52-2.31-.51-.73.01-1.52.18-2.37.51-.85.35-1.53.53-2.05.55-.79.03-1.58-.35-2.36-1.14-.51-.5-1.15-1.32-1.94-2.46-.85-1.22-1.55-2.64-2.09-4.26-.58-1.75-.87-3.44-.87-5.08 0-1.88.4-3.5 1.21-4.85.63-1.09 1.47-1.95 2.51-2.58 1.04-.63 2.17-.96 3.39-.98.63 0 1.46.2 2.51.6 1.04.4 1.71.6 2.01.6.22 0 .96-.23 2.21-.7 1.18-.44 2.18-.62 2.99-.55 2.21.18 3.87 1.05 4.98 2.62-1.98 1.2-2.96 2.88-2.94 5.02.02 1.67.62 3.06 1.8 4.16.53.51 1.12.9 1.78 1.18-.14.42-.29.83-.46 1.24z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.88-2.98c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.09C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.61H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.39z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}
