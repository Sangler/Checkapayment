import crypto from "crypto";
import type { Request, Response } from "express";
import { createUser, findUserByEmail, findUserById } from "../models/Users";
import {
  deleteSession,
  deleteTemporaryValue,
  getTemporaryValue,
  saveSession,
  saveTemporaryValue,
} from "../services/authStore";
import { getDummyHash, hashPassword, verifyPassword } from "../services/passwordService";
import {
  ONBOARDING_SESSION_TTL_SECONDS,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  signSessionToken,
  verifySessionToken,
} from "../services/tokenService";

function sanitizeUser(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone_number
      ? { countryCode: row.phone_country_code ?? null, phoneNumber: row.phone_number }
      : null,
    emailVerified: Boolean(row.email_verified),
    phoneVerified: Boolean(row.phone_verified),
    KYCStatus: row.kyc_status,
    referralCode: row.referral_code,
    points: row.points,
    createdAt: row.created_at,
    dateOfBirth: row.date_of_birth,
    isBusinessAccount: Boolean(row.is_business_account),
    employmentStatus: row.employment_status,
    jobTitle: row.job_title,
    businessName: row.business_name,
    businessType: row.business_type,
    address: {
      street: row.street,
      addressLine2: row.address_line2,
      postalCode: row.postal_code,
      city: row.city,
      province: row.province,
      country: row.country,
    },
  };
}

function setSessionCookie(res: Response, token: string, ttlSeconds: number) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ttlSeconds * 1000,
    path: "/",
  });
}

async function createSessionForUser(res: Response, userId: number | string, ttlSeconds: number = SESSION_TTL_SECONDS) {
  const sessionId = crypto.randomUUID();
  await saveSession(sessionId, userId, ttlSeconds);
  const token = signSessionToken({ sub: String(userId), sid: sessionId }, ttlSeconds);
  setSessionCookie(res, token, ttlSeconds);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const userRow = await findUserByEmail(String(email).trim().toLowerCase());

  // Always run a bcrypt compare, even when the account doesn't exist or has
  // no password set, so response timing doesn't leak whether the email is
  // registered (OWASP: user enumeration prevention).
  const isValid = userRow?.password_hash
    ? await verifyPassword(password, userRow.password_hash)
    : await verifyPassword(password, await getDummyHash());

  if (!userRow || !userRow.password_hash || !isValid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  await createSessionForUser(res, userRow.id);

  return res.json({
    ok: true,
    message: "Signed in successfully.",
    user: sanitizeUser(userRow),
  });
}

export async function register(req: Request, res: Response) {
  const { firstName, lastName, entity, email, password, volume, accountType } = req.body ?? {};

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Please complete all required registration fields." });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await hashPassword(password);
  const userRow = await createUser({
    email: normalizedEmail,
    firstName,
    lastName,
    passwordHash,
    authProvider: "local",
    IsBusinessAccount: accountType === "business",
  });

  // Grants a short-lived session so the user can complete /collect-info without
  // logging in again, without leaving a long-lived credential sitting in Redis.
  await createSessionForUser(res, userRow.id, ONBOARDING_SESSION_TTL_SECONDS);

  return res.status(201).json({
    ok: true,
    message: "Registration request received. Backend connection is working.",
    redirectTo: "/collect-info",
    user: { ...sanitizeUser(userRow), entity, volume: volume ?? "< $250k" },
  });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "Please provide the operator email." });
  }

  return res.json({
    ok: true,
    message: "Recovery link request received. Backend connection is working.",
    user: { email },
  });
}

export async function sendOtp(req: Request, res: Response) {
  const { email, factor = "otp" } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const key = `auth:${factor}:${String(email).toLowerCase()}`;

  await saveTemporaryValue(key, code, 300);

  return res.json({
    ok: true,
    message: "Temporary verification code stored.",
    code,
    factor,
    expiresInSeconds: 300,
  });
}

export async function verifyOtp(req: Request, res: Response) {
  const { email, factor = "otp", code } = req.body ?? {};

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required." });
  }

  const key = `auth:${factor}:${String(email).toLowerCase()}`;
  const storedCode = await getTemporaryValue(key);

  if (!storedCode) {
    return res.status(404).json({ error: "Verification code expired or not found." });
  }

  if (storedCode !== String(code)) {
    return res.status(401).json({ error: "Invalid verification code." });
  }

  await deleteTemporaryValue(key);

  return res.json({ ok: true, message: "Verification code accepted." });
}

export async function me(req: Request, res: Response) {
  const userRow = await findUserById(Number(req.userId));

  if (!userRow) {
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return res.status(401).json({ error: "Session is no longer valid." });
  }

  return res.json({ ok: true, user: sanitizeUser(userRow) });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (token) {
    const payload = verifySessionToken(token);
    if (payload?.sid) {
      await deleteSession(payload.sid);
    }
  }

  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  return res.json({ ok: true, message: "Signed out." });
}
