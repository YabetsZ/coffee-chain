import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorMiddleware";
import { verifyTokenService } from "../services/authService";
import logger from "../utils/logger";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        logger.info(`${authHeader}`);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authentication required", 401);
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const verification = verifyTokenService(token);
        if (!verification.valid || !verification.user?.name) {
            throw new AppError("Invalid or expired token", 401);
        }

        // Add user info to request object
        req.user = {
            ...verification.user,
        };

        next();
    } catch (error) {
        logger.error(`Failed to authenticate user.`);
        next(error);
    }
};
