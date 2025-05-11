import { addUser, users } from "../database/userData";
import { User } from "../models/User";
import logger from "../utils/logger";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/errorMiddleware";

export const registerUser = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
): Promise<User> => {
    logger.info(`Registering new user: ${userData.email}`);

    // Check if user already exists
    const existingUser = users.find((u) => u.email === userData.email);
    if (existingUser) {
        throw new AppError("User with this email already exists", 400);
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
