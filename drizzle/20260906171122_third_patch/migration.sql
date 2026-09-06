ALTER TABLE "workout_sets" ADD COLUMN "is_pr" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "program_templates" ALTER COLUMN "start_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "program_templates" ALTER COLUMN "start_date" DROP NOT NULL;