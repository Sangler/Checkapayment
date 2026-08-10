import type { Request, Response } from "express";
import { findUserById, updateUserPincodeHash } from "../models/Users";
import { hashPin, isValidPinFormat, verifyPin } from "../services/pinService";
import { issueTxAuthToken } from "../services/txAuthService";

/**
 * One-time (or update) setup of a 6-digit transaction PIN. Requires an
 * active session - a PIN can only be attached to an existing account, same
 * rule as passkeys: never used to create a new identity.
 */
export async function setPin(req: Request, res: Response) {
  const { pin } = req.body ?? {};

  if (typeof pin !== "string" || !isValidPinFormat(pin)) {
    return res.status(400).json({ error: "PIN must be exactly 6 digits." });
  }

  const userId = Number(req.userId);
  const pincodeHash = await hashPin(pin);
  const userRow = await updateUserPincodeHash(userId, pincodeHash);

  if (!userRow) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.json({ ok: true, message: "PIN saved." });
}

/**
 * Step-up check: verifies the PIN and, on success, issues a short-lived
 * txAuthToken the client must attach to the next send/withdraw request.
 */
export async function verifyPinStepUp(req: Request, res: Response) {
  const { pin } = req.body ?? {};

  if (typeof pin !== "string" || !isValidPinFormat(pin)) {
    return res.status(400).json({ error: "PIN must be exactly 6 digits." });
  }

  const userId = Number(req.userId);
  const userRow = await findUserById(userId);

  if (!userRow?.pincode_hash) {
    return res.status(400).json({ error: "No PIN has been set up for this account." });
  }

  const isValid = await verifyPin(pin, userRow.pincode_hash);
  if (!isValid) {
    return res.status(401).json({ error: "Incorrect PIN." });
  }

  const txAuthToken = await issueTxAuthToken(userId);
  return res.json({ ok: true, txAuthToken, expiresInSeconds: 300 });
}
