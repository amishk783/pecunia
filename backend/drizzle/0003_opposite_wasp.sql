ALTER TABLE "budget" ADD COLUMN "date" date;--> statement-breakpoint
ALTER TABLE "budget" DROP COLUMN IF EXISTS "type";