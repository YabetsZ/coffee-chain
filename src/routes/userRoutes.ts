import { Router } from "express";
import { getAllUsers } from "../controllers/userController";

const router = Router();

router.get("/all", getAllUsers);

export default router;
