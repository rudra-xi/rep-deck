ALTER TABLE "users" ADD COLUMN "weight_unit" text DEFAULT 'kg' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "measurement_unit" text DEFAULT 'in' NOT NULL;