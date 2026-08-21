import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  collapsed?: boolean;
}

export function LogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="logo-accent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="60%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Hex-Shield Frame */}
      <path
        d="M 50 12 L 82 28 L 82 64 L 50 84 L 18 64 L 18 28 Z"
        stroke="url(#logo-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="opacity-90"
      />

      {/* Checkmark Flow */}
      <path
        d="M 30 48 L 44 62 L 72 32"
        stroke="url(#logo-accent)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logo-glow)"
      />

      {/* Energy Node */}
      <circle cx="72" cy="32" r="3.5" fill="#38bdf8" />
    </svg>
  );
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
  collapsed = false,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: "h-6 w-6", text: "text-base", sub: "text-[9px]" },
    md: { icon: "h-8 w-8", text: "text-lg", sub: "text-[10px]" },
    lg: { icon: "h-10 w-10", text: "text-xl", sub: "text-xs" },
    xl: { icon: "h-12 w-12", text: "text-2xl", sub: "text-sm" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative flex shrink-0 items-center justify-center">
        <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm" />
        <LogoIcon className={`${currentSize.icon} relative`} />
      </div>

      {showText && !collapsed && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold tracking-tight text-foreground ${currentSize.text}`}>
            CheckA<span className="text-primary">Pay</span>
          </span>
          <span className={`font-mono font-medium tracking-widest text-muted-foreground uppercase ${currentSize.sub}`}>
            STABLEPAY
          </span>
        </div>
      )}
    </div>
  );
}
