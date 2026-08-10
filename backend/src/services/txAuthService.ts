import crypto from "crypto";
import { deleteTemporaryValue, getTemporaryValue, saveTemporaryValue } from "./authStore";

/**
 * Short-lived, single-use tokens proving a user just completed a step-up
 * check (PIN or passkey) immediately before a money-moving action. A valid
 * session alone is not enough to authorize a send/withdraw - see
 * controllers/pinController.ts and webauthnController.ts step-up handlers.
 */

const TX_AUTH_TTL_SECONDS = 300;
const TX_AUTH_PREFIX = "txauth:";

export async function issueTxAuthToken(userId: number | string): Promise<string> {
  const token = crypto.randomUUID();
  await saveTemporaryValue(`${TX_AUTH_PREFIX}${token}`, String(userId), TX_AUTH_TTL_SECONDS);
  return token;
}

export async function consumeTxAuthToken(token: string | undefined, userId: number | string): Promise<boolean> {
  if (!token) return false;

  const key = `${TX_AUTH_PREFIX}${token}`;
  const storedUserId = await getTemporaryValue(key);

  if (!storedUserId || storedUserId !== String(userId)) {
    return false;
  }

  await deleteTemporaryValue(key); // single-use
  return true;
}
