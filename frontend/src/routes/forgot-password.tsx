import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { AuthShell } from "../components/AuthShell";
import { api } from "../lib/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Recover access — CheckAPay" },
      {
        name: "description",
        content:
          "Reset your CheckAPay account password and get back to billing, payments, and CAD cashouts.",
      },
      { property: "og:title", content: "Recover access — CheckAPay Terminal" },
      {
        property: "og:description",
        content:
          "Restore access to your treasury console. Contract signer keys remain untouched.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setStatus({ type: "success", message: response.data.message });
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response
          ? (error.response as { data?: { error?: string } }).data?.error || "Unable to dispatch the recovery link."
          : "Unable to dispatch the recovery link.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <AuthShell
      badge="RECOVERY // TIER 2 AUTH"
      title={
        <>
          Restore your <span className="text-primary">signer session</span>.
        </>
      }
      subtitle="We'll dispatch a signed recovery link to the operator email on file. Payment splitter keys are unaffected."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
          >
            Verified operator email
          </label>
          <input
            id="email"
            type="email"
            placeholder="treasury@company.com"
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            className="w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="rounded-md border border-border bg-card/50 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="uppercase tracking-widest text-foreground">Notice</span>
          </div>
          Password recovery only restores console access. Wallet signer keys, hardware devices, and
          multi-sig quorums remain unchanged.
        </div>

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
        >
          Dispatch Recovery Link
          <span className="font-mono transition-transform group-hover:translate-x-1">→</span>
        </button>

        {status.message ? (
          <p className={`text-sm ${status.type === "error" ? "text-red-500" : "text-primary"}`}>
            {status.message}
          </p>
        ) : null}

        <div className="flex items-center justify-between pt-2 text-sm">
          <Link to="/login" className="text-muted-foreground hover:text-foreground">
            ← Back to sign in
          </Link>
          <Link to="/register" className="font-medium text-primary hover:underline">
            Request access
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
