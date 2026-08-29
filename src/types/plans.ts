import type {
	ExerciseTemplate,
	ProgramDayTemplate,
	ProgramTemplate,
} from "@/db/schema";

export type ExerciseWithMeta = ExerciseTemplate;

export type DayWithExercises = ProgramDayTemplate & {
	exercises: ExerciseWithMeta[];
};

export type PlanWithStructure = ProgramTemplate & {
	days: DayWithExercises[];
};
