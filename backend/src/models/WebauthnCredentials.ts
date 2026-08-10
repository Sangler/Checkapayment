import { query } from "../db/postgres";

export const webauthnCredentialSchema = {
  userId: { type: "number", required: true },
  credentialId: { type: "string", required: true }, // base64url, unique per authenticator
  publicKey: { type: "string", required: true }, // base64url-encoded COSE public key
  counter: { type: "number", default: 0 }, // signature counter, used to detect cloned authenticators
  deviceType: { type: "string" }, // 'singleDevice' | 'multiDevice'
  backedUp: { type: "boolean", default: false },
  transports: { type: "string" }, // comma-separated: usb,ble,nfc,internal
  deviceLabel: { type: "string" }, // user-facing name, e.g. "Windows Hello", "iPhone Face ID"
  createdAt: { type: "date", default: null },
  lastUsedAt: { type: "date", default: null },
};

export async function createWebauthnCredential(data: {
  userId: number;
  credentialId: string;
  publicKey: string;
  counter?: number;
  deviceType?: string | null;
  backedUp?: boolean;
  transports?: string | null;
  deviceLabel?: string | null;
}) {
  const result = await query(
    `INSERT INTO webauthn_credentials (
      user_id, credential_id, public_key, counter, device_type, backed_up, transports, device_label, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
    [
      data.userId,
      data.credentialId,
      data.publicKey,
      data.counter || 0,
      data.deviceType || null,
      data.backedUp || false,
      data.transports || null,
      data.deviceLabel || null,
    ]
  );

  return result.rows[0];
}

export async function findCredentialsByUserId(userId: number) {
  const result = await query(
    "SELECT * FROM webauthn_credentials WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

export async function findCredentialByCredentialId(credentialId: string) {
  const result = await query(
    "SELECT * FROM webauthn_credentials WHERE credential_id = $1 LIMIT 1",
    [credentialId]
  );
  return result.rows[0] || null;
}

export async function updateCredentialCounter(credentialId: string, counter: number) {
  const result = await query(
    `UPDATE webauthn_credentials
     SET counter = $2, last_used_at = NOW()
     WHERE credential_id = $1
     RETURNING *`,
    [credentialId, counter]
  );
  return result.rows[0] || null;
}
