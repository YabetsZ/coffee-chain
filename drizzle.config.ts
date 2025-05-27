import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/database/schema",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
