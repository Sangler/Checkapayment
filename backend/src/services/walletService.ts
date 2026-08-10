import * as crypto from "crypto";
import { privateKeyToAccount } from "viem/accounts";

/**
 * DEV/TEST-ONLY deterministic wallet derivation.
 *
 * Every user has exactly one permanent `auth_subject_id` (see models/Users.ts).
 * This service derives a single EVM address from that id using
 * HMAC-SHA256(WALLET_MASTER_SEED, authSubjectId) as the private key material,
 * so registration/login can immediately populate a real, checksummed EVM
 * address (`users.evm_address`) and the rest of the stack (balances,
 * deposit/withdraw UI, ledger) can be built and tested end-to-end - the same
 * address is valid on all 5 supported EVM chains (Ethereum, Base, Polygon,
 * Arbitrum, Optimism) since it's just a keypair, not a chain-specific value.
 *
 * IMPORTANT - this is NOT the final production wallet provider:
 *  - The derived private key is fully reconstructible by anyone who has
 *    WALLET_MASTER_SEED, which means this backend is effectively custodial.
 *    A production deployment should replace this with a non-custodial MPC
 *    embedded wallet (e.g. Web3Auth / "MetaMask Embedded Wallets") so
 *    StablePAY never holds a usable private key.
 *  - Swapping providers later will produce a *different* address per user
 *    unless a deliberate migration/sweep is designed for that. Don't treat
 *    addresses generated here as permanent production wallets.
 *  - The derived private key is never persisted, logged, or returned from
 *    this module - only the resulting address is exposed to callers.
 */

function getMasterSeed(): string {
  const seed = process.env.WALLET_MASTER_SEED;
  if (!seed || seed.trim().length === 0) {
    throw new Error(
      "WALLET_MASTER_SEED is not set. Add a long random secret to backend/.env before provisioning wallets."
    );
  }
  return seed;
}

export function provisionEvmAddress(authSubjectId: string): { address: `0x${string}` } {
  if (!authSubjectId) {
    throw new Error("authSubjectId is required to derive an EVM address.");
  }

  const account = deriveAccount(authSubjectId);
  return { address: account.address };
}

function deriveAccount(authSubjectId: string) {
  const masterSeed = getMasterSeed();
  const privateKeyHex = crypto
    .createHmac("sha256", masterSeed)
    .update(`stablepay-wallet-v1:${authSubjectId}`)
    .digest("hex");

  const privateKey = `0x${privateKeyHex}` as `0x${string}`;
  return privateKeyToAccount(privateKey);
}

/**
 * Reconstructs the same signing account as provisionEvmAddress() for a
 * single in-memory use (building/signing one transaction). The private key
 * never leaves this call - callers only ever get the derived Account object
 * (address + signing methods), never the raw key. Used exclusively by the
 * requireAuth-gated, txAuthToken-gated withdraw flow - never log, persist,
 * or return this value from an API response.
 */
export function getSigningAccountForAuthSubject(authSubjectId: string) {
  if (!authSubjectId) {
    throw new Error("authSubjectId is required to derive a signing account.");
  }
  return deriveAccount(authSubjectId);
}
