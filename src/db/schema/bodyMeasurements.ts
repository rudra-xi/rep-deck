import {
	pgTable,
	uuid,
	text,
	timestamp,
	decimal,
	index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/_relations";
import { users } from "./users";

export const bodyMeasurements = pgTable(
	"body_measurements",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		date: timestamp("date", { withTimezone: true }).notNull(),
		// Increase precision for all decimal fields
		weightKg: decimal("weight_kg", { precision: 6, scale: 2 }), 
		bodyFatPercent: decimal("body_fat_percent", { precision: 5, scale: 2 }), 
		armsCm: decimal("arms_cm", { precision: 5, scale: 2 }), 
		forearmsCm: decimal("forearms_cm", { precision: 5, scale: 2 }), 
		thighsCm: decimal("thighs_cm", { precision: 5, scale: 2 }), 
		chestCm: decimal("chest_cm", { precision: 5, scale: 2 }), 
		waistCm: decimal("waist_cm", { precision: 5, scale: 2 }), 
		hipsCm: decimal("hips_cm", { precision: 5, scale: 2 }), 
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
