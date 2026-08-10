import { Router } from "express";
import * as walletController from "../controllers/walletController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/bind", requireAuth, walletController.bindWallet);
router.post("/intent", requireAuth, walletController.createIntent);
router.post("/relay", requireAuth, walletController.relayIntent);

export default router;
