ALTER TABLE "transactions" RENAME COLUMN "amountBudget" TO "amount";--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "label" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "paid_via" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "notes" varchar(50);