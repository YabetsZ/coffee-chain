import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    addProduct,
    addStageToProduct,
} from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.post("/", addProduct);
router.get("/:id", getProductById);
router.post("/:id/stage", addStageToProduct);

export default router;
