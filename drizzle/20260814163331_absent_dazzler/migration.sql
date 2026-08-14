CREATE TABLE "body_measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"weight_kg" numeric(6,2),
	"body_fat_percent" numeric(4,2),
	"arms_cm" numeric(4,2),
	"forearms_cm" numeric(4,2),
	"thighs_cm" numeric(4,2),
	"chest_cm" numeric(4,2),
	"waist_cm" numeric(4,2),
	"hips_cm" numeric(4,2),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"program_day_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"target_sets" integer,
	"target_rep_range" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_day_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"program_id" uuid NOT NULL,
	"day_index" integer NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"version" integer NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"supabase_user_id" uuid NOT NULL UNIQUE,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"program_id" uuid,
	"day_index" integer,
	"date" timestamp with time zone NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"exercise_name" text NOT NULL,
	"template_id" uuid,
	"weight" numeric(6,2) NOT NULL,
	"reps" integer NOT NULL,
	"rpe" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "body_measurements_user_id_idx" ON "body_measurements" ("user_id");--> statement-breakpoint
CREATE INDEX "body_measurements_date_idx" ON "body_measurements" ("date");--> statement-breakpoint
CREATE INDEX "exercise_templates_program_day_id_idx" ON "exercise_templates" ("program_day_id");--> statement-breakpoint
CREATE INDEX "program_day_templates_program_id_idx" ON "program_day_templates" ("program_id");--> statement-breakpoint
CREATE INDEX "program_templates_user_id_idx" ON "program_templates" ("user_id");--> statement-breakpoint
CREATE INDEX "program_templates_active_idx" ON "program_templates" ("active");--> statement-breakpoint
CREATE INDEX "users_supabase_user_id_idx" ON "users" ("supabase_user_id");--> statement-breakpoint
CREATE INDEX "workout_sessions_user_id_idx" ON "workout_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "workout_sessions_program_id_idx" ON "workout_sessions" ("program_id");--> statement-breakpoint
CREATE INDEX "workout_sessions_date_idx" ON "workout_sessions" ("date");--> statement-breakpoint
CREATE INDEX "workout_sets_session_id_idx" ON "workout_sets" ("session_id");--> statement-breakpoint
CREATE INDEX "workout_sets_exercise_name_idx" ON "workout_sets" ("exercise_name");--> statement-breakpoint
ALTER TABLE "body_measurements" ADD CONSTRAINT "body_measurements_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exercise_templates" ADD CONSTRAINT "exercise_templates_program_day_id_program_day_templates_id_fkey" FOREIGN KEY ("program_day_id") REFERENCES "program_day_templates"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "program_day_templates" ADD CONSTRAINT "program_day_templates_program_id_program_templates_id_fkey" FOREIGN KEY ("program_id") REFERENCES "program_templates"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "program_templates" ADD CONSTRAINT "program_templates_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_program_id_program_templates_id_fkey" FOREIGN KEY ("program_id") REFERENCES "program_templates"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_session_id_workout_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "workout_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_template_id_exercise_templates_id_fkey" FOREIGN KEY ("template_id") REFERENCES "exercise_templates"("id") ON DELETE SET NULL;