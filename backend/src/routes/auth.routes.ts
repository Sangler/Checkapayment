import { Router } from "express";
import * as authController from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/otp/send", authController.sendOtp);
router.post("/otp/verify", authController.verifyOtp);

router.get("/me", requireAuth, authController.me);
router.post("/logout", authController.logout);

export default router;
