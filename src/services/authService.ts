import { addUser, findUserByUsername } from "../database/queries/userData";
import users from "../database/schema";
import { User } from "../models/User";
import logger from "../utils/logger";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/errorMiddleware";
import jwt from "jsonwebtoken";
import {
    addRefreshToken,
    checkRefreshToken,
    deleteRefreshToken,
    rotateTokens,
} from "../database/refreshTokens";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const registerUserService = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
) => {
    logger.info(`Registering new user: ${userData.username}`);

    // Check if user already exists
    const existingUser = await findUserByUsername(userData.username);
    if (existingUser) {
        throw new AppError("User with this username already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { password: _, ...others } = userData;

    const registeredUser = await addUser({
        password: hashedPassword,
        ...others,
    });

    // Return user (excluding password)
    const { password, ...userWithoutPassword } = registeredUser;
    return userWithoutPassword;
};

export const loginService = async (
    username: string,
    password: string
): Promise<{
    success: boolean;
    token?: string;
    refreshToken?: string;
    message?: string;
    status?: number;
}> => {
    try {
        const user = await findUserByUsername(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return {
                success: false,
                message: "Invalid credentials",
                status: 401,
            };
        }

        // id, username and role
        const accessToken = jwt.sign(
            { id: user.id, username, role: user.role },
            String(JWT_SECRET),
            {
                expiresIn: "15m",
            }
        );
        const refreshToken = jwt.sign(
            { id: user.id, username, role: user.role },
            String(JWT_REFRESH_SECRET),
            {
                expiresIn: "7d",
            }
        );

        await addRefreshToken(refreshToken);
        return { success: true, token: accessToken, refreshToken };
    } catch (err: any) {
        const isDev = process.env.NODE_ENV === "development";
        return {
            success: false,
            message: err.message,
            status: 500,
        };
    }
};

export const refreshTokenService = async (
    refreshToken: string
): Promise<{
    success: boolean;
    token?: string;
    refreshToken?: string;
    message?: string;
    status?: number;
}> => {
    logger.info("Token refresh attempt");

    if (!checkRefreshToken(refreshToken)) {
        return { success: false, message: "Expired refresh token!" };
    }

    try {
        const payload = jwt.verify(
            refreshToken,
            String(JWT_REFRESH_SECRET)
        ) as {
            id: string;
            username: string;
            role: string;
        };

        const user = await findUserByUsername(payload.username);
        if (!user) {
            return { success: false, message: "User no longer exists." };
        }

        // console.log("here 1");
        const newToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            String(JWT_SECRET),
            { expiresIn: "15m" }
        );

        // console.log("here 2");
        // Generate new refresh token
        const newRefreshToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            String(JWT_REFRESH_SECRET),
            { expiresIn: "7d" }
        );

        rotateTokens(refreshToken, newRefreshToken);

        return {
            success: true,
            token: newToken,
            refreshToken: newRefreshToken,
        };
    } catch (err: any) {
        logger.error("Error refreshing token:", err);
        const isDev = process.env.NODE_ENV === "development";
        return {
            success: false,
            message: isDev ? err.message : "Internal server error",
            status: 500,
        };
    }
};

export const logoutUserService = async (token: string) => {
    logger.info("User logout");
    deleteRefreshToken(token);
};

export const verifyTokenService = async (
    token: string
): Promise<{
    valid: boolean;
    user?: Omit<User, "createdAt" | "password" | "updatedAt">;
    message?: string;
    status?: number;
}> => {
    try {
        const decoded = jwt.verify(token, String(JWT_SECRET)) as {
            id: string;
            name: string;
        };
        const user = await findUserByUsername(decoded.name);
        if (!user) {
            return {
                valid: false,
                message: "User no longer exists.",
                status: 400,
            };
        }
        const { password, createdAt, updatedAt, ...correctForm } = user;
        return {
            valid: true,
            user: correctForm as Omit<
                User,
                "createdAt" | "password" | "updatedAt"
            >,
        };
    } catch (error) {
        logger.error("Token verification failed:", error);
        return {
            valid: false,
            message: "Invalid or expired token.",
            status: 400,
        };
    }
};
