import { Router } from "express";
import * as authController from "../controllers/authController";
import * as pinController from "../controllers/pinController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/google", authController.startGoogleAuth);
router.get("/google/callback", authController.googleCallback);
router.get("/facebook", authController.startFacebookAuth);
router.get("/facebook/callback", authController.facebookCallback);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/otp/send", authController.sendOtp);
router.post("/otp/verify", authController.verifyOtp);

router.get("/me", requireAuth, authController.me);
router.post("/logout", authController.logout);

router.post("/pin/set", requireAuth, pinController.setPin);
router.post("/pin/verify", requireAuth, pinController.verifyPinStepUp);

export default router;
