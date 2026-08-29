import { relations } from "drizzle-orm/_relations";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { bodyMeasurements } from "./bodyMeasurements";
import { programTemplates } from "./programTemplates";
import { workoutSessions } from "./workoutSessions";

// ---------- Users (profile mapped to auth.users) ----------
export const users = pgTable("users", {
	// Directly references Supabase auth.users.id
	id: uuid("id").primaryKey(),
	email: text("email").notNull(),
	name: text("name"),
	avatarSeed: text("avatar_seed"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	programs: many(programTemplates),
	sessions: many(workoutSessions),
	measurements: many(bodyMeasurements),
}));
