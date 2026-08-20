import { relations } from "drizzle-orm/_relations";
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { programTemplates } from "./programTemplates";
import { users } from "./users";
import { workoutSets } from "./workoutSets";

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
		dayIndex: integer("day_index"),
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
