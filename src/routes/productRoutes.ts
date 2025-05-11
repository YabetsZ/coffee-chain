import { Router } from "express";
import {
    getProductById,
    addProduct,
    addStageToProduct,
    getAllProductsInChain,
} from "../controllers/productController";
import { validateProduct } from "../middlewares/validateProduct";
import { validateJourneyStage } from "../middlewares/validateJourneyStage";

const router = Router();

router.post("/", validateProduct, addProduct);
router.get("/:chainId", getAllProductsInChain);
router.post("/:chainId/stage", validateJourneyStage, addStageToProduct);
router.get("/:chainId/:id", getProductById);

export default router;
