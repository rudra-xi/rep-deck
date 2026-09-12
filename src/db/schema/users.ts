// db/schema/users.ts
import { relations } from "drizzle-orm/_relations";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { bodyMeasurements } from "./bodyMeasurements";
import { programTemplates } from "./programTemplates";
import { workoutSessions } from "./workoutSessions";

export const users = pgTable("users", {
	id: uuid("id").primaryKey(),
	email: text("email").notNull(),
	name: text("name"),
	avatarSeed: text("avatar_seed"),
	weightUnit: text("weight_unit").default("kg").notNull(),
	measurementUnit: text("measurement_unit").default("in").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	programs: many(programTemplates),
	sessions: many(workoutSessions),
	measurements: many(bodyMeasurements),
}));
