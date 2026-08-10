import type { Request, Response } from "express";
import { sanitizeUser, createSessionForUser } from "./authController";
import { findUserByEmail, findUserById } from "../models/Users";
import {
  createWebauthnCredential,
  findCredentialByCredentialId,
  findCredentialsByUserId,
  updateCredentialCounter,
} from "../models/WebauthnCredentials";
import { deleteTemporaryValue, getTemporaryValue, saveTemporaryValue } from "../services/authStore";
import { issueTxAuthToken } from "../services/txAuthService";
import {
  buildAuthenticationOptions,
  buildRegistrationOptions,
  verifyAuthentication,
  verifyRegistration,
} from "../services/webauthnService";

const CHALLENGE_TTL_SECONDS = 300;

function registrationChallengeKey(userId: number) {
  return `webauthn:reg:${userId}`;
}

function authChallengeKey(email: string) {
  return `webauthn:auth:${email}`;
}

function stepUpChallengeKey(userId: number) {
  return `webauthn:stepup:${userId}`;
}

/**
 * Step 1 of adding a passkey to an *already logged-in* account: generates
 * WebAuthn registration options for the browser's navigator.credentials.create().
 * Requires requireAuth - a passkey is always attached to an existing users.id,
 * never used to create one.
 */
export async function registerOptions(req: Request, res: Response) {
  const userId = Number(req.userId);
  const userRow = await findUserById(userId);

  if (!userRow) {
    return res.status(401).json({ error: "Session is no longer valid." });
  }

  const existingCredentials = (await findCredentialsByUserId(userId)).map((row: any) => ({
    credentialId: row.credential_id,
    transports: row.transports,
  }));

  const options = await buildRegistrationOptions({
    userId,
    email: userRow.email,
    displayName: `${userRow.first_name} ${userRow.last_name}`.trim(),
    existingCredentials,
  });

  await saveTemporaryValue(registrationChallengeKey(userId), options.challenge, CHALLENGE_TTL_SECONDS);

  return res.json({ ok: true, options });
}

/**
 * Step 2: verifies the browser's attestation response and stores the new
 * credential row, linked to the already-authenticated req.userId.
 */
export async function registerVerify(req: Request, res: Response) {
  const userId = Number(req.userId);
  const { response, deviceLabel } = req.body ?? {};

  if (!response) {
    return res.status(400).json({ error: "Missing WebAuthn registration response." });
  }

  const expectedChallenge = await getTemporaryValue(registrationChallengeKey(userId));
  if (!expectedChallenge) {
    return res.status(400).json({ error: "Registration challenge expired. Please try again." });
  }

  try {
    const verification = await verifyRegistration({ response, expectedChallenge });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ error: "Passkey registration could not be verified." });
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    await createWebauthnCredential({
      userId,
      credentialId: credential.id,
      publicKey: Buffer.from(credential.publicKey).toString("base64url"),
      counter: credential.counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      transports: (credential.transports || []).join(","),
      deviceLabel: deviceLabel || null,
    });

    await deleteTemporaryValue(registrationChallengeKey(userId));

    return res.status(201).json({ ok: true, message: "Passkey registered." });
  } catch (error) {
    console.error("WebAuthn registration verification failed", error);
    return res.status(400).json({ error: "Passkey registration failed." });
  }
}

/**
 * Step 3 (public, pre-login): generates authentication options for a given
 * email so the browser can prompt for one of that account's passkeys.
 */
export async function loginOptions(req: Request, res: Response) {
  const { email } = req.body ?? {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userRow = await findUserByEmail(normalizedEmail);

  const allowCredentials = userRow
    ? (await findCredentialsByUserId(userRow.id)).map((row: any) => ({
        credentialId: row.credential_id,
        transports: row.transports,
      }))
    : [];

  const options = await buildAuthenticationOptions({ allowCredentials });

  await saveTemporaryValue(authChallengeKey(normalizedEmail), options.challenge, CHALLENGE_TTL_SECONDS);

  return res.json({ ok: true, options });
}

/**
 * Step 4 (public, pre-login): verifies the assertion response and, on
 * success, issues the exact same session cookie/JWT as password/OAuth login
 * via createSessionForUser - the user's auth_subject_id and evm_address are
 * untouched, since a passkey only proves control of an existing account.
 */
export async function loginVerify(req: Request, res: Response) {
  const { email, response } = req.body ?? {};

  if (!email || typeof email !== "string" || !response) {
    return res.status(400).json({ error: "Email and WebAuthn response are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const expectedChallenge = await getTemporaryValue(authChallengeKey(normalizedEmail));

  if (!expectedChallenge) {
    return res.status(400).json({ error: "Login challenge expired. Please try again." });
  }

  const userRow = await findUserByEmail(normalizedEmail);
  const storedCredential = response?.id ? await findCredentialByCredentialId(response.id) : null;

  if (!userRow || !storedCredential || storedCredential.user_id !== userRow.id) {
    return res.status(401).json({ error: "Invalid passkey login." });
  }

  try {
    const verification = await verifyAuthentication({
      response,
      expectedChallenge,
      storedCredential: {
        credentialId: storedCredential.credential_id,
        publicKey: storedCredential.public_key,
        counter: storedCredential.counter,
        transports: storedCredential.transports,
      },
    });

    if (!verification.verified) {
      return res.status(401).json({ error: "Invalid passkey login." });
    }

    await updateCredentialCounter(storedCredential.credential_id, verification.authenticationInfo.newCounter);
    await deleteTemporaryValue(authChallengeKey(normalizedEmail));
    await createSessionForUser(res, userRow.id);

    return res.json({ ok: true, message: "Signed in with passkey.", user: sanitizeUser(userRow) });
  } catch (error) {
    console.error("WebAuthn authentication verification failed", error);
    return res.status(401).json({ error: "Invalid passkey login." });
  }
}

/**
 * Step-up (requireAuth): generates authentication options for the
 * already-logged-in user's own passkeys, to be completed right before a
 * send/withdraw - proves presence of the authenticator again, distinct from
 * the login session itself.
 */
export async function stepUpOptions(req: Request, res: Response) {
  const userId = Number(req.userId);

  const allowCredentials = (await findCredentialsByUserId(userId)).map((row: any) => ({
    credentialId: row.credential_id,
    transports: row.transports,
  }));

  if (allowCredentials.length === 0) {
    return res.status(400).json({ error: "No passkey registered for this account." });
  }

  const options = await buildAuthenticationOptions({ allowCredentials });

  await saveTemporaryValue(stepUpChallengeKey(userId), options.challenge, CHALLENGE_TTL_SECONDS);

  return res.json({ ok: true, options });
}

/**
 * Step-up verify (requireAuth): on success, issues a txAuthToken instead of
 * a new session - this endpoint authorizes one upcoming transaction, it
 * does not log the user in.
 */
export async function stepUpVerify(req: Request, res: Response) {
  const userId = Number(req.userId);
  const { response } = req.body ?? {};

  if (!response) {
    return res.status(400).json({ error: "Missing WebAuthn response." });
  }

  const expectedChallenge = await getTemporaryValue(stepUpChallengeKey(userId));
  if (!expectedChallenge) {
    return res.status(400).json({ error: "Step-up challenge expired. Please try again." });
  }

  const storedCredential = response?.id ? await findCredentialByCredentialId(response.id) : null;
  if (!storedCredential || storedCredential.user_id !== userId) {
    return res.status(401).json({ error: "Invalid passkey." });
  }

  try {
    const verification = await verifyAuthentication({
      response,
      expectedChallenge,
      storedCredential: {
        credentialId: storedCredential.credential_id,
        publicKey: storedCredential.public_key,
        counter: storedCredential.counter,
        transports: storedCredential.transports,
      },
    });

    if (!verification.verified) {
      return res.status(401).json({ error: "Invalid passkey." });
    }

    await updateCredentialCounter(storedCredential.credential_id, verification.authenticationInfo.newCounter);
    await deleteTemporaryValue(stepUpChallengeKey(userId));

    const txAuthToken = await issueTxAuthToken(userId);
    return res.json({ ok: true, txAuthToken, expiresInSeconds: 300 });
  } catch (error) {
    console.error("WebAuthn step-up verification failed", error);
    return res.status(401).json({ error: "Invalid passkey." });
  }
}
