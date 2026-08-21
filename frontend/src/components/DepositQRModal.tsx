import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import QRCode from "qrcode";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  SUPPORTED_NETWORK_CONFIGS,
  type NetworkKey,
} from "./NetworkIcons";
import type { SessionUser } from "../lib/useSession";

interface DepositQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SessionUser | null;
  guest?: boolean;
}

export function DepositQRModal({
  isOpen,
  onClose,
  user,
  guest = false,
}: DepositQRModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey>("base");
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>("USDC");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  const currentNetworkConfig = SUPPORTED_NETWORK_CONFIGS[selectedNetwork];
  const walletAddress = user?.evmAddress || "";

  // Update selected token if not supported on newly selected network
  useEffect(() => {
    const isSupported = currentNetworkConfig.supportedTokens.some(
      (t) => t.symbol === selectedTokenSymbol
    );
    if (!isSupported) {
      setSelectedTokenSymbol(currentNetworkConfig.supportedTokens[0].symbol);
    }
  }, [selectedNetwork, currentNetworkConfig, selectedTokenSymbol]);

  // Generate QR Code whenever wallet address or network changes
  useEffect(() => {
    if (!isOpen || !walletAddress) return;

    let isMounted = true;
    setGenerating(true);

    const generateCode = async () => {
      try {
        const url = await QRCode.toDataURL(walletAddress, {
          width: 320,
          margin: 2,
          color: {
            dark: "#050510",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });

        if (isMounted) {
          setQrDataUrl(url);
        }
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      } finally {
        if (isMounted) {
          setGenerating(false);
        }
      }
    };

    generateCode();

    return () => {
      isMounted = false;
    };
  }, [isOpen, walletAddress, selectedNetwork]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `checkapay-${selectedNetwork}-${walletAddress.slice(0, 6)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 p-3 backdrop-blur-md transition-all sm:p-6"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/80 bg-card/95 px-5 py-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground sm:text-lg">
                Receive & Deposit Crypto
              </h3>
              <p className="text-xs text-muted-foreground">
                EVM multi-chain stablecoin & native deposits
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close deposit modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {/* Guest or Unauthenticated Wall */}
          {guest || !user ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="font-display text-lg font-bold text-foreground">
                Authentication Required
              </h4>
              <p className="mx-auto mt-2 max-w-sm text-xs text-muted-foreground sm:text-sm">
                Please log in to your CheckAPay account to access your unique deposit address and generate live QR codes for EVM payments.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 sm:text-sm"
                >
                  Log In to Deposit
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent sm:text-sm"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : !walletAddress ? (
            <div className="rounded-xl border border-border bg-background/50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <Info className="h-5 w-5" />
              </div>
              <h4 className="font-display text-base font-semibold text-foreground">
                No Wallet Linked
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Your account does not have a bound EVM address yet. Connect your embedded wallet from the dashboard to enable instant deposits.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Select Payment Network */}
              <div>
                <label className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  1. Select Payment Network (EVM)
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(Object.keys(SUPPORTED_NETWORK_CONFIGS) as NetworkKey[]).map(
                    (netKey) => {
                      const net = SUPPORTED_NETWORK_CONFIGS[netKey];
                      const Icon = net.icon;
                      const isSelected = selectedNetwork === netKey;

                      return (
                        <button
                          key={netKey}
                          type="button"
                          onClick={() => setSelectedNetwork(netKey)}
                          className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all sm:p-3 ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-sm shadow-primary/20 ring-1 ring-primary/40"
                              : "border-border bg-card/60 hover:border-border/80 hover:bg-accent/40"
                          }`}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg overflow-hidden">
                            <Icon className="h-6 w-6" size={24} />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold text-foreground sm:text-sm">
                              {net.name}
                            </div>
                            <div className="truncate font-mono text-[10px] text-muted-foreground">
                              Chain ID: {net.chainId}
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* 2. Select Supported Cryptocurrency */}
              <div>
                <label className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  2. Supported Currencies on {currentNetworkConfig.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentNetworkConfig.supportedTokens.map((token) => {
                    const isSelected = selectedTokenSymbol === token.symbol;
                    const TokenIcon = token.icon;

                    return (
                      <button
                        key={token.symbol}
                        type="button"
                        onClick={() => setSelectedTokenSymbol(token.symbol)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "border-border bg-card text-foreground hover:border-border/80 hover:bg-accent"
                        }`}
                      >
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                          <TokenIcon className="h-4 w-4" size={16} />
                        </div>
                        <span>{token.symbol}</span>
                        <span className="font-mono text-[10px] opacity-75">
                          ({token.name})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Generated QR Code Display */}
              <div className="rounded-2xl border border-border bg-background/80 p-5 text-center">
                <div className="mx-auto mb-3 flex w-fit items-center justify-center rounded-xl bg-white p-3 shadow-xl">
                  {generating || !qrDataUrl ? (
                    <div className="flex h-52 w-52 items-center justify-center text-zinc-900">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <img
                      src={qrDataUrl}
                      alt={`Deposit QR code for ${walletAddress}`}
                      className="h-48 w-48 rounded-lg sm:h-56 sm:w-56"
                    />
                  )}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[11px] text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Network: {currentNetworkConfig.name} ({currentNetworkConfig.nativeToken})
                </div>

                {/* Wallet Address Copy Bar */}
                <div className="mt-4">
                  <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
                    Your Universal EVM Deposit Address
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5">
                    <span className="truncate font-mono text-xs font-medium text-foreground sm:text-sm">
                      {walletAddress}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy address"
                        className="flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-card"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-primary" />
                            <span className="text-primary">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {qrDataUrl && (
                        <button
                          type="button"
                          onClick={handleDownloadQR}
                          title="Download QR code image"
                          className="flex items-center rounded-md border border-border bg-background p-1 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Important Network Safety Warning */}
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-left">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <p className="text-[11px] text-amber-300/90 leading-relaxed sm:text-xs">
                    Send only <strong>{selectedTokenSymbol}</strong> or EVM assets on the{" "}
                    <strong>{currentNetworkConfig.name}</strong> network to this address. Sending funds via unsupported chains may result in permanent loss.
                  </p>
                </div>

                {/* Block Explorer Link */}
                <div className="mt-3 text-center">
                  <a
                    href={`${currentNetworkConfig.explorerUrl}/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground transition-colors hover:text-primary"
                  >
                    View on {currentNetworkConfig.name} Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
