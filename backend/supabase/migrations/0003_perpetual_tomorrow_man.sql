ALTER TABLE "budget" ALTER COLUMN "year" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "month" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "allocated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "userId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_accounts_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
