import {
	pgTable,
	uuid,
	text,
	integer,
	decimal,
	timestamp,
	index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/_relations";
import { workoutSessions } from "./workoutSessions";
import { exerciseTemplates } from "./exerciseTemplates";

// ---------- Workout Sets ----------
export const workoutSets = pgTable(
	"workout_sets",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		sessionId: uuid("session_id")
			.notNull()
			.references(() => workoutSessions.id, { onDelete: "cascade" }),
		exerciseName: text("exercise_name").notNull(),
		templateId: uuid("template_id").references(() => exerciseTemplates.id, {
			onDelete: "set null",
		}),
		weight: decimal("weight", { precision: 6, scale: 2 }).notNull(),
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
