CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'farmer', 'processor', 'distributor', 'retailer', 'consumer');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "user_role_enum" DEFAULT 'consumer' NOT NULL,
	"organization" varchar(50),
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
