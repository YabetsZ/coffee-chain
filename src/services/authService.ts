import { addUser, findUserByUsername, users } from "../database/userData";
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
): Promise<User> => {
    logger.info(`Registering new user: ${userData.name}`);

    // Check if user already exists
    const existingUser = findUserByUsername(userData.name);
    if (existingUser) {
        throw new AppError("User with this username already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { password: _, ...others } = userData;
    // Create new user
    const newUser: User = {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        password: hashedPassword,
        ...others,
    };

    // Store user
    addUser(newUser);

    // Return user (excluding password)
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
};

export const loginService = async (
    username: string,
    password: string,
    role: string
): Promise<{
    success: boolean;
    token?: string;
    refreshToken?: string;
    message?: string;
    status?: number;
}> => {
    try {
        const user = findUserByUsername(username);

        if (
            !user ||
            !(await bcrypt.compare(password, user.password)) ||
            user.role !== role
        ) {
            return {
                success: false,
                message: "Invalid credentials",
                status: 401,
            };
        }

        // id, username and role
        const accessToken = jwt.sign(
            { id: user.id, name: username },
            String(JWT_SECRET),
            {
                expiresIn: "15m",
            }
        );
        const refreshToken = jwt.sign(
            { id: user.id, name: username },
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
            name: string;
        };

        const user = findUserByUsername(payload.name);
        if (!user) {
            return { success: false, message: "User no longer exists." };
        }

        // console.log("here 1");
        const newToken = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            String(JWT_SECRET),
            { expiresIn: "15m" }
        );

        // console.log("here 2");
        // Generate new refresh token
        const newRefreshToken = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
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

export const logoutUser = async (token: string) => {
    logger.info("User logout");
    deleteRefreshToken(token);
};
