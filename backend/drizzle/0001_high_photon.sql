ALTER TABLE "users" RENAME TO "accounts";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "full_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "username";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "email";