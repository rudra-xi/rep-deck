import { relations } from "drizzle-orm/_relations";
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { programDayTemplates } from "./programDayTemplates";

// ---------- Exercise Templates ----------
export const exerciseTemplates = pgTable(
	"exercise_templates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		programDayId: uuid("program_day_id")
			.notNull()
			.references(() => programDayTemplates.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		type: text("type").notNull(),
		targetSets: integer("target_sets"),
		targetRepRange: text("target_rep_range"),
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
