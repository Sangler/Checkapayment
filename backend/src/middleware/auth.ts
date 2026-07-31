import type { NextFunction, Request, Response } from "express";
import { getSessionUserId } from "../services/authStore";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../services/tokenService";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      sessionId?: string;
    }
  }
}

/**
 * Verifies the `session_token` HTTP-only cookie and confirms the session is
 * still active (i.e. hasn't been revoked by logout or expired out of the
 * session store). On success attaches `req.userId` / `req.sessionId`.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return res.status(401).json({ error: "Session is invalid or has expired." });
  }

  const activeUserId = await getSessionUserId(payload.sid);
  if (!activeUserId || activeUserId !== payload.sub) {
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return res.status(401).json({ error: "Session is no longer active." });
  }

  req.userId = payload.sub;
  req.sessionId = payload.sid;
  next();
}
