import { encodeFunctionData, type Address } from "viem";
import type { SupportedNetwork } from "./chainClients";

/**
 * Tracked tokens per chain. Native asset entries use tokenContractAddress:
 * NATIVE_TOKEN_SENTINEL ('') to match the balances table's convention
 * (see db/schema.sql - NULL isn't usable in the unique constraint there).
 */
export const NATIVE_TOKEN_SENTINEL = "" as const;

export interface TrackedToken {
  asset: string;
  tokenContractAddress: Address | typeof NATIVE_TOKEN_SENTINEL;
  decimals: number;
  isNative: boolean;
}

// Circle's official USDC contract addresses - public information.
const USDC_BY_NETWORK: Record<SupportedNetwork, Address> = {
  ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  polygon: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  arbitrum: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  optimism: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
};

const NATIVE_ASSET_BY_NETWORK: Record<SupportedNetwork, string> = {
  ethereum: "ETH",
  base: "ETH",
  polygon: "MATIC",
  arbitrum: "ETH",
  optimism: "ETH",
};

export function getTrackedTokens(network: SupportedNetwork): TrackedToken[] {
  return [
    {
      asset: NATIVE_ASSET_BY_NETWORK[network],
      tokenContractAddress: NATIVE_TOKEN_SENTINEL,
      decimals: 18,
      isNative: true,
    },
    {
      asset: "USDC",
      tokenContractAddress: USDC_BY_NETWORK[network],
      decimals: 6,
      isNative: false,
    },
  ];
}

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

export const TRANSFER_EVENT_ABI = ERC20_ABI.find(
  (item) => item.type === "event" && item.name === "Transfer"
)!;

/**
 * Builds the unsigned `{ to, data, value }` call for a transfer, for the
 * client's embedded wallet to sign - never executed or signed server-side.
 */
export function buildTransferCallData(
  token: TrackedToken,
  toAddress: Address,
  amount: bigint
): { to: Address; data: `0x${string}`; value: bigint } {
  if (token.isNative) {
    return { to: toAddress, data: "0x", value: amount };
  }

  const data = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [toAddress, amount],
  });

  return { to: token.tokenContractAddress as Address, data, value: 0n };
}
