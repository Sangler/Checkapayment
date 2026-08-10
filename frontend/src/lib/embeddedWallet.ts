import { Web3Auth, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { createWalletClient, custom, type Address, type Hex } from "viem";

/**
 * Plain embedded EOA wallet only - Web3Auth's Smart Account / account
 * abstraction feature is a paid add-on above the free Base tier, so it is
 * intentionally not enabled here.
 */
let web3auth: Web3Auth | null = null;
let initPromise: Promise<void> | null = null;

function getClientId(): string {
  const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
  if (!clientId) {
    throw new Error("VITE_WEB3AUTH_CLIENT_ID is not set. Add it to frontend/.env.");
  }
  return clientId;
}

function getInstance(): Web3Auth {
  if (!web3auth) {
    web3auth = new Web3Auth({
      clientId: getClientId(),
      web3AuthNetwork: import.meta.env.PROD ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    });
  }
  return web3auth;
}

async function ensureInitialized(): Promise<Web3Auth> {
  const instance = getInstance();
  if (!initPromise) {
    initPromise = instance.init();
  }
  await initPromise;
  return instance;
}

function getConnectedProvider(instance: Web3Auth) {
  const provider = instance.connection?.ethereumProvider ?? null;
  if (!provider) {
    throw new Error("Wallet is not connected. Call connectEmbeddedWallet() first.");
  }
  return provider;
}

/** Opens the embedded wallet's social/passkey login modal and returns the resulting address. */
export async function connectEmbeddedWallet(): Promise<Address> {
  const instance = await ensureInitialized();
  if (!instance.connection?.ethereumProvider) {
    await instance.connect();
  }

  const provider = getConnectedProvider(instance);
  const walletClient = createWalletClient({ transport: custom(provider) });
  const [address] = await walletClient.getAddresses();
  return address;
}

export async function disconnectEmbeddedWallet(): Promise<void> {
  const instance = getInstance();
  if (instance.connection?.ethereumProvider) {
    await instance.logout();
  }
}

export async function getConnectedAddress(): Promise<Address | null> {
  const instance = await ensureInitialized();
  const provider = instance.connection?.ethereumProvider;
  if (!provider) return null;

  const walletClient = createWalletClient({ transport: custom(provider) });
  const [address] = await walletClient.getAddresses();
  return address ?? null;
}

export interface UnsignedTransaction {
  from: Address;
  to: Address;
  data: Hex;
  value: Hex;
  chainId: number;
}

/** Signs (but does not broadcast) a transaction template returned by POST /wallet/intent. */
export async function signUnsignedTransaction(unsignedTx: UnsignedTransaction): Promise<Hex> {
  const instance = await ensureInitialized();
  const provider = getConnectedProvider(instance);
  const walletClient = createWalletClient({ transport: custom(provider) });

  // This client isn't bound to a fixed viem `chain` (chainId is supplied
  // per-request instead), so the request object is intentionally untyped
  // here - the embedded wallet provider fills in gas/nonce when it
  // receives the underlying eth_signTransaction call.
  const request = {
    account: unsignedTx.from,
    chain: null,
    to: unsignedTx.to,
    data: unsignedTx.data,
    value: BigInt(unsignedTx.value),
    chainId: unsignedTx.chainId,
  };

  return walletClient.signTransaction(request as unknown as Parameters<typeof walletClient.signTransaction>[0]);
}
