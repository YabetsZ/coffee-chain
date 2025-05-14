import { z } from "zod";

export const userSchema = z.object({
    // id: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum([
        "admin",
        "farmer",
        "processor",
        "distributor",
        "retailer",
        "consumer",
    ]),
    organization: z.string().optional(),
    // createdAt: z.coerce.date().optional(),
    // updatedAt: z.coerce.date().optional(),
});

export const loginSchema = z.object({
    username: z.string(),
    role: z.enum([
        "admin",
        "farmer",
        "processor",
        "distributor",
        "retailer",
        "consumer",
    ]),
    password: z.string(),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});
