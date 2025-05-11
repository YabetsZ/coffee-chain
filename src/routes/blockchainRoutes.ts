import express from "express";
import {
    getAllBlocks,
    getAllProductsInChain,
    getBlockById,
    verifyChain,
    // createBlock,
} from "../controllers/blockchainController";

const router = express.Router();

router.get("/", getAllBlocks);
router.get("/:chainId", getAllProductsInChain);
router.get("/:chainId/:blockId", getBlockById);
router.get("/verify/chain/:chainId", verifyChain);
// router.post("/", createBlock); // expects a Product object in req.body

export default router;
