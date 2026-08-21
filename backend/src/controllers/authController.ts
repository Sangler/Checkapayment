import crypto from "crypto";
import type { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserById,
  linkSocialAccount,
  updateUserBusinessAccount,
  updateUserEvmAddress,
} from "../models/Users";
import {
  deleteSession,
  deleteTemporaryValue,
  getTemporaryValue,
  saveSession,
  saveTemporaryValue,
} from "../services/authStore";
import { getDummyHash, hashPassword, verifyPassword } from "../services/passwordService";
import { provisionEvmAddress } from "../services/walletService";
import {
  ONBOARDING_SESSION_TTL_SECONDS,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  signSessionToken,
  verifySessionToken,
} from "../services/tokenService";

export function sanitizeUser(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    authSubjectId: row.auth_subject_id ?? null,
    evmAddress: row.evm_address ?? null,
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

function setOAuthStateCookie(res: Response, key: string, state: string) {
  res.cookie(key, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
    path: "/",
  });
}

function getFrontendOrigin() {
  return (process.env.FRONTEND_URL || "http://localhost:8080").split(",")[0]?.trim() || "http://localhost:8080";
}

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "zoho.com",
  "mail.com",
  "yandex.com",
]);

function redirectToLoginWithError(res: Response, message: string, missingFields: string[] = []) {
  const loginUrl = new URL("/login", getFrontendOrigin());
  loginUrl.searchParams.set("error", message);
  if (missingFields.length > 0) {
    loginUrl.searchParams.set("missing", missingFields.join(","));
  }
  return res.redirect(loginUrl.toString());
}

function getEmailDomain(email: string) {
  const [, domain = ""] = email.split("@");
  return domain.trim().toLowerCase();
}

function isBusinessEmail(email: string) {
  const domain = getEmailDomain(email);
  return domain.length > 0 && !PERSONAL_EMAIL_DOMAINS.has(domain);
}

export async function createSessionForUser(res: Response, userId: number | string, ttlSeconds: number = SESSION_TTL_SECONDS) {
  const sessionId = crypto.randomUUID();
  await saveSession(sessionId, userId, ttlSeconds);
  const token = signSessionToken({ sub: String(userId), sid: sessionId }, ttlSeconds);
  setSessionCookie(res, token, ttlSeconds);
}

/**
 * Every user row gets exactly one EVM address, derived once from its
 * permanent `auth_subject_id` and persisted to `users.evm_address`. Safe to
 * call on every login/register - it's a no-op once the address is already
 * set, which also lazily backfills accounts created before this existed.
 */
async function ensureWalletProvisioned(userRow: any) {
  if (!userRow || userRow.evm_address || !userRow.auth_subject_id) {
    return userRow;
  }

  try {
    const { address } = provisionEvmAddress(userRow.auth_subject_id);
    return (await updateUserEvmAddress(userRow.id, address)) || userRow;
  } catch (error) {
    console.error("Wallet provisioning failed for user", userRow.id, error);
    return userRow;
  }
}

export async function startGoogleAuth(req: Request, res: Response) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: "Google OAuth is not configured yet." });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

export async function googleCallback(req: Request, res: Response) {
  const code = req.query.code;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!code || typeof code !== "string" || !redirectUri) {
    return res.status(400).json({ error: "Google OAuth callback is missing required parameters." });
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    const tokenData = (await tokenResponse.json()) as { access_token?: string; error?: string; error_description?: string };

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token exchange failed", tokenData);
      return res.status(502).json({ error: "Unable to finish Google sign-in." });
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = (await profileResponse.json()) as {
      sub?: string;
      email?: string;
      given_name?: string;
      family_name?: string;
      name?: string;
      email_verified?: boolean;
    };

    if (!profile.email) {
      return res.status(400).json({ error: "Google did not return an email address." });
    }

    const normalizedEmail = String(profile.email).trim().toLowerCase();
    let userRow = await findUserByEmail(normalizedEmail);

    if (!userRow) {
      userRow = await createUser({
        email: normalizedEmail,
        firstName: profile.given_name || profile.name?.split(" ")[0] || "Google",
        lastName: profile.family_name || profile.name?.split(" ").slice(1).join(" ") || "User",
        authProvider: "google",
        googleId: profile.sub || null,
        emailVerified: Boolean(profile.email_verified),
        IsBusinessAccount: false,
      });
    } else if (!userRow.google_id && profile.sub) {
      userRow = await linkSocialAccount(normalizedEmail, "google", profile.sub);
    }

    if (!userRow) {
      return res.status(500).json({ error: "Unable to create or update your account." });
    }

    userRow = await ensureWalletProvisioned(userRow);

    await createSessionForUser(res, userRow.id);

    const frontendOrigin = getFrontendOrigin();
    const redirectTarget = new URL("/dashboard", frontendOrigin);
    return res.redirect(redirectTarget.toString());
  } catch (error) {
    console.error("Google callback failed", error);
    return res.status(500).json({ error: "Google sign-in failed." });
  }
}

export async function startFacebookAuth(req: Request, res: Response) {
  const clientId = process.env.FACEBOOK_OAUTH_CLIENT_ID;
  const redirectUri = process.env.FACEBOOK_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: "Facebook OAuth is not configured yet." });
  }

  const state = crypto.randomBytes(24).toString("hex");
  setOAuthStateCookie(res, "fb_oauth_state", state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "email,public_profile,user_birthday,user_link",
    response_type: "code",
    state,
  });

  return res.redirect(`https://www.facebook.com/v25.0/dialog/oauth?${params.toString()}`);
}

export async function facebookCallback(req: Request, res: Response) {
  const code = req.query.code;
  const state = req.query.state;
  const redirectUri = process.env.FACEBOOK_OAUTH_REDIRECT_URI;

  const storedState = req.cookies?.fb_oauth_state;
  res.clearCookie("fb_oauth_state", { path: "/" });

  if (!state || typeof state !== "string" || !storedState || state !== storedState) {
    return redirectToLoginWithError(res, "Facebook sign-in was cancelled or expired.");
  }

  if (!code || typeof code !== "string" || !redirectUri) {
    return redirectToLoginWithError(res, "Facebook OAuth callback is missing required parameters.");
  }

  try {
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v25.0/oauth/access_token?client_id=${encodeURIComponent(process.env.FACEBOOK_OAUTH_CLIENT_ID || "")}&client_secret=${encodeURIComponent(process.env.FACEBOOK_OAUTH_CLIENT_SECRET || "")}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${encodeURIComponent(code)}`
    );

    const tokenData = (await tokenResponse.json()) as { access_token?: string; error?: { message?: string } };

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Facebook token exchange failed", tokenData);
      return redirectToLoginWithError(res, tokenData.error?.message || "Unable to finish Facebook sign-in.");
    }

    const profileResponse = await fetch(
      `https://graph.facebook.com/v25.0/me?fields=id,name,email,birthday,link&access_token=${encodeURIComponent(tokenData.access_token)}`
    );

    const profile = (await profileResponse.json()) as {
      id?: string;
      name?: string;
      email?: string;
      birthday?: string;
      link?: string;
      error?: { message?: string };
    };

    if (!profileResponse.ok || profile.error) {
      console.error("Facebook profile fetch failed", profile);
      return redirectToLoginWithError(res, profile.error?.message || "Unable to read Facebook profile.");
    }

    if (!profile.email || typeof profile.email !== "string" || profile.email.trim().length === 0) {
      return redirectToLoginWithError(res, "Facebook did not return an email address.", ["email"]);
    }

    const normalizedEmail = String(profile.email).trim().toLowerCase();
    const isBusinessAccount = isBusinessEmail(normalizedEmail);
    let userRow = await findUserByEmail(normalizedEmail);

    if (userRow) {
      const missingLinkFields = ["id", "link"].filter((field) => {
        const value = profile[field as keyof typeof profile];
        return typeof value !== "string" || value.trim().length === 0;
      });

      if (missingLinkFields.length > 0) {
        return redirectToLoginWithError(
          res,
          "Facebook login requires Facebook id and profile link to connect to your existing account.",
          missingLinkFields
        );
      }

      userRow = await linkSocialAccount(normalizedEmail, "facebook", profile.id!, profile.link!);

      if (userRow && Boolean(userRow.is_business_account) !== isBusinessAccount) {
        userRow = (await updateUserBusinessAccount(normalizedEmail, isBusinessAccount)) || userRow;
      }

      if (!userRow) {
        return redirectToLoginWithError(res, "Unable to connect Facebook to your existing account.");
      }

      userRow = await ensureWalletProvisioned(userRow);

      await createSessionForUser(res, userRow.id);

      const frontendOrigin = getFrontendOrigin();
      const redirectTarget = new URL("/dashboard", frontendOrigin);
      return res.redirect(redirectTarget.toString());
    }

    const missingFields = ["id", "name", "email", "birthday", "link"].filter((field) => {
      const value = profile[field as keyof typeof profile];
      return typeof value !== "string" || value.trim().length === 0;
    });

    if (missingFields.length > 0) {
      return redirectToLoginWithError(
        res,
        "Facebook login requires email, birthday, profile link, and public profile access.",
        missingFields
      );
    }

    if (!userRow) {
      const [firstName = "Facebook", ...rest] = (profile.name || "Facebook User").split(" ");
      userRow = await createUser({
        email: normalizedEmail,
        firstName,
        lastName: rest.join(" ") || "User",
        authProvider: "facebook",
        facebookId: profile.id || null,
        facebookURL: profile.link || null,
        emailVerified: true,
        IsBusinessAccount: isBusinessAccount,
      });
    }

    if (userRow && Boolean(userRow.is_business_account) !== isBusinessAccount) {
      userRow = (await updateUserBusinessAccount(normalizedEmail, isBusinessAccount)) || userRow;
    }

    if (!userRow) {
      return redirectToLoginWithError(res, "Unable to create or update your account.");
    }

    userRow = await ensureWalletProvisioned(userRow);

    await createSessionForUser(res, userRow.id);

    const frontendOrigin = getFrontendOrigin();
    const redirectTarget = new URL("/dashboard", frontendOrigin);
    return res.redirect(redirectTarget.toString());
  } catch (error) {
    console.error("Facebook callback failed", error);
    return redirectToLoginWithError(res, "Facebook sign-in failed.");
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  let userRow = await findUserByEmail(String(email).trim().toLowerCase());

  // Always run a bcrypt compare, even when the account doesn't exist or has
  // no password set, so response timing doesn't leak whether the email is
  // registered (OWASP: user enumeration prevention).
  const isValid = userRow?.password_hash
    ? await verifyPassword(password, userRow.password_hash)
    : await verifyPassword(password, await getDummyHash());

  if (!userRow || !userRow.password_hash || !isValid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  userRow = await ensureWalletProvisioned(userRow);

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
  let userRow = await createUser({
    email: normalizedEmail,
    firstName,
    lastName,
    passwordHash,
    authProvider: "local",
    IsBusinessAccount: accountType === "business",
  });

  userRow = await ensureWalletProvisioned(userRow);

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
  let userRow = await findUserById(Number(req.userId));

  if (!userRow) {
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return res.status(401).json({ error: "Session is no longer valid." });
  }

  userRow = await ensureWalletProvisioned(userRow);

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
