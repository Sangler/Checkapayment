-- CheckAPay database schema
-- Run this once against the "CheckAPay" Postgres database (e.g. via pgAdmin4's
-- Query Tool, or `psql -d CheckAPay -f schema.sql`) to create the tables the
-- backend models in src/models/*.ts expect.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  kyc_status VARCHAR(50) DEFAULT 'pending',
  kyc_reference VARCHAR(255),
  kyc_rejection_count INTEGER DEFAULT 0,
  kyc_document_url TEXT,
  email VARCHAR(255) NOT NULL UNIQUE,
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
  last_kyc_geo_iso2 VARCHAR(2),
  is_business_account BOOLEAN DEFAULT false,
  employment_status VARCHAR(100),
  job_title VARCHAR(150),
  business_name VARCHAR(255),
  business_type VARCHAR(150),
  tax_id_number VARCHAR(50),
  password_hash TEXT,
  auth_provider VARCHAR(50) DEFAULT 'local',
  google_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  referral_code VARCHAR(20) UNIQUE,
  referred_by INTEGER REFERENCES users(id),
  points INTEGER DEFAULT 0,
  identity_key VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Safe to re-run against a database created before these columns existed.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_business_account BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(150);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_type VARCHAR(150);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_id_number VARCHAR(50);


CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  merchant_id INTEGER NOT NULL REFERENCES users(id),
  merchant_email VARCHAR(255) NOT NULL,
  merchant_reference_id VARCHAR(100) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  crypto_asset VARCHAR(20) DEFAULT 'USDC',
  network VARCHAR(50) DEFAULT 'Base',
  gross_amount_crypto NUMERIC(18, 8) NOT NULL,
  platform_fee_crypto NUMERIC(18, 8) NOT NULL,
  fiat_currency VARCHAR(10) DEFAULT 'CAD',
  exchange_rate_at_execution NUMERIC(18, 8),
  payee_public_address VARCHAR(255) NOT NULL,
  payer_public_address VARCHAR(255),
  transaction_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  settled_at TIMESTAMPTZ
);

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

CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_user_id ON support_requests(user_id);
