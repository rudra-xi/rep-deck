import { relations } from "drizzle-orm/_relations";
import {
	boolean,
	decimal,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// ---------- Auth (Supabase) ----------
// You don't create this table; it's auth.users in Supabase.
// We just reference it via userId in our tables.

// ---------- Users (profile) ----------
export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		supabaseUserId: uuid("supabase_user_id").notNull().unique(),
		email: text("email").notNull(),
		name: text("name"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		supabaseUserIdIdx: index("users_supabase_user_id_idx").on(
			table.supabaseUserId,
		),
	}),
);

export const usersRelations = relations(users, ({ many }) => ({
	programs: many(programTemplates),
	sessions: many(workoutSessions),
	measurements: many(bodyMeasurements),
}));

// ---------- Program Templates (v1, v2, v3, v4) ----------
export const programTemplates = pgTable(
	"program_templates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: text("name").notNull(), // e.g. "Base Sets v3"
		version: integer("version").notNull(), // 1 | 2 | 3 | 4
		startDate: timestamp("start_date", { withTimezone: true }).notNull(),
		endDate: timestamp("end_date", { withTimezone: true }),
		active: boolean("active").notNull().default(false),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		userIdIdx: index("program_templates_user_id_idx").on(table.userId),
		activeIdx: index("program_templates_active_idx").on(table.active),
	}),
);

export const programTemplatesRelations = relations(
	programTemplates,
	({ one, many }) => ({
		user: one(users, {
			fields: [programTemplates.userId],
			references: [users.id],
		}),
		days: many(programDayTemplates),
	}),
);

// ---------- Program Day Templates ----------
export const programDayTemplates = pgTable(
	"program_day_templates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		programId: uuid("program_id")
			.notNull()
			.references(() => programTemplates.id, { onDelete: "cascade" }),
		dayIndex: integer("day_index").notNull(), // 1..6
		label: text("label").notNull(), // "Day 1 – Chest & Biceps (Heavy)"
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		programIdIdx: index("program_day_templates_program_id_idx").on(
			table.programId,
		),
	}),
);

export const programDayTemplatesRelations = relations(
	programDayTemplates,
	({ one, many }) => ({
		program: one(programTemplates, {
			fields: [programDayTemplates.programId],
			references: [programTemplates.id],
		}),
		exercises: many(exerciseTemplates),
	}),
);

// ---------- Exercise Templates ----------
export const exerciseTemplates = pgTable(
	"exercise_templates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		programDayId: uuid("program_day_id")
			.notNull()
			.references(() => programDayTemplates.id, { onDelete: "cascade" }),
		name: text("name").notNull(), // "Barbell Bench Press"
		type: text("type").notNull(), // "Primary" | "Secondary" | "Extra"
		targetSets: integer("target_sets"),
		targetRepRange: text("target_rep_range"), // "8–10 Base / 4–6 Heavy"
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		programDayIdIdx: index("exercise_templates_program_day_id_idx").on(
			table.programDayId,
		),
	}),
);

export const exerciseTemplatesRelations = relations(
	exerciseTemplates,
	({ one }) => ({
		programDay: one(programDayTemplates, {
			fields: [exerciseTemplates.programDayId],
			references: [programDayTemplates.id],
		}),
	}),
);

// ---------- Workout Sessions ----------
export const workoutSessions = pgTable(
	"workout_sessions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		programId: uuid("program_id").references(() => programTemplates.id, {
			onDelete: "set null",
		}),
		dayIndex: integer("day_index"), // 1..6
		date: timestamp("date", { withTimezone: true }).notNull(),
		notes: text("notes"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		userIdIdx: index("workout_sessions_user_id_idx").on(table.userId),
		programIdIdx: index("workout_sessions_program_id_idx").on(
			table.programId,
		),
		dateIdx: index("workout_sessions_date_idx").on(table.date),
	}),
);

export const workoutSessionsRelations = relations(
	workoutSessions,
	({ one, many }) => ({
		user: one(users, {
			fields: [workoutSessions.userId],
			references: [users.id],
		}),
		program: one(programTemplates, {
			fields: [workoutSessions.programId],
			references: [programTemplates.id],
		}),
		sets: many(workoutSets),
	}),
);

// ---------- Workout Sets ----------
export const workoutSets = pgTable(
	"workout_sets",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		sessionId: uuid("session_id")
			.notNull()
			.references(() => workoutSessions.id, { onDelete: "cascade" }),
		exerciseName: text("exercise_name").notNull(), // free text
		templateId: uuid("template_id").references(() => exerciseTemplates.id, {
			onDelete: "set null",
		}),
		weight: decimal("weight", { precision: 6, scale: 2 }).notNull(), // kg
		reps: integer("reps").notNull(),
		rpe: integer("rpe"),
		notes: text("notes"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		sessionIdIdx: index("workout_sets_session_id_idx").on(table.sessionId),
		exerciseNameIdx: index("workout_sets_exercise_name_idx").on(
			table.exerciseName,
		),
	}),
);

export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
	session: one(workoutSessions, {
		fields: [workoutSets.sessionId],
		references: [workoutSessions.id],
	}),
	template: one(exerciseTemplates, {
		fields: [workoutSets.templateId],
		references: [exerciseTemplates.id],
	}),
}));

// ---------- Body Measurements ----------
export const bodyMeasurements = pgTable(
	"body_measurements",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		date: timestamp("date", { withTimezone: true }).notNull(),
		weightKg: decimal("weight_kg", { precision: 6, scale: 2 }),
		bodyFatPercent: decimal("body_fat_percent", { precision: 5, scale: 2 }), // up to 999.99
		armsCm: decimal("arms_cm", { precision: 5, scale: 2 }), // up to 999.99
		forearmsCm: decimal("forearms_cm", { precision: 5, scale: 2 }), // up to 999.99
		thighsCm: decimal("thighs_cm", { precision: 5, scale: 2 }), // up to 999.99
		chestCm: decimal("chest_cm", { precision: 5, scale: 2 }), // up to 999.99
		waistCm: decimal("waist_cm", { precision: 5, scale: 2 }), // up to 999.99
		hipsCm: decimal("hips_cm", { precision: 5, scale: 2 }), // up to 999.99
		notes: text("notes"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		userIdIdx: index("body_measurements_user_id_idx").on(table.userId),
		dateIdx: index("body_measurements_date_idx").on(table.date),
	}),
);

export const bodyMeasurementsRelations = relations(
	bodyMeasurements,
	({ one }) => ({
		user: one(users, {
			fields: [bodyMeasurements.userId],
			references: [users.id],
		}),
	}),
);
