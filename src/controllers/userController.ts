import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { getAllUsersService } from "../services/userService";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`getting all users registered!`);
    const result = await getAllUsersService();
    res.json(result);
};
