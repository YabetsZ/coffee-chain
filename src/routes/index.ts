import { Router } from "express";
import productRoutes from "./productRoutes";
import blockchainRoutes from "./blockchainRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

let router = Router();

// Health check for the API
router.get("/api", (_req, res) => {
    res.json({
        status: "online",
        message: "CoffeeChain API is running",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});

router.use("/api/products", productRoutes);
router.use("/api/blockchain", blockchainRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);

export default router;
