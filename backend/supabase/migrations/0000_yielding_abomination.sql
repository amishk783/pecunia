DO $$ BEGIN
 CREATE TYPE "public"."frequency" AS ENUM('weekly', 'monthly', 'quaterly', 'yearly');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('expense', 'income');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('active', 'closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"user_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "budget" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" uuid,
	"year" integer,
	"status" "status",
	"month" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "type",
	"userID" uuid,
	"budget_id" integer,
	"label" varchar(50) NOT NULL,
	"position" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "groups_position_unique" UNIQUE("position")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "type",
	"group_id" integer NOT NULL,
	"position" integer,
	"label" varchar(50) NOT NULL,
	"amountBudget" numeric NOT NULL,
	"allocated" numeric,
	"date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "items_position_unique" UNIQUE("position")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"label" varchar(50),
	"amountBudget" numeric NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget" ADD CONSTRAINT "budget_userID_accounts_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups" ADD CONSTRAINT "groups_userID_accounts_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups" ADD CONSTRAINT "groups_budget_id_budget_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budget"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
