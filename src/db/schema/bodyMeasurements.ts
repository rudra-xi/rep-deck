import { relations } from "drizzle-orm/_relations";
import {
	decimal,
	index,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const bodyMeasurements = pgTable(
	"body_measurements",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		date: timestamp("date", { withTimezone: true }).notNull(),
		weightKg: decimal("weight_kg", {
			precision: 6,
			scale: 2,
			mode: "number",
		}),
		bodyFatPercent: decimal("body_fat_percent", {
			precision: 5,
			scale: 2,
			mode: "number",
		}),
		armsCm: decimal("arms_cm", { precision: 5, scale: 2, mode: "number" }),
		forearmsCm: decimal("forearms_cm", {
			precision: 5,
			scale: 2,
			mode: "number",
		}),
		thighsCm: decimal("thighs_cm", {
			precision: 5,
			scale: 2,
			mode: "number",
		}),
		chestCm: decimal("chest_cm", {
			precision: 5,
			scale: 2,
			mode: "number",
		}),
		waistCm: decimal("waist_cm", {
			precision: 5,
			scale: 2,
			mode: "number",
		}),
		hipsCm: decimal("hips_cm", { precision: 5, scale: 2, mode: "number" }),
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
