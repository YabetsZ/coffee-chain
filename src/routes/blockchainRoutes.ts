import express from "express";
import {
    getAllBlocks,
    getAllProductsInChain,
    getBlockById,
    verifyChain,
} from "../controllers/blockchainController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, getAllBlocks);
router.get("/:chainId", getAllProductsInChain);
router.get("/:chainId/:blockId", getBlockById);
router.get("/verify/chain/:chainId", verifyChain);

export default router;
