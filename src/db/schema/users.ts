import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/_relations";
import { programTemplates } from "./programTemplates";
import { workoutSessions } from "./workoutSessions";
import { bodyMeasurements } from "./bodyMeasurements";

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
