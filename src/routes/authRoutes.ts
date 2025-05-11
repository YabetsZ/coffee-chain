import { Router } from "express";
import { register } from "../controllers/authController";

const router = Router();

router.post("/register", register);
// router.post('/login', validateLoginInput, login);
// router.post('/refresh-token', refreshToken);
// router.post('/logout', logout);

export default router;
