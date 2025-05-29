import { Router } from "express";
import { getAllUsers } from "../controllers/adminController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/allUsers", authenticate, getAllUsers);

export default router;
