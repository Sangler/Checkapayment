import jwt from "jsonwebtoken";

const DEV_FALLBACK_SECRET = "dev-insecure-secret-change-me";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set in production.");
    }
    console.warn("JWT_SECRET is not set; using an insecure development fallback.");
    return DEV_FALLBACK_SECRET;
  }
  return secret;
}

export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours, per the auth architecture.
export const ONBOARDING_SESSION_TTL_SECONDS = 60 * 30; // 30 minutes to complete /collect-info after registering.

export interface SessionTokenPayload {
  sub: string; // user id
  sid: string; // session id (used to look up/revoke the session in Redis)
}

export function signSessionToken(payload: SessionTokenPayload, ttlSeconds: number = SESSION_TTL_SECONDS): string {
  return jwt.sign(payload, getSecret(), { expiresIn: ttlSeconds });
}

export function verifySessionToken(token: string): SessionTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "object" && decoded && "sub" in decoded && "sid" in decoded) {
      return { sub: String((decoded as jwt.JwtPayload).sub), sid: String((decoded as any).sid) };
    }
    return null;
  } catch {
    return null;
  }
}
