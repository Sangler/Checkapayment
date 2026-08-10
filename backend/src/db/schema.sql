-- CheckAPay database schema
-- Run this once (or re-run any time - every statement below is idempotent)
-- against the "CheckAPay" Postgres database (e.g. via pgAdmin4's Query Tool,
-- or `psql -d CheckAPay -f schema.sql`) to create/update the tables the
-- backend models in src/models/*.ts expect.

-- =========================================================================
-- users
-- =========================================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  auth_subject_id VARCHAR(128),
  evm_address VARCHAR(42),
  kyc_status VARCHAR(50) DEFAULT 'pending',
  kyc_reference VARCHAR(255),
  kyc_rejection_count INTEGER DEFAULT 0,
  kyc_document_url TEXT,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30),
  phone_country_code VARCHAR(10),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  preferred_name VARCHAR(100),
  date_of_birth DATE,
  street VARCHAR(255),
  address_line2 VARCHAR(255),
  postal_code VARCHAR(20),
  city VARCHAR(100),
  province VARCHAR(100),
  country VARCHAR(100),
  last_kyc_geo_raw VARCHAR(255),
  last_kyc_geo_iso2 VARCHAR(10),
  is_business_account BOOLEAN DEFAULT false,
  employment_status VARCHAR(100),
  job_title VARCHAR(150),
  business_name VARCHAR(255),
  business_type VARCHAR(100),
  tax_id_number VARCHAR(50),
  password_hash TEXT,
  pincode_hash TEXT,
  auth_provider VARCHAR(30) DEFAULT 'local',
  google_id VARCHAR(255),
  facebook_id VARCHAR(255),
  facebook_url VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  referral_code VARCHAR(30),
  referred_by INTEGER REFERENCES users(id),
  points INTEGER DEFAULT 0,
  identity_key VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Idempotent column additions in case an older version of this table already exists.
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_subject_id VARCHAR(128);
ALTER TABLE users ADD COLUMN IF NOT EXISTS evm_address VARCHAR(42);
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_reference VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_rejection_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_document_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_country_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS street VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS province VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_kyc_geo_raw VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_kyc_geo_iso2 VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_business_account BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS employment_status VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(150);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_type VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_id_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pincode_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(30) DEFAULT 'local';
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS facebook_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS identity_key VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Unique constraints applied separately (not inline) so they can be added
-- safely to a table that may already exist without them.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_key') THEN
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_referral_code_key') THEN
    ALTER TABLE users ADD CONSTRAINT users_referral_code_key UNIQUE (referral_code);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_auth_subject_id ON users(auth_subject_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_evm_address_unique ON users(evm_address) WHERE evm_address IS NOT NULL;

-- =========================================================================
-- transactions
--
-- NOTE: `user_id` is the single owner column for a transaction row - it's
-- used both for "who this merchant-invoice payment is for" and "which
-- wallet this deposit/withdrawal belongs to". There is intentionally no
-- separate merchant_id/crypto_asset/payee_public_address/payer_public_address
-- /transaction_hash/settled_at duplicate columns - those were consolidated
-- into user_id/asset/to_address/from_address/tx_hash/confirmed_at.
-- =========================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type VARCHAR(30),
  asset VARCHAR(20) DEFAULT 'USDC',
  token_contract_address VARCHAR(64),
  amount NUMERIC(78, 0),
  from_address VARCHAR(64),
  to_address VARCHAR(64) NOT NULL,
  tx_hash VARCHAR(80),
  merchant_email VARCHAR(255) NOT NULL,
  merchant_reference_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  network VARCHAR(50) DEFAULT 'Base',
  gross_amount_crypto NUMERIC(18, 8) NOT NULL,
  platform_fee_crypto NUMERIC(18, 8) NOT NULL,
  fiat_currency VARCHAR(10) DEFAULT 'CAD',
  exchange_rate_at_execution NUMERIC(18, 8),
  splitter_contract_address VARCHAR(64),
  gas_fee_paid NUMERIC(78, 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  tax_rate NUMERIC(6, 4) DEFAULT 0,
  tips_add_on NUMERIC(18, 8) DEFAULT 0
);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS type VARCHAR(30);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS asset VARCHAR(20) DEFAULT 'USDC';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS token_contract_address VARCHAR(64);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS amount NUMERIC(78, 0);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS from_address VARCHAR(64);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS to_address VARCHAR(64);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS tx_hash VARCHAR(80);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS splitter_contract_address VARCHAR(64);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS gas_fee_paid NUMERIC(78, 0);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(6, 4) DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS tips_add_on NUMERIC(18, 8) DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'transactions_merchant_reference_id_key') THEN
    ALTER TABLE transactions ADD CONSTRAINT transactions_merchant_reference_id_key UNIQUE (merchant_reference_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_network_asset_status ON transactions(network, asset, status);

-- =========================================================================
-- support_requests
-- =========================================================================
CREATE TABLE IF NOT EXISTS support_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_requests_user_id ON support_requests(user_id);

-- =========================================================================
-- webauthn_credentials
-- One row per registered passkey/authenticator (a user can have several,
-- e.g. one per device: laptop Windows Hello, phone Face ID, security key).
-- auth_subject_id / evm_address on `users` are NEVER derived from these
-- rows - a credential is only a way to prove control of an existing
-- users.id, never a new identity.
-- =========================================================================
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  credential_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  device_type VARCHAR(30),
  backed_up BOOLEAN DEFAULT false,
  transports VARCHAR(255),
  device_label VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'webauthn_credentials_credential_id_key') THEN
    ALTER TABLE webauthn_credentials ADD CONSTRAINT webauthn_credentials_credential_id_key UNIQUE (credential_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_webauthn_credentials_user_id ON webauthn_credentials(user_id);

-- =========================================================================
-- balances
-- Latest known balance per user/network/asset, refreshed by the multi-chain
-- indexer (services/indexerService.ts) via periodic multicall polling.
-- token_contract_address is '' (empty string, not NULL) for a chain's
-- native asset (ETH/MATIC/etc.) so the unique constraint below still works -
-- Postgres treats NULLs as distinct, which would otherwise allow duplicates.
-- =========================================================================
CREATE TABLE IF NOT EXISTS balances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  network VARCHAR(50) NOT NULL,
  asset VARCHAR(20) NOT NULL,
  token_contract_address VARCHAR(64) NOT NULL DEFAULT '',
  balance NUMERIC(78, 0) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'balances_user_network_asset_token_key') THEN
    ALTER TABLE balances ADD CONSTRAINT balances_user_network_asset_token_key
      UNIQUE (user_id, network, asset, token_contract_address);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_balances_user_id ON balances(user_id);

-- =========================================================================
-- indexer_state
-- One row per network, tracking the last block scanned for deposit
-- detection so the indexer can resume where it left off after a restart.
-- =========================================================================
CREATE TABLE IF NOT EXISTS indexer_state (
  network VARCHAR(50) PRIMARY KEY,
  last_indexed_block BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- wallet_intents
-- A short-lived, single-use spending intent the backend issues and the
-- user's own embedded wallet (client-side) signs. /wallet/relay only
-- broadcasts a signature that matches this row's call_to/call_data/
-- call_value/chain_id and recovers to from_address - the backend never
-- holds or derives a private key for the user.
-- =========================================================================
CREATE TABLE IF NOT EXISTS wallet_intents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  network VARCHAR(50) NOT NULL,
  asset VARCHAR(20) NOT NULL,
  token_contract_address VARCHAR(64) NOT NULL DEFAULT '',
  from_address VARCHAR(64) NOT NULL,
  to_address VARCHAR(64) NOT NULL,
  amount NUMERIC(78, 0) NOT NULL,
  chain_id INTEGER NOT NULL,
  call_to VARCHAR(64) NOT NULL,
  call_data TEXT NOT NULL DEFAULT '0x',
  call_value NUMERIC(78, 0) NOT NULL DEFAULT 0,
  nonce VARCHAR(66) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  tx_hash VARCHAR(80),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  relayed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_intents_from_nonce ON wallet_intents(from_address, nonce);
CREATE INDEX IF NOT EXISTS idx_wallet_intents_user_id ON wallet_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_intents_status ON wallet_intents(status);
