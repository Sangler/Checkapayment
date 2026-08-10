import { query } from "../db/postgres";
import { findAllUsersWithEvmAddress } from "../models/Users";
import { createWalletTransaction } from "../models/Transactions";
import { getPublicClient, SUPPORTED_NETWORKS, type SupportedNetwork } from "./chainClients";
import { ERC20_ABI, getTrackedTokens, NATIVE_TOKEN_SENTINEL, TRANSFER_EVENT_ABI } from "./tokensConfig";

/**
 * Self-hosted multi-chain balance indexer (per user decision: RPC polling +
 * viem multicall, no managed indexing vendor). Two independent loops per
 * chain:
 *   1. refreshBalances - periodically re-reads every tracked user's balance
 *      (batched via multicall3 for ERC20 tokens) and upserts into `balances`.
 *   2. scanForDeposits - periodically scans new Transfer event logs since
 *      the last indexed block and records incoming deposits in
 *      `transactions`, resuming from `indexer_state` after a restart.
 *
 * Known limitation: this is a single-process setInterval-based poller. It
 * does not coordinate across multiple server instances - running more than
 * one instance would cause duplicate polling work (harmless but wasteful)
 * and, without additional locking, possible duplicate deposit-scan overlap
 * (mitigated by the deterministic merchant_reference_id below, which makes
 * re-processing the same log idempotent).
 */

const BALANCE_POLL_INTERVAL_MS = 30_000;
const DEPOSIT_POLL_INTERVAL_MS = 20_000;
const MAX_BLOCK_RANGE_PER_SCAN = 2000n; // stay under typical provider getLogs range caps
const DEPOSIT_CONFIRMATIONS = 3n; // basic reorg safety - only scan blocks this far behind the tip

let indexerStarted = false;

async function upsertBalance(params: {
  userId: number;
  network: string;
  asset: string;
  tokenContractAddress: string;
  balance: string;
}) {
  const { userId, network, asset, tokenContractAddress, balance } = params;
  await query(
    `INSERT INTO balances (user_id, network, asset, token_contract_address, balance, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (user_id, network, asset, token_contract_address)
     DO UPDATE SET balance = EXCLUDED.balance, updated_at = NOW()`,
    [userId, network, asset, tokenContractAddress, balance]
  );
}

async function getLastIndexedBlock(network: string): Promise<string | null> {
  const result = await query("SELECT last_indexed_block FROM indexer_state WHERE network = $1", [network]);
  return result.rows[0]?.last_indexed_block ?? null;
}

async function setLastIndexedBlock(network: string, lastIndexedBlock: bigint) {
  await query(
    `INSERT INTO indexer_state (network, last_indexed_block, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (network)
     DO UPDATE SET last_indexed_block = EXCLUDED.last_indexed_block, updated_at = NOW()`,
    [network, lastIndexedBlock.toString()]
  );
}

export function startIndexer() {
  if (indexerStarted) return;
  indexerStarted = true;

  for (const network of SUPPORTED_NETWORKS) {
    setInterval(() => {
      refreshBalances(network).catch((error) => console.error(`[indexer:${network}] balance refresh failed`, error));
    }, BALANCE_POLL_INTERVAL_MS);

    setInterval(() => {
      scanForDeposits(network).catch((error) => console.error(`[indexer:${network}] deposit scan failed`, error));
    }, DEPOSIT_POLL_INTERVAL_MS);
  }

  console.log(`[indexer] started for networks: ${SUPPORTED_NETWORKS.join(", ")}`);
}

async function refreshBalances(network: SupportedNetwork) {
  const users = await findAllUsersWithEvmAddress();
  if (users.length === 0) return;

  const publicClient = getPublicClient(network);
  const trackedTokens = getTrackedTokens(network);

  for (const token of trackedTokens) {
    if (token.isNative) {
      await Promise.all(
        users.map(async (user) => {
          try {
            const balance = await publicClient.getBalance({ address: user.evm_address as `0x${string}` });
            await upsertBalance({
              userId: user.id,
              network,
              asset: token.asset,
              tokenContractAddress: NATIVE_TOKEN_SENTINEL,
              balance: balance.toString(),
            });
          } catch (error) {
            console.error(`[indexer:${network}] native balance failed for user ${user.id}`, error);
          }
        })
      );
      continue;
    }

    try {
      const results = await publicClient.multicall({
        contracts: users.map((user) => ({
          address: token.tokenContractAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "balanceOf" as const,
          args: [user.evm_address as `0x${string}`],
        })),
        allowFailure: true,
      });

      await Promise.all(
        results.map(async (result, index) => {
          if (result.status !== "success") return;
          const user = users[index];
          await upsertBalance({
            userId: user.id,
            network,
            asset: token.asset,
            tokenContractAddress: token.tokenContractAddress,
            balance: (result.result as bigint).toString(),
          });
        })
      );
    } catch (error) {
      console.error(`[indexer:${network}] multicall balanceOf failed for ${token.asset}`, error);
    }
  }
}

async function scanForDeposits(network: SupportedNetwork) {
  const users = await findAllUsersWithEvmAddress();
  if (users.length === 0) return;

  const addressToUserId = new Map<string, number>(
    users.map((user) => [(user.evm_address as string).toLowerCase(), user.id as number])
  );
  // Filtering getLogs by indexed `to` keeps the provider-side result count to
  // our own users only - without this, high-volume tokens like USDC on
  // Ethereum mainnet can exceed the RPC's max-results-per-call limit even
  // over a small block range.
  const trackedUserAddresses = users.map((user) => user.evm_address as `0x${string}`);

  const publicClient = getPublicClient(network);
  const trackedErc20Tokens = getTrackedTokens(network).filter((token) => !token.isNative);

  const latestBlock = await publicClient.getBlockNumber();
  const safeLatestBlock = latestBlock > DEPOSIT_CONFIRMATIONS ? latestBlock - DEPOSIT_CONFIRMATIONS : 0n;

  const lastIndexedBlock = await getLastIndexedBlock(network);
  // First run: skip full history and start scanning from the current tip -
  // backfilling every deposit ever made is out of scope for this MVP.
  const fromBlock = lastIndexedBlock ? BigInt(lastIndexedBlock) + 1n : safeLatestBlock;

  if (fromBlock > safeLatestBlock) return; // nothing new yet

  const toBlock =
    fromBlock + MAX_BLOCK_RANGE_PER_SCAN < safeLatestBlock ? fromBlock + MAX_BLOCK_RANGE_PER_SCAN : safeLatestBlock;

  for (const token of trackedErc20Tokens) {
    try {
      const logs = await publicClient.getLogs({
        address: token.tokenContractAddress as `0x${string}`,
        event: TRANSFER_EVENT_ABI,
        args: { to: trackedUserAddresses },
        fromBlock,
        toBlock,
      });

      for (const log of logs) {
        const to = (log.args as any)?.to as string | undefined;
        const from = (log.args as any)?.from as string | undefined;
        const value = (log.args as any)?.value as bigint | undefined;
        if (!to || value === undefined) continue;

        const userId = addressToUserId.get(to.toLowerCase());
        if (!userId) continue; // not one of our users - ignore

        // Deterministic reference derived from the log itself, so
        // re-scanning the same range (e.g. after a restart) safely no-ops
        // via the merchant_reference_id UNIQUE constraint instead of
        // creating duplicate ledger rows.
        const merchantReferenceID = `deposit-${network}-${log.transactionHash}-${log.logIndex}`;

        try {
          await createWalletTransaction({
            userId,
            merchantEmail: "wallet@local",
            merchantReferenceID,
            type: "deposit",
            network,
            asset: token.asset,
            tokenContractAddress: token.tokenContractAddress,
            amount: value.toString(),
            fromAddress: from || null,
            toAddress: to,
            txHash: log.transactionHash,
            status: "confirmed",
            confirmedAt: new Date().toISOString(),
          });
        } catch (error: any) {
          if (error?.code !== "23505") {
            // 23505 = unique_violation (already recorded this deposit) - expected on re-scan, not an error.
            console.error(`[indexer:${network}] failed to record deposit ${log.transactionHash}`, error);
          }
        }
      }
    } catch (error) {
      console.error(`[indexer:${network}] getLogs failed for ${token.asset}`, error);
      return; // don't advance last_indexed_block - retry the same range next tick
    }
  }

  await setLastIndexedBlock(network, toBlock);
}
