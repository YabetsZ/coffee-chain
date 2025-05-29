import { eq } from "drizzle-orm";
import { AppError } from "../../middlewares/errorMiddleware";
import { User } from "../../models/User";
import logger from "../../utils/logger";
import { db } from "../client";
import users from "../schema";

// Helper to add a user
export const addUser = async (
    user: Omit<User, "id" | "createdAt" | "updatedAt">
) => {
    try {
        const newUser = await db
            .insert(users)
            .values({
                name: user.name,
                username: user.username,
                email: user.email,
                organization: user.organization,
                role: user.role,
                password: user.password,
            })
            .returning();

        logger.info(`Inserted user (explicit UUID): ${newUser}`);
        return newUser[0];
    } catch (error: any) {
        throw new AppError(error.message, 500);
    }
};

export const findUserByUsername = async (username: string) => {
    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.username, username));
        if (result.length === 0) {
            return;
        }
        return result[0];
    } catch (err: any) {
        throw new AppError(err.message || "Unexpected DB error", 500);
    }
};

export const getAllUsers = async () => {
    try {
        const result = await db
            .select({
                id: users.id,
                name: users.name,
                username: users.username,
                role: users.role,
                email: users.email,
                organization: users.organization,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(users);
        return result;
    } catch (err: any) {
        throw new AppError(err.message || "Unexpected DB error", 500);
    }
};
