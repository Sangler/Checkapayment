import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Ethereum Logo (Official Diamond)
export function EthereumIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 784.37 1277.39"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <g>
        <polygon fill="#627EEA" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" />
        <polygon fill="#8A92B2" points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" />
        <polygon fill="#454A75" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" />
        <polygon fill="#8A92B2" points="392.07,1277.38 392.07,956.52 0,724.89" />
        <polygon fill="#141414" points="392.07,882.29 784.13,650.54 392.07,472.33" />
        <polygon fill="#393939" points="0,650.54 392.07,882.29 392.07,472.33" />
      </g>
    </svg>
  );
}

// 2. Base Logo (Coinbase Base Official Blue Emblem)
export function BaseIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 115 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="115" height="115" rx="57.5" fill="#0052FF" />
      <path
        d="M57.5 91C76.0015 91 91 76.0015 91 57.5C91 38.9985 76.0015 24 57.5 24C39.4678 24 24.7674 38.2096 24.0322 56.0312H68.5V58.9688H24.0322C24.7674 76.7904 39.4678 91 57.5 91Z"
        fill="white"
      />
    </svg>
  );
}

// 3. Polygon Logo (Official Polygon POL/MATIC Violet Emblem)
export function PolygonIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M28.75 11.25L20.65 6.55001C19.85 6.05001 18.95 6.05001 18.15 6.55001L10.05 11.25C9.25 11.75 8.75 12.55 8.75 13.45V22.85C8.75 23.75 9.25 24.55 10.05 25.05L18.15 29.75C18.95 30.25 19.85 30.25 20.65 29.75L28.75 25.05C29.55 24.55 30.05 23.75 30.05 22.85V13.45C30.05 12.55 29.55 11.75 28.75 11.25Z"
        fill="#8247E5"
      />
      <path
        d="M28.75 11.25L20.65 6.55001C19.85 6.05001 18.95 6.05001 18.15 6.55001L10.05 11.25C9.25 11.75 8.75 12.55 8.75 13.45V22.85C8.75 23.75 9.25 24.55 10.05 25.05L18.15 29.75C18.95 30.25 19.85 30.25 20.65 29.75L28.75 25.05C29.55 24.55 30.05 23.75 30.05 22.85V13.45C30.05 12.55 29.55 11.75 28.75 11.25Z"
        stroke="#A855F7"
        strokeWidth="1.5"
      />
      <circle cx="19.4" cy="18.1" r="4.5" fill="white" />
    </svg>
  );
}

// 4. Arbitrum Logo (Official Arbitrum Blue Split Shield)
export function ArbitrumIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="50" fill="#28A0F0" />
      <path
        d="M50 20L67.5 50L50 80L32.5 50L50 20Z"
        fill="#12AAFF"
      />
      <path
        d="M50 20L75 63.5H62.5L50 42L37.5 63.5H25L50 20Z"
        fill="white"
      />
      <path
        d="M50 80L37.5 58.5H50L62.5 80H50Z"
        fill="#0A2540"
      />
    </svg>
  );
}

// 5. Optimism Logo (Official Optimism Red OP Badge)
export function OptimismIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="50" fill="#FF0420" />
      <circle cx="36" cy="50" r="16" stroke="white" strokeWidth="8" fill="none" />
      <path
        d="M58 34H70C76.6274 34 82 39.3726 82 46C82 52.6274 76.6274 58 70 58H66V66H58V34ZM66 50H70C72.2091 50 74 48.2091 74 46C74 43.7909 72.2091 42 70 42H66V50Z"
        fill="white"
      />
    </svg>
  );
}

// 6. USDC Logo (Circle Official USD Coin)
export function UsdcIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 2000 2000"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="1000" cy="1000" r="1000" fill="#2775CA" />
      <path
        d="M1275 1158c0-141-83-190-248-208-118-14-142-45-142-88 0-46 36-76 99-76 61 0 95 24 107 72 3 13 14 21 27 21h56c16 0 28-13 26-29-14-77-70-128-154-138v-97c0-17-13-30-30-30h-38c-17 0-30 13-30 30v94c-94 13-156 73-156 156 0 131 77 184 240 204 116 17 150 43 150 93 0 57-48 89-114 89-86 0-122-38-133-91-3-14-15-24-29-24h-61c-16 0-29 14-27 30 14 90 73 147 184 160v99c0 17 13 30 30 30h38c17 0 30-13 30-30v-97c98-13 166-70 166-165z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 7. USDT Logo (Tether)
export function UsdtIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 2000 2000"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="1000" cy="1000" r="1000" fill="#26A17B" />
      <path
        d="M1178 720h284c17 0 30-13 30-30v-30c0-17-13-30-30-30H538c-17 0-30 13-30 30v30c0 17 13 30 30 30h284v168c-247 12-432 58-432 113s185 101 432 113v401c0 17 13 30 30 30h96c17 0 30-13 30-30v-401c247-12 432-58 432-113s-185-101-432-113V720zm0 300c-15 1-112 7-178 7s-163-6-178-7c-178-9-312-38-312-70s134-61 312-70c15-1 112-7 178-7s163 6 178 7c178 9 312 38 312 70s-134 61-312 70z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 8. CADC Logo (Canadian Dollar Coin — red maple leaf mark)
export function CadcIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill="#FF0000" />
      {/* Maple leaf simplified */}
      <path
        d="M50 15 L53 30 L67 22 L60 35 L75 35 L63 45 L68 60 L50 52 L32 60 L37 45 L25 35 L40 35 L33 22 L47 30 Z"
        fill="white"
      />
      <rect x="46" y="58" width="8" height="14" rx="2" fill="white" />
    </svg>
  );
}

// 9. EURC Logo (Euro Coin by Circle — blue circle with €)
export function EurcIcon({ className = "h-5 w-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill="#2775CA" />
      <text
        x="50"
        y="67"
        textAnchor="middle"
        fontSize="52"
        fontWeight="bold"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        €
      </text>
    </svg>
  );
}

export type NetworkKey = "ethereum" | "base" | "polygon" | "arbitrum" | "optimism";

export interface NetworkConfig {
  id: NetworkKey;
  name: string;
  shortName: string;
  badgeColor: string;
  accentBg: string;
  icon: React.ComponentType<IconProps>;
  chainId: number;
  explorerUrl: string;
  nativeToken: string;
  supportedTokens: {
    symbol: string;
    name: string;
    isNative: boolean;
    decimals: number;
    icon: React.ComponentType<IconProps>;
  }[];
}

export const SUPPORTED_NETWORK_CONFIGS: Record<NetworkKey, NetworkConfig> = {
  base: {
    id: "base",
    name: "Base",
    shortName: "Base",
    badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    accentBg: "hover:border-blue-500/40 hover:bg-blue-500/5",
    icon: BaseIcon,
    chainId: 8453,
    explorerUrl: "https://basescan.org",
    nativeToken: "ETH",
    supportedTokens: [
      { symbol: "USDC", name: "USD Coin", isNative: false, decimals: 6, icon: UsdcIcon },
      { symbol: "EURC", name: "Euro Coin", isNative: false, decimals: 6, icon: EurcIcon },
      { symbol: "CADC", name: "Canadian Dollar Coin", isNative: false, decimals: 18, icon: CadcIcon },
      { symbol: "ETH", name: "Ethereum", isNative: true, decimals: 18, icon: EthereumIcon },
    ],
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    shortName: "Polygon",
    badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    accentBg: "hover:border-purple-500/40 hover:bg-purple-500/5",
    icon: PolygonIcon,
    chainId: 137,
    explorerUrl: "https://polygonscan.com",
    nativeToken: "MATIC",
    supportedTokens: [
      { symbol: "USDC", name: "USD Coin", isNative: false, decimals: 6, icon: UsdcIcon },
      { symbol: "MATIC", name: "Polygon Ecosystem Token", isNative: true, decimals: 18, icon: PolygonIcon },
      { symbol: "USDT", name: "Tether USD", isNative: false, decimals: 6, icon: UsdtIcon },
    ],
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum One",
    shortName: "Arbitrum",
    badgeColor: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    accentBg: "hover:border-sky-500/40 hover:bg-sky-500/5",
    icon: ArbitrumIcon,
    chainId: 42161,
    explorerUrl: "https://arbiscan.io",
    nativeToken: "ETH",
    supportedTokens: [
      { symbol: "USDC", name: "USD Coin", isNative: false, decimals: 6, icon: UsdcIcon },
      { symbol: "ETH", name: "Ethereum", isNative: true, decimals: 18, icon: EthereumIcon },
      { symbol: "USDT", name: "Tether USD", isNative: false, decimals: 6, icon: UsdtIcon },
    ],
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum Mainnet",
    shortName: "ETH",
    badgeColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    accentBg: "hover:border-indigo-500/40 hover:bg-indigo-500/5",
    icon: EthereumIcon,
    chainId: 1,
    explorerUrl: "https://etherscan.io",
    nativeToken: "ETH",
    supportedTokens: [
      { symbol: "USDC", name: "USD Coin", isNative: false, decimals: 6, icon: UsdcIcon },
      { symbol: "ETH", name: "Ethereum", isNative: true, decimals: 18, icon: EthereumIcon },
      { symbol: "USDT", name: "Tether USD", isNative: false, decimals: 6, icon: UsdtIcon },
    ],
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    shortName: "OP Mainnet",
    badgeColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    accentBg: "hover:border-rose-500/40 hover:bg-rose-500/5",
    icon: OptimismIcon,
    chainId: 10,
    explorerUrl: "https://optimistic.etherscan.io",
    nativeToken: "ETH",
    supportedTokens: [
      { symbol: "USDC", name: "USD Coin", isNative: false, decimals: 6, icon: UsdcIcon },
      { symbol: "ETH", name: "Ethereum", isNative: true, decimals: 18, icon: EthereumIcon },
    ],
  },
};
