import type { ExerciseTemplate } from "./exerciseTemplates";
import type { ProgramDayTemplate } from "./programDayTemplates";
import type { ProgramTemplate } from "./programTemplates";

export * from "./bodyMeasurements";
export * from "./exerciseTemplates";
export * from "./programDayTemplates";
export * from "./programTemplates";
export * from "./users";
export * from "./workoutSessions";
export * from "./workoutSets";

export type ExerciseWithMeta = ExerciseTemplate;

export type DayWithExercises = ProgramDayTemplate & {
	exercises: ExerciseWithMeta[];
};

export type PlanWithStructure = ProgramTemplate & {
	days: DayWithExercises[];
};