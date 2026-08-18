import crypto from 'crypto';
import { query } from '../db/postgres';

export const requestSchema = {
  userId: { type: 'number' },
  type: { type: 'string' }, // deposit, withdrawal, invoice_payment
  asset: { type: 'string' }, // ETH, USDC, USDT, EURC, CADC
  tokenContractAddress: { type: 'string' },
  amount: { type: 'string' }, // integer string in smallest unit
  fromAddress: { type: 'string' },
  toAddress: { type: 'string' },
  txHash: { type: 'string' },
  splitterContractAddress: { type: 'string' },
  gasFeePaid: { type: 'string' }, // integer string in smallest unit
  confirmedAt: { type: 'date', default: null },

  // CORE IDENTIFIERS
  merchantId: { type: 'number', required: true },
  merchantEmail: { type: 'string', required: true },
  merchantReferenceID: { type: 'string', required: true }, // e.g., "Invoice-1042"

  // TRANSACTION STATUS & AMOUNTS
  status: { type: 'string', default: 'pending' }, // pending_signature, pending, confirmed, failed, expired
  cryptoAsset: { type: 'string', default: 'USDC' },
  network: { type: 'string', default: 'Base' },

  // THE SPLIT (Math is done on the frontend/API)
  grossAmountCrypto: { type: 'number', required: true }, // Total paid (e.g. 10.00)
  platformFeeCrypto: { type: 'number', required: true }, // Your cut (e.g. 0.05)

  // FIAT ACCOUNTING (For Tax/CRA compliance)
  fiatCurrency: { type: 'string', default: 'CAD' },
  exchangeRateAtExecution: { type: 'number' }, // Crypto X CAD at exact time of payment

  // INTENT METADATA
  chainId: { type: 'number' },
  callTo: { type: 'string' },
  callData: { type: 'string' },
  callValue: { type: 'string' },
  nonce: { type: 'string' },
  expiresAt: { type: 'date', default: null },
  relayedAt: { type: 'date', default: null },

  // TIMESTAMPTZ
  createdAt: { type: 'date', default: null },
  settledAt: { type: 'date', default: null },
};

export interface WalletTransactionRow {
  id: number;
  user_id: number;
  type: string;
  asset: string;
  token_contract_address: string | null;
  amount: string;
  from_address: string;
  to_address: string;
  tx_hash: string | null;
  merchant_email: string;
  merchant_reference_id: string;
  status: string;
  network: string;
  gross_amount_crypto: string;
  platform_fee_crypto: string;
  fiat_currency: string;
  exchange_rate_at_execution: number | null;
  splitter_contract_address: string | null;
  gas_fee_paid: string | null;
  chain_id: number | null;
  call_to: string | null;
  call_data: string | null;
  call_value: string | null;
  nonce: string | null;
  created_at: string;
  expires_at: string | null;
  relayed_at: string | null;
  confirmed_at: string | null;
  tax_rate: number;
  tips_add_on: number;
}

export interface CreateWalletIntentParams {
  userId: number;
  network: string;
  asset: string;
  tokenContractAddress: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  chainId: number;
  callTo: string;
  callData: string;
  callValue: string;
  ttlSeconds: number;
}

/**
 * Creates a new transaction intent record with status = 'pending_signature'.
 * Integrated directly into the transactions table to maintain a single unified ledger.
 */
export async function createWalletIntent(params: CreateWalletIntentParams): Promise<WalletTransactionRow> {
  const {
    userId,
    network,
    asset,
    tokenContractAddress,
    fromAddress,
    toAddress,
    amount,
    chainId,
    callTo,
    callData,
    callValue,
    ttlSeconds,
  } = params;

  const nonce = '0x' + crypto.randomBytes(32).toString('hex');
  const merchantReferenceID = `intent-${network}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

  const result = await query(
    `INSERT INTO transactions (
       user_id, merchant_email, merchant_reference_id,
       type, network, asset, token_contract_address, amount,
       from_address, to_address, chain_id,
       call_to, call_data, call_value, nonce,
       status, expires_at, created_at
     ) VALUES (
       $1, $2, $3,
       'withdrawal', $4, $5, $6, $7,
       $8, $9, $10,
       $11, $12, $13, $14,
       'pending_signature', NOW() + ($15 || ' seconds')::INTERVAL, NOW()
     ) RETURNING *`,
    [
      userId,
      'wallet@local',
      merchantReferenceID,
      network,
      asset,
      tokenContractAddress,
      amount,
      fromAddress,
      toAddress,
      chainId,
      callTo,
      callData,
      callValue,
      nonce,
      ttlSeconds,
    ]
  );

  return result.rows[0] as WalletTransactionRow;
}

/**
 * Looks up a transaction intent by ID.
 */
export async function findWalletIntentById(id: number): Promise<WalletTransactionRow | null> {
  const result = await query('SELECT * FROM transactions WHERE id = $1', [id]);
  return (result.rows[0] as WalletTransactionRow) ?? null;
}

/**
 * Marks a transaction intent as relayed to the blockchain RPC node and sets tx_hash + status = 'pending'.
 */
export async function markWalletIntentRelayed(id: number, txHash: string): Promise<WalletTransactionRow | null> {
  const result = await query(
    `UPDATE transactions
     SET status = 'pending', tx_hash = $2, relayed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, txHash]
  );
  return (result.rows[0] as WalletTransactionRow) ?? null;
}

export async function createTransaction(data: any) {
  const result = await query(
    `INSERT INTO transactions (
      user_id, merchant_email, merchant_reference_id, status, asset, network,
      gross_amount_crypto, platform_fee_crypto, fiat_currency, exchange_rate_at_execution,
      to_address, from_address, tx_hash, created_at, confirmed_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), $14) RETURNING *`,
    [
      data.merchantId || data.userId,
      data.merchantEmail,
      data.merchantReferenceID,
      data.status || 'pending',
      data.cryptoAsset || 'USDC',
      data.network || 'Base',
      data.grossAmountCrypto,
      data.platformFeeCrypto,
      data.fiatCurrency || 'CAD',
      data.exchangeRateAtExecution || null,
      data.payeePublicAddress,
      data.payerPublicAddress || null,
      data.transactionHash || null,
      data.settledAt || null,
    ]
  );

  return result.rows[0];
}

export async function findTransactionsByMerchantId(merchantId: number) {
  const result = await query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [merchantId]);
  return result.rows;
}

export async function createWalletTransaction(data: any) {
  const fallbackReference = `wallet-${data.type || 'tx'}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  const merchantReferenceID = data.merchantReferenceID || fallbackReference;

  const result = await query(
    `INSERT INTO transactions (
      user_id, merchant_email, merchant_reference_id,
      gross_amount_crypto, platform_fee_crypto,
      type, network, asset, token_contract_address, amount,
      from_address, to_address, tx_hash, status, splitter_contract_address,
      gas_fee_paid, created_at, confirmed_at
    ) VALUES (
      $1, $2, $3,
      $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15,
      $16, NOW(), $17
    ) RETURNING *`,
    [
      data.userId,
      data.merchantEmail || data.userEmail || 'wallet@local',
      merchantReferenceID,
      data.grossAmountCrypto || 0,
      data.platformFeeCrypto || 0,
      data.type,
      data.network,
      data.asset,
      data.tokenContractAddress || null,
      data.amount,
      data.fromAddress,
      data.toAddress,
      data.txHash || null,
      data.status || 'pending',
      data.splitterContractAddress || null,
      data.gasFeePaid || null,
      data.confirmedAt || null,
    ]
  );

  return result.rows[0];
}

export async function findTransactionsByUserId(userId: number) {
  const result = await query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}

export async function updateWalletTransactionStatus(id: number, status: 'pending' | 'confirmed' | 'failed', confirmedAt?: string | null) {
  const result = await query(
    `UPDATE transactions
     SET status = $2,
         confirmed_at = CASE WHEN $2 = 'confirmed' THEN COALESCE($3::timestamptz, NOW()) ELSE confirmed_at END
     WHERE id = $1
     RETURNING *`,
    [id, status, confirmedAt || null]
  );
  return result.rows[0] || null;
}
