import { query } from '../db/postgres';

export const requestSchema = {
  // CORE IDENTIFIERS
  merchantId: { type: 'number', required: true },
  merchantEmail: { type: 'string', required: true },
  merchantReferenceID: { type: 'string', required: true }, // e.g., "Invoice-1042"

  // TRANSACTION STATUS & AMOUNTS
  status: { type: 'string', default: 'pending' }, // pending, completed, failed
  cryptoAsset: { type: 'string', default: 'USDC' },
  network: { type: 'string', default: 'Base' },

  // THE SPLIT (Math is done on the frontend/API)
  grossAmountCrypto: { type: 'number', required: true }, // Total paid (e.g. 10.00)
  platformFeeCrypto: { type: 'number', required: true }, // Your cut (e.g. 0.05)

  // FIAT ACCOUNTING (For Tax/CRA compliance)
  fiatCurrency: { type: 'string', default: 'CAD' },
  exchangeRateAtExecution: { type: 'number' }, //  Crypto (USDC/USDT/ETH/BTC/SOL) X CAD at exact time of payment

  // BLOCKCHAIN VERIFICATION (Immutable snapshot)
  payeePublicAddress: { type: 'string', required: true }, // Merchant's wallet at time of tx
  payerPublicAddress: { type: 'string' }, // Customer's wallet (for refunds/tracking)
  transactionHash: { type: 'string' }, // The TxID (Source of truth)

  // TIMESTAMPS
  createdAt: { type: 'date', default: null },
  settledAt: { type: 'date', default: null }, // Exact time it was confirmed on-chain
};

export async function createTransaction(data: any) {
  const result = await query(
    `INSERT INTO transactions (
      merchant_id, merchant_email, merchant_reference_id, status, crypto_asset, network,
      gross_amount_crypto, platform_fee_crypto, fiat_currency, exchange_rate_at_execution,
      payee_public_address, payer_public_address, transaction_hash, created_at, settled_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), $14) RETURNING *`,
    [
      data.merchantId,
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
  const result = await query('SELECT * FROM transactions WHERE merchant_id = $1 ORDER BY created_at DESC', [merchantId]);
  return result.rows;
}

