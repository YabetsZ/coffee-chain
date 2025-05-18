import { Request, Response, NextFunction } from "express";
import { findUserByUsername, users } from "../database/userData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import {
    loginService,
    logoutUserService,
    refreshTokenService,
    registerUserService,
} from "../services/authService";
import {
    loginSchema,
    refreshTokenSchema,
    userSchema,
} from "../schemas/zodSchemas/authSchema";
import { AppError } from "../middlewares/errorMiddleware";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userData = userSchema.safeParse(req.body);
        if (!userData.success)
            throw new AppError("Failed to recieve correct input.", 400);

        const newUser = await registerUserService(userData.data);

        logger.info(`Registering a user named ${newUser.name} completed.`);
        res.status(201).json({
            success: true,
            data: newUser,
        });
    } catch (err: any) {
        logger.error(`Failed to register a user due to ${err.message!}`);
        next(err);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            throw new AppError("Failed to recieve correct input.", 400);
        }
        const { username, role, password } = result.data;

        const recieved = await loginService(username, password, role);
        if (!recieved.success)
            throw new AppError(recieved.message!, recieved.status);

        logger.info(
            `Success to login user named ${username} with role ${role}`
        );
        res.json({
            token: recieved.token,
            refreshToken: recieved.refreshToken,
        });
    } catch (err: any) {
        logger.error(`Failed to login a user due to ${err.message!}`);
        next(err);
    }
};

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const result = refreshTokenSchema.safeParse(req.body);
        if (!result.success) {
            throw new AppError("Failed to recieve correct input.", 400);
        }

        const { refreshToken } = result.data;

        const {
            success,
            token,
            refreshToken: newRefreshToken,
            message,
        } = await refreshTokenService(refreshToken);

        if (!success) throw new AppError(message!, 400);

        logger.info(
            `A refresh token for the user ${req.user?.name} is provided.`
        );
        res.json({ token, refreshToken: newRefreshToken });
    } catch (err: any) {
        logger.error(`Failed to refresh due to ${err.message}`);
        next(err);
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = refreshTokenSchema.safeParse(req.body);
        if (!result.success) throw new AppError("Invalid refresh token.");

        const { refreshToken } = result.data;
        // Invalidate the refresh token
        await logoutUserService(refreshToken);

        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        logger.error("Error logging out user:", error);
        next(error);
    }
};
