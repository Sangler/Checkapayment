import * as crypto from 'crypto';
import { query } from '../db/postgres';

export const userSchema = {
  KYCStatus: { type: 'string', default: 'pending' },
  KYCReference: { type: 'string' },
  KYCRejectionCount: { type: 'number', default: 0 },
  KyCDocumentUrl: { type: 'string' },
  lastKycGeo: {
    raw: { type: 'string' },
    iso2: { type: 'string' },
  },
  identityKey: { type: 'string' },
  email: { type: 'string', required: true },
  phone: {
    countryCode: { type: 'string' },
    phoneNumber: { type: 'string' },
  },
  passwordHash: { type: 'string' },
  authProvider: { type: 'string', default: 'local' },
  googleId: { type: 'string' },
  appleIOSId: { type: 'string' },
  emailVerified: { type: 'boolean', default: false },
  phoneVerified: { type: 'boolean', default: false },
  // Personal Info
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  preferredName: { type: 'string' },
  dateOfBirth: { type: 'date', default: null },
  
  // COMPLIANCE & BILLING
  taxIdNumber: { type: 'string' }, // CRA Business Number

  //Career & Business Info
  IsBusinessAccount: { type: 'boolean', default: false },
  employmentStatus: { type: 'string' },
  jobTitle: { type: 'string' },
  businessName: { type: 'string' },
  businessType: { type: 'string' },
  address: {
    street: { type: 'string' },
    addressLine2: { type: 'string' },
    postalCode: { type: 'string' },
    city: { type: 'string' },
    province: { type: 'string' },
    country: { type: 'string' },
  },

  // PLATFORM METRICS
  referralCode: { type: 'string' },
  referredBy: { type: 'number' },
  points: { type: 'number', default: 0 },
  
  cryptoPublicKey: { type: 'string' },
  walletProvider: { type: 'string', default: 'privy' }, 

  createdAt: { type: 'date', default: null },
  updatedAt: { type: 'date', default: null },
};

function generateReferralCode(bytes = 10) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const buf = crypto.randomBytes(bytes);
  let code = '';
  for (let i = 0; i < buf.length; i += 1) {
    code += alphabet[buf[i] % alphabet.length];
  }
  return code;
}

export async function ensureReferralCode(userData: any) {
  if (userData.referralCode) return userData.referralCode;

  let attempts = 0;
  let referralCode = '';

  while (attempts < 5) {
    const candidate = generateReferralCode(10);
    const exists = await query('SELECT 1 FROM users WHERE referral_code = $1 LIMIT 1', [candidate]);
    if (exists.rowCount === 0) {
      referralCode = candidate;
      break;
    }
    attempts += 1;
  }

  if (!referralCode) {
    referralCode = `${generateReferralCode(4)}${Date.now().toString().slice(-4)}`;
  }

  return referralCode;
}

export async function createUser(userData: any) {
  const referralCode = await ensureReferralCode(userData);
  const now = new Date();

  const values = [
    userData.KYCStatus || 'pending',
    userData.KYCReference || null,
    userData.KYCRejectionCount || 0,
    userData.KyCDocumentUrl || null,
    userData.email,
    userData.phone?.phoneNumber || null,
    userData.phone?.countryCode || null,
    userData.firstName,
    userData.lastName,
    userData.preferredName || null,
    userData.dateOfBirth || null,
    userData.address?.street || null,
    userData.address?.addressLine2 || null,
    userData.address?.postalCode || null,
    userData.address?.city || null,
    userData.address?.province || null,
    userData.address?.country || null,
    userData.lastKycGeo?.raw || null,
    userData.lastKycGeo?.iso2 || null,
    userData.IsBusinessAccount || false,
    userData.employmentStatus || null,
    userData.jobTitle || null,
    userData.businessName || null,
    userData.businessType || null,
    userData.taxIdNumber || null,
    userData.passwordHash || null,
    userData.authProvider || 'local',
    userData.googleId || null,
    userData.emailVerified || false,
    userData.phoneVerified || false,
    referralCode,
    userData.referredBy || null,
    userData.points || 0,
    userData.identityKey || null,
    now,
    now,
  ];

  const result = await query(`
    INSERT INTO users (
      kyc_status, kyc_reference, kyc_rejection_count, kyc_document_url, email, phone_number, phone_country_code,
      first_name, last_name, preferred_name, date_of_birth, street, address_line2, postal_code, city,
      province, country, last_kyc_geo_raw, last_kyc_geo_iso2, is_business_account, employment_status, job_title,
      business_name, business_type, tax_id_number, password_hash, auth_provider, google_id, email_verified,
      phone_verified, referral_code, referred_by, points, identity_key, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36
    ) RETURNING *
  `, values);

  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return result.rows[0] || null;
}

export async function findUserById(id: number) {
  const result = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0] || null;
}
