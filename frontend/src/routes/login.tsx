import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const missing = params.get("missing");

    if (!error) {
      return;
    }

    const missingFields = missing
      ? missing
          .split(",")
          .map((field) => field.trim())
          .filter(Boolean)
          .join(", ")
      : "";

    setStatus({
      type: "error",
      message: missingFields ? `${error} Missing fields: ${missingFields}.` : error,
    });
  }, []);

  const handleGoogleLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.assign(`${apiBaseUrl}/auth/google`);
  };

  const handleFacebookLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.assign(`${apiBaseUrl}/auth/facebook`);
  };

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
            autoComplete="current-password"
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
          <SsoButton
            label="GOOGLE"
            icon={<GoogleIcon className="h-4 w-4" />}
            onClick={handleGoogleLogin}
          />
          <SsoButton
            label="FACEBOOK"
            icon={<FacebookIcon className="h-4 w-4" />}
            onClick={handleFacebookLogin}
          />
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
        autoComplete={type === "email" ? "email" : "off"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function SsoButton({ label, icon, onClick }: { label: string; icon: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-card/60"
    >
      {icon}
      {label}
    </button>
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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        d="M13.2 20v-7.2h2.4l.3-2.8h-2.7V4.8c0-.8.2-1.4 1.4-1.4h1.5V1.1c-.3-.1-1.1-.2-2.2-.2-2.2 0-3.7 1.3-3.7 3.8v2.1H8.3v2.8h2.4V20h2.5Z"
        fill="white"
      />
    </svg>
  );
}
