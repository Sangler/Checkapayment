import { createFileRoute } from "@tanstack/react-router";
import { FilePlus2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { useSession } from "../lib/useSession";

export const Route = createFileRoute("/create-invoice")({
  head: () => ({
    meta: [{ title: "Create Invoice/Bill — CheckAPay" }],
  }),
  component: CreateInvoicePage,
});

function CreateInvoicePage() {
  const { user, state } = useSession();
  const [search, setSearch] = useState("");

  return (
    <AppShell user={user} guest={state === "guest"} searchValue={search} onSearchChange={setSearch}>
      <div className="mb-8">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">// BILLING</div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Create Invoice/Bill</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Send a bill to a customer and get paid with stablecoin.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <FilePlus2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <h2 className="font-display text-lg font-semibold">Invoice builder is coming soon</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          This is where you'll create invoices and bills for your customers.
        </p>
      </div>
    </AppShell>
  );
}
