import {
    pgTable,
    serial,
    varchar,
    date,
    unique,
    integer,
    uuid,
    pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role_enum", [
    "admin",
    "farmer",
    "processor",
    "distributor",
    "retailer",
    "consumer",
]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    password: varchar("password").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    role: userRoleEnum("role").notNull().default("consumer"),
    organization: varchar("organization", { length: 50 }),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
});
