import { createPublicClient, createWalletClient, http, type Account, type Address, type Chain } from "viem";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

/**
 * The 5 chains StablePAY tracks balances on and can send/withdraw from.
 * Adding a chain later = add it here + add its tokens in tokensConfig.ts.
 */
export type SupportedNetwork = "ethereum" | "base" | "polygon" | "arbitrum" | "optimism";

export const SUPPORTED_NETWORKS: SupportedNetwork[] = ["ethereum", "base", "polygon", "arbitrum", "optimism"];

const CHAIN_BY_NETWORK: Record<SupportedNetwork, Chain> = {
  ethereum: mainnet,
  base,
  polygon,
  arbitrum,
  optimism,
};

export function getChain(network: SupportedNetwork): Chain {
  return CHAIN_BY_NETWORK[network];
}

function rpcUrlFor(network: SupportedNetwork): string {
  const envKey = `RPC_URL_${network.toUpperCase()}`;
  const configured = process.env[envKey];
  if (configured) return configured;

  // Falls back to viem's built-in default RPC. These public endpoints are
  // rate-limited and NOT reliable for production polling - set the
  // corresponding RPC_URL_* env var (e.g. from Alchemy/Infura/Ankr) instead.
  const fallback = CHAIN_BY_NETWORK[network].rpcUrls.default.http[0];
  console.warn(
    `[chainClients] ${envKey} not set - falling back to public RPC (${fallback}). ` +
      `This may be rate-limited; configure ${envKey} for reliable indexing.`
  );
  return fallback;
}

const publicClientCache = new Map<SupportedNetwork, ReturnType<typeof createPublicClient>>();

export function getPublicClient(network: SupportedNetwork) {
  let client = publicClientCache.get(network);
  if (!client) {
    client = createPublicClient({ chain: getChain(network), transport: http(rpcUrlFor(network)) });
    publicClientCache.set(network, client);
  }
  return client;
}

export function getWalletClient(network: SupportedNetwork, account: Account) {
  return createWalletClient({
    account,
    chain: getChain(network),
    transport: http(rpcUrlFor(network)),
  });
}

export type { Address };
