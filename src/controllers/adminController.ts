import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { getAllUsersService } from "../services/adminService";
import { AppError } from "../middlewares/errorMiddleware";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logger.info(`getting all users registered!`);
        if (!req.user || req.user.role.toLowerCase() !== "admin")
            throw new AppError("User must be an admin.", 401);
        const result = await getAllUsersService();
        res.json(result);
    } catch (err) {
        logger.error(
            `User ${
                req.user?.username || "Unknown"
            } tried to get admin's previledge.`
        );
        next(err);
    }
};
