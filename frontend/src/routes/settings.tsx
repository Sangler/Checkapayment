import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { useSession } from "../lib/useSession";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings — CheckAPay" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, state } = useSession();
  const [search, setSearch] = useState("");

  return (
    <AppShell user={user} guest={state === "guest"} searchValue={search} onSearchChange={setSearch}>
      <div className="mb-8">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">// ACCOUNT</div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Setting</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your profile, security, and notification preferences.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <h2 className="font-display text-lg font-semibold">Settings are coming soon</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Profile, security, and notification preferences will live here.
        </p>
      </div>
    </AppShell>
  );
}
