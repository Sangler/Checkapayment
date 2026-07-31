import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { useSession } from "../lib/useSession";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [{ title: "Transactions — CheckAPay" }],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { user, state } = useSession();
  const [search, setSearch] = useState("");

  return (
    <AppShell user={user} guest={state === "guest"} searchValue={search} onSearchChange={setSearch}>
      <div className="mb-8">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">// LEDGER</div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Manage your transactions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track incoming payments, settlements, and payouts in one place.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <h2 className="font-display text-lg font-semibold">No transactions yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Bills you send and stablecoin settlements you receive will show up here.
        </p>
      </div>
    </AppShell>
  );
}
