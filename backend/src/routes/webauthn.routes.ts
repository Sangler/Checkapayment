import { Router } from "express";
import * as webauthnController from "../controllers/webauthnController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Adding a passkey to an already-authenticated account.
router.post("/register-options", requireAuth, webauthnController.registerOptions);
router.post("/register-verify", requireAuth, webauthnController.registerVerify);

// Step-up authorization before a send/withdraw (issues a txAuthToken, not a session).
router.post("/stepup-options", requireAuth, webauthnController.stepUpOptions);
router.post("/stepup-verify", requireAuth, webauthnController.stepUpVerify);

// Signing in with a passkey (pre-login, so no requireAuth).
router.post("/login-options", webauthnController.loginOptions);
router.post("/login-verify", webauthnController.loginVerify);

export default router;
