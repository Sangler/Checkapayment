import { useState } from "react";
import { Loader2, Wallet } from "lucide-react";
import { api } from "../lib/api";
import type { SessionUser } from "../lib/useSession";
import { connectEmbeddedWallet, signUnsignedTransaction } from "../lib/embeddedWallet";

const NETWORKS = ["ethereum", "base", "polygon", "arbitrum", "optimism"] as const;
type Network = (typeof NETWORKS)[number];

const NATIVE_ASSET_BY_NETWORK: Record<Network, string> = {
  ethereum: "ETH",
  base: "ETH",
  polygon: "MATIC",
  arbitrum: "ETH",
  optimism: "ETH",
};

const ASSET_DECIMALS: Record<string, number> = { ETH: 18, MATIC: 18, USDC: 6 };

type SendStep = "form" | "pin" | "sending" | "done";

function toSmallestUnit(amount: string, decimals: number): string {
  const [whole, fraction = ""] = amount.trim().split(".");
  const paddedFraction = (fraction + "0".repeat(decimals)).slice(0, decimals);
  const combined = `${whole || "0"}${paddedFraction}`.replace(/^0+(?=\d)/, "");
  return combined || "0";
}

export function WalletCard({ user }: { user: SessionUser | null }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSend, setShowSend] = useState(false);
  const [step, setStep] = useState<SendStep>("form");
  const [network, setNetwork] = useState<Network>("base");
  const [asset, setAsset] = useState("USDC");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);

  const boundAddress = user?.evmAddress || null;

  const handleConnect = async () => {
    setError(null);
    setConnecting(true);
    try {
      const address = await connectEmbeddedWallet();
      await api.post("/wallet/bind", { address });
      window.location.reload(); // simplest way to refresh the bound session user
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet.");
    } finally {
      setConnecting(false);
    }
  };

  const resetSendFlow = () => {
    setShowSend(false);
    setStep("form");
    setPin("");
    setTxHash(null);
    setError(null);
  };

  const handleContinueToPin = () => {
    if (!toAddress || !amount) {
      setError("Enter a destination address and amount.");
      return;
    }
    setError(null);
    setStep("pin");
  };

  const handleConfirmSend = async () => {
    setError(null);
    setStep("sending");
    try {
      const stepUp = await api.post("/auth/pin/verify", { pin });
      const txAuthToken = stepUp.data.txAuthToken;

      const decimals = ASSET_DECIMALS[asset] ?? 18;
      const smallestUnitAmount = toSmallestUnit(amount, decimals);

      const intentResponse = await api.post("/wallet/intent", {
        network,
        asset,
        toAddress,
        amount: smallestUnitAmount,
        txAuthToken,
      });

      const { intentId, unsignedTransaction } = intentResponse.data;
      const signedTransaction = await signUnsignedTransaction(unsignedTransaction);

      const relayResponse = await api.post("/wallet/relay", { intentId, signedTransaction });
      setTxHash(relayResponse.data.txHash);
      setStep("done");
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Send failed.");
      setStep("pin");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/40 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-primary">Wallet</div>
          <h2 className="font-display text-lg font-semibold">Embedded wallet</h2>
        </div>
        <Wallet className="h-5 w-5 text-muted-foreground" />
      </div>

      {boundAddress ? (
        <div className="mb-4 rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-xs text-foreground">
          {boundAddress}
        </div>
      ) : (
        <p className="mb-4 text-sm text-muted-foreground">
          Connect your wallet to send stablecoins. No seed phrase - sign in with your existing session.
        </p>
      )}

      {error ? <p className="mb-3 text-xs text-destructive">{error}</p> : null}

      {!boundAddress ? (
        <button
          type="button"
          onClick={handleConnect}
          disabled={connecting}
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
        >
          {connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {connecting ? "Connecting…" : "Connect wallet"}
        </button>
      ) : !showSend ? (
        <button
          type="button"
          onClick={() => setShowSend(true)}
          className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50"
        >
          Send
        </button>
      ) : step === "done" ? (
        <div className="space-y-3">
          <p className="text-sm text-foreground">Transaction submitted.</p>
          <p className="break-all font-mono text-xs text-muted-foreground">{txHash}</p>
          <button
            type="button"
            onClick={resetSendFlow}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50"
          >
            Close
          </button>
        </div>
      ) : step === "pin" || step === "sending" ? (
        <div className="space-y-3">
          <label className="block text-xs text-muted-foreground">
            Enter your 6-digit PIN to authorize this transfer
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirmSend}
              disabled={step === "sending" || pin.length !== 6}
              className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              {step === "sending" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {step === "sending" ? "Sending…" : "Confirm & send"}
            </button>
            <button
              type="button"
              onClick={resetSendFlow}
              disabled={step === "sending"}
              className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs text-muted-foreground">
              Network
              <select
                value={network}
                onChange={(event) => setNetwork(event.target.value as Network)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {NETWORKS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-muted-foreground">
              Asset
              <select
                value={asset}
                onChange={(event) => setAsset(event.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="USDC">USDC</option>
                <option value={NATIVE_ASSET_BY_NETWORK[network]}>{NATIVE_ASSET_BY_NETWORK[network]}</option>
              </select>
            </label>
          </div>
          <label className="block text-xs text-muted-foreground">
            Recipient address
            <input
              type="text"
              value={toAddress}
              onChange={(event) => setToAddress(event.target.value)}
              placeholder="0x…"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Amount
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleContinueToPin}
              className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={resetSendFlow}
              className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
