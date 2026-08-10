import { query } from '../db/postgres';

export const requestSchema = {
  userId: { type: 'number' },
  type: { type: 'string' }, // payment_received, withdrawal
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
  status: { type: 'string', default: 'pending' }, // pending, completed, failed
  cryptoAsset: { type: 'string', default: 'USDC' },
  network: { type: 'string', default: 'Base' },

  // THE SPLIT (Math is done on the frontend/API)
  grossAmountCrypto: { type: 'number', required: true }, // Total paid (e.g. 10.00)
  platformFeeCrypto: { type: 'number', required: true }, // Your cut (e.g. 0.05)

  // FIAT ACCOUNTING (For Tax/CRA compliance)
  fiatCurrency: { type: 'string', default: 'CAD' },
  exchangeRateAtExecution: { type: 'number' }, //  Crypto (USDC/USDT/ETH) X CAD at exact time of payment


  // TIMESTAMPS
  createdAt: { type: 'date', default: null },
  settledAt: { type: 'date', default: null }, // Exact time it was confirmed on-chain
};

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

