import bcrypt from "bcryptjs";
import crypto from "crypto";

const BCRYPT_ROUNDS = 12;

/**
 * Optional secret pepper (kept in server config, never stored in the DB)
 * mixed into the password before bcrypt hashing. This adds a layer of
 * defense if the password hash table is ever leaked without the app config.
 */
function applyPepper(password: string): string {
  const pepper = process.env.PASSWORD_PEPPER;
  if (!pepper) {
    return password;
  }
  return crypto.createHmac("sha256", pepper).update(password).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(applyPepper(password), BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(applyPepper(password), passwordHash);
}

// A precomputed hash of a value nobody will ever type, used to keep the
// bcrypt comparison time constant whether or not an account exists. This
// prevents "user enumeration via response timing" attacks on /auth/login.
let dummyHashPromise: Promise<string> | null = null;
export function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword("dummy-password-for-constant-time-compare");
  }
  return dummyHashPromise;
}
