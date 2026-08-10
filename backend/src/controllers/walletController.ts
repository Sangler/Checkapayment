import type { Request, Response } from "express";
import { isAddress, parseTransaction, recoverTransactionAddress } from "viem";
import { findUserById, updateUserEvmAddress } from "../models/Users";
import { createWalletTransaction } from "../models/Transactions";
import { createWalletIntent, findWalletIntentById, markWalletIntentRelayed } from "../models/WalletIntents";
import { consumeTxAuthToken } from "../services/txAuthService";
import { getChain, getPublicClient, SUPPORTED_NETWORKS, type SupportedNetwork } from "../services/chainClients";
import { buildTransferCallData, ERC20_ABI, getTrackedTokens, NATIVE_TOKEN_SENTINEL } from "../services/tokensConfig";

const INTENT_TTL_SECONDS = 120;

function isSupportedNetwork(value: string): value is SupportedNetwork {
  return (SUPPORTED_NETWORKS as string[]).includes(value);
}

/** Whole, non-negative integer string (smallest unit) - never a float. */
function isValidAmountString(value: string): boolean {
  return /^\d+$/.test(value) && value !== "0";
}

/**
 * POST /wallet/bind
 * body: { address }
 *
 * Registers the address the user's embedded wallet (e.g. MetaMask Embedded
 * Wallet with social login/passkey) already controls client-side. The
 * backend never generates or holds a private key for this address - it
 * only records which signer to expect for future intents.
 */
export async function bindWallet(req: Request, res: Response) {
  const userId = Number(req.userId);
  const { address } = req.body ?? {};

  if (typeof address !== "string" || !isAddress(address)) {
    return res.status(400).json({ error: "address must be a valid EVM address." });
  }

  const userRow = await findUserById(userId);
  if (!userRow) {
    return res.status(404).json({ error: "User not found." });
  }

  try {
    const updated = await updateUserEvmAddress(userId, address);
    return res.json({ ok: true, evmAddress: updated?.evm_address ?? address });
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(409).json({ error: "This wallet address is already linked to another account." });
    }
    console.error("Wallet bind failed", error);
    return res.status(500).json({ error: "Failed to bind wallet." });
  }
}

/**
 * POST /wallet/intent
 * body: { network, asset, toAddress, amount, txAuthToken }
 *
 * Requires a fresh txAuthToken from /auth/pin/verify or
 * /auth/webauthn/stepup-verify, same rule as the old withdraw endpoint.
 * Instead of signing anything here, this returns an unsigned transaction
 * template for the client's embedded wallet to sign - the private key
 * never leaves the browser/provider.
 */
export async function createIntent(req: Request, res: Response) {
  const userId = Number(req.userId);
  const { network, asset, toAddress, amount, txAuthToken } = req.body ?? {};

  if (typeof network !== "string" || !isSupportedNetwork(network)) {
    return res.status(400).json({ error: `network must be one of: ${SUPPORTED_NETWORKS.join(", ")}` });
  }
  if (typeof asset !== "string" || !asset) {
    return res.status(400).json({ error: "asset is required." });
  }
  if (typeof toAddress !== "string" || !isAddress(toAddress)) {
    return res.status(400).json({ error: "toAddress must be a valid EVM address." });
  }
  if (typeof amount !== "string" || !isValidAmountString(amount)) {
    return res.status(400).json({ error: "amount must be a positive integer string (smallest unit)." });
  }

  const tokenAuthorized = await consumeTxAuthToken(txAuthToken, userId);
  if (!tokenAuthorized) {
    return res
      .status(401)
      .json({ error: "Missing or expired transaction authorization. Verify your PIN or passkey first." });
  }

  const userRow = await findUserById(userId);
  if (!userRow?.evm_address) {
    return res.status(400).json({ error: "No wallet bound to this account yet. Connect your wallet first." });
  }

  const trackedToken = getTrackedTokens(network).find((t) => t.asset.toUpperCase() === asset.toUpperCase());
  if (!trackedToken) {
    return res.status(400).json({ error: `Asset ${asset} is not tracked on ${network}.` });
  }

  const amountBigInt = BigInt(amount);
  const publicClient = getPublicClient(network);
  const fromAddress = userRow.evm_address as `0x${string}`;

  try {
    // Best-effort pre-flight balance check against live on-chain state.
    const liveBalance = trackedToken.isNative
      ? await publicClient.getBalance({ address: fromAddress })
      : ((await publicClient.readContract({
          address: trackedToken.tokenContractAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [fromAddress],
        })) as bigint);

    if (liveBalance < amountBigInt) {
      return res.status(400).json({ error: "Insufficient balance." });
    }
  } catch (error) {
    console.error("Intent pre-flight balance check failed", error);
    return res.status(502).json({ error: "Could not verify on-chain balance. Please try again." });
  }

  const call = buildTransferCallData(trackedToken, toAddress as `0x${string}`, amountBigInt);
  const chainId = getChain(network).id;

  const intentRow = await createWalletIntent({
    userId,
    network,
    asset: trackedToken.asset,
    tokenContractAddress: trackedToken.isNative ? NATIVE_TOKEN_SENTINEL : trackedToken.tokenContractAddress,
    fromAddress,
    toAddress,
    amount,
    chainId,
    callTo: call.to,
    callData: call.data,
    callValue: call.value.toString(),
    ttlSeconds: INTENT_TTL_SECONDS,
  });

  return res.json({
    ok: true,
    intentId: intentRow.id,
    expiresInSeconds: INTENT_TTL_SECONDS,
    unsignedTransaction: {
      from: fromAddress,
      to: call.to,
      data: call.data,
      value: `0x${call.value.toString(16)}`,
      chainId,
    },
  });
}

/**
 * POST /wallet/relay
 * body: { intentId, signedTransaction }
 *
 * Broadcasts a transaction the client's embedded wallet already signed.
 * Every field is re-checked against the stored intent, and the signature
 * must recover to the intent's bound address, before anything is relayed -
 * the backend only ever broadcasts, it never signs.
 */
export async function relayIntent(req: Request, res: Response) {
  const userId = Number(req.userId);
  const { intentId, signedTransaction } = req.body ?? {};

  if (!Number.isInteger(Number(intentId))) {
    return res.status(400).json({ error: "intentId is required." });
  }
  if (typeof signedTransaction !== "string" || !signedTransaction.startsWith("0x")) {
    return res.status(400).json({ error: "signedTransaction must be a signed raw transaction hex string." });
  }

  const intentRow = await findWalletIntentById(Number(intentId));
  if (!intentRow || intentRow.user_id !== userId) {
    return res.status(404).json({ error: "Intent not found." });
  }
  if (intentRow.status !== "pending") {
    return res.status(409).json({ error: `Intent already ${intentRow.status}.` });
  }
  if (new Date(intentRow.expires_at).getTime() < Date.now()) {
    return res.status(410).json({ error: "Intent expired. Create a new one." });
  }

  type SerializedTx = Parameters<typeof recoverTransactionAddress>[0]["serializedTransaction"];
  const serializedTransaction = signedTransaction as SerializedTx;
  let signer: string;
  let parsed: ReturnType<typeof parseTransaction>;
  try {
    parsed = parseTransaction(serializedTransaction);
    signer = await recoverTransactionAddress({ serializedTransaction });
  } catch (error) {
    return res.status(400).json({ error: "Could not parse or verify the signed transaction." });
  }

  const parsedTo = (parsed.to || "").toLowerCase();
  const parsedValue = parsed.value ?? 0n;
  const parsedData = (parsed.data || "0x").toLowerCase();

  const matchesIntent =
    signer.toLowerCase() === intentRow.from_address.toLowerCase() &&
    parsedTo === intentRow.call_to.toLowerCase() &&
    parsedValue === BigInt(intentRow.call_value) &&
    parsedData === intentRow.call_data.toLowerCase() &&
    parsed.chainId === intentRow.chain_id;

  if (!matchesIntent) {
    return res.status(400).json({ error: "Signed transaction does not match the approved intent." });
  }

  try {
    const publicClient = getPublicClient(intentRow.network as SupportedNetwork);
    const txHash = await publicClient.sendRawTransaction({ serializedTransaction });

    await markWalletIntentRelayed(intentRow.id, txHash);

    const userRow = await findUserById(userId);
    const transactionRow = await createWalletTransaction({
      userId,
      merchantEmail: userRow?.email,
      type: "withdrawal",
      network: intentRow.network,
      asset: intentRow.asset,
      tokenContractAddress: intentRow.token_contract_address || null,
      amount: intentRow.amount,
      fromAddress: intentRow.from_address,
      toAddress: intentRow.to_address,
      txHash,
      status: "pending",
    });

    return res.json({ ok: true, txHash, transaction: transactionRow });
  } catch (error) {
    console.error("Relay failed to broadcast", error);
    return res.status(502).json({ error: "Failed to broadcast transaction." });
  }
}
