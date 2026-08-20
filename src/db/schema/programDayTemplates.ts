import {
	pgTable,
	uuid,
	text,
	integer,
	timestamp,
	index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/_relations";
import { programTemplates } from "./programTemplates";
import { exerciseTemplates } from "./exerciseTemplates";

// ---------- Program Day Templates ----------
export const programDayTemplates = pgTable(
	"program_day_templates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		programId: uuid("program_id")
			.notNull()
			.references(() => programTemplates.id, { onDelete: "cascade" }),
		dayIndex: integer("day_index").notNull(),
		label: text("label").notNull(),
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
