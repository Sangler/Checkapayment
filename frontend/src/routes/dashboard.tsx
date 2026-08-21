import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  Copy,
  Gift,
  Loader2,
  Lock,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { WalletCard } from "../components/WalletCard";
import { DepositQRModal } from "../components/DepositQRModal";
import {
  SUPPORTED_NETWORK_CONFIGS,
  type NetworkKey,
} from "../components/NetworkIcons";
import { getFeeItems } from "../lib/fees";
import { useSession } from "../lib/useSession";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CheckAPay" },
      {
        name: "description",
        content: "Manage your bills, verification status, and stablecoin settlements from your CheckAPay dashboard.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { user, state } = useSession();
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedDepositNetwork, setSelectedDepositNetwork] = useState<NetworkKey>("base");

  const handleCopyReferral = async () => {
    if (!user?.referralCode) return;
    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — silently ignore.
    }
  };

  const handleOpenDepositQR = (netKey: NetworkKey) => {
    if (state === "guest" || !user) {
      // Unauthenticated guest user redirect to /login
      navigate({ to: "/login" });
      return;
    }
    setSelectedDepositNetwork(netKey);
    setShowDepositModal(true);
  };

  const firstName = user?.firstName?.trim() || "there";
  const memberSince = formatDate(user?.createdAt);
  const kycStatus = (user?.KYCStatus || "pending").toLowerCase();
  const guest = state === "guest";

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading your session…
        </div>
      </div>
    );
  }

  return (
    <AppShell user={user} guest={guest} searchValue={search} onSearchChange={setSearch}>
      {state === "error" ? (
        <div className="mb-8 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive">
          Couldn't reach the account service. Showing a limited view until the connection is restored.
        </div>
      ) : null}

      {guest ? (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-md border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="font-mono text-xs text-primary">
            You're browsing as a guest — log in to generate QR codes and manage settlements.
          </span>
          <div className="flex items-center gap-3 text-xs font-medium">
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
            <Link to="/register" className="text-primary hover:underline">
              Create account
            </Link>
          </div>
        </div>
      ) : null}

      {/* Welcome header */}
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
          {guest ? "GUEST // BROWSING" : "SESSION // AUTHENTICATED"}
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight lg:text-4xl">
          {guest ? (
            "Welcome to CheckAPay"
          ) : (
            <>
              Welcome back, <span className="text-primary">{firstName}</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {user?.email || "Your account overview and stablecoin billing activity."}
        </p>
      </div>

      {/* Verification status */}
      {!guest ? (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatusCard
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={user?.emailVerified ? "Verified" : "Pending verification"}
            verified={Boolean(user?.emailVerified)}
          />
          <StatusCard
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={user?.phoneVerified ? "Verified" : "Pending verification"}
            verified={Boolean(user?.phoneVerified)}
          />
          <StatusCard
            icon={<ShieldCheck className="h-4 w-4" />}
            label="KYC status"
            value={capitalize(kycStatus)}
            verified={kycStatus === "approved" || kycStatus === "verified"}
          />
        </div>
      ) : null}

      {!guest && kycStatus !== "approved" && kycStatus !== "verified" ? (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-md border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="font-mono text-xs text-primary">
            Your profile is incomplete — finish KYB to unlock full account limits.
          </span>
          <Link
            to="/collect-info"
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          >
            Complete your profile
          </Link>
        </div>
      ) : null}

      {/* Stats + session grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: quick stats */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatCard icon={<Gift className="h-4 w-4" />} label="Reward points" value={String(user?.points ?? 0)} />
          <StatCard icon={<Activity className="h-4 w-4" />} label="Recent activity" value="0 events" />
          <div className="col-span-2 rounded-xl border border-border bg-card/40 p-6">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Referral code
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-lg font-semibold tracking-widest text-foreground">
                {user?.referralCode || "— — — — — —"}
              </span>
              <button
                type="button"
                onClick={handleCopyReferral}
                disabled={!user?.referralCode}
                className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-card/60 disabled:opacity-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Share your code to earn points when new businesses join CheckAPay.
            </p>
          </div>
        </div>

        {!guest ? (
          <div className="lg:col-span-1">
            <WalletCard user={user} />
          </div>
        ) : null}
      </div>

      {/* EVM Deposit & QR Code Generator Section */}
      <div className="mb-8 rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Multi-Chain Settlement
            </div>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Deposit Crypto & Generate QR Code
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Select any supported EVM network to generate your unique deposit address and instant QR code.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenDepositQR(selectedDepositNetwork)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 sm:text-sm"
          >
            <QrCode className="h-4 w-4" />
            {guest ? "Log In to Deposit" : "Open Deposit QR Code"}
          </button>
        </div>

        {/* Network Cards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {(Object.keys(SUPPORTED_NETWORK_CONFIGS) as NetworkKey[]).map((netKey) => {
            const net = SUPPORTED_NETWORK_CONFIGS[netKey];
            const NetIcon = net.icon;

            return (
              <div
                key={netKey}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card/70 p-4 transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background p-1.5">
                      <NetIcon className="h-7 w-7" size={28} />
                    </div>
                    <span className="rounded-full border border-border bg-background/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      ID: {net.chainId}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="font-display text-sm font-bold text-foreground sm:text-base">
                      {net.name}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {net.supportedTokens.map((tok) => (
                        <span
                          key={tok.symbol}
                          className="rounded-md border border-border/80 bg-background/60 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
                        >
                          {tok.symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => handleOpenDepositQR(netKey)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background/80 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    {guest ? "Log in for QR" : "Generate QR"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mb-8 rounded-xl border border-border bg-card/40 p-8 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <h2 className="font-display text-lg font-semibold">No activity yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Bills you create, payment links you send, and stablecoin settlements will show up here.
        </p>
        <Link
          to="/create-invoice"
          className="mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-primary hover:underline"
        >
          Create your first bill
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mb-10 rounded-xl border border-border bg-card/40 p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-primary">Fee schedule</div>
            <h2 className="font-display text-lg font-semibold">Transparent settlement pricing</h2>
          </div>
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {guest ? "Personal" : "Business"}
          </div>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {getFeeItems(guest ? "personal" : "business").map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      {/* Deposit QR Modal */}
      <DepositQRModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        user={user}
        guest={guest}
      />
    </AppShell>
  );
}

function StatusCard({
  icon,
  label,
  value,
  verified,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full border ${
            verified ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="text-sm font-semibold">{value}</div>
        </div>
      </div>
      {verified ? <Check className="h-4 w-4 text-primary" /> : null}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-6">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
        {icon}
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function SessionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs text-foreground">{value}</dd>
    </div>
  );
}

function capitalize(value: string) {
  if (!value) return "Pending";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
