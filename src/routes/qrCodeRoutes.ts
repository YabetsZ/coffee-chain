import { Router } from "express";
import { verifyQrCode } from "../controllers/qrCodeController";

const router = Router();

// Public routes
router.post("/verify", verifyQrCode);
// router.post("/process", processQrScan);

export default router;
