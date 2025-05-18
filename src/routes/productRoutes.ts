import { Router } from "express";
import {
    getProductById,
    addProduct,
    addStageToProduct,
    getAllProductsInChain,
    getProductChain,
} from "../controllers/productController";
import { validateProduct } from "../middlewares/validateProduct";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticate, validateProduct, addProduct);
router.get("/:chainId", authenticate, getAllProductsInChain);
router.post("/:chainId/stage", authenticate, addStageToProduct);
router.get("/:chainId/:id", getProductById);
router.get("/:chainId/:id/all", getProductChain);

export default router;
