import { Request, Response, NextFunction } from "express";
import { users } from "../database/userData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { registerUser } from "../services/authService";
import { userSchema } from "../schemas/zodSchemas/authSchema";
import { AppError } from "../middlewares/errorMiddleware";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userData = userSchema.safeParse(req.body);
        if (!userData.success) throw new AppError(userData.error.message, 400);

        const newUser = await registerUser(userData.data);

        logger.info(`Registering a user named ${newUser.name} completed.`);
        res.status(201).json({
            success: true,
            data: newUser,
        });
    } catch (error) {
        logger.error("Error registering user:", error);
        next(error);
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = users[username];

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET!, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ username }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });

    res.json({ accessToken, refreshToken });
};

export const refreshToken = (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).json({ message: "Refresh token required" });

    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET!
        ) as any;
        const accessToken = jwt.sign(
            { username: payload.username },
            process.env.JWT_SECRET!,
            {
                expiresIn: "15m",
            }
        );
        res.json({ accessToken });
    } catch (error) {
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.status(200).json({
        message: "Logout successful (client should clear token)",
    });
};
