import { relations } from "drizzle-orm/_relations";
import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { programDayTemplates } from "./programDayTemplates";
import { users } from "./users";

// ---------- Program Templates ----------
export const programTemplates = pgTable(
	"program_templates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		version: integer("version").notNull(),
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
