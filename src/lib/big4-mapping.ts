export type Big4Key = "squat" | "bench" | "deadlift" | "ohp";

export const BIG4_EXERCISE_MAP: Record<string, Big4Key> = {
	"barbell back squat": "squat",
	"back squat": "squat",
	"barbell squat": "squat",
	squat: "squat",

	"flat barbell bench press": "bench",
	"bench press": "bench",
	"barbell bench press": "bench",
	"flat bench press": "bench",
	bench: "bench",

	"conventional deadlift": "deadlift",
	deadlift: "deadlift",

	"overhead press": "ohp",
	"overhead barbell press": "ohp",
	"barbell overhead press": "ohp",
	ohp: "ohp",
};

export function normalizeExerciseName(name: string): string {
	return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveBig4Key(exerciseName: string): Big4Key | null {
	const key = normalizeExerciseName(exerciseName);
	return BIG4_EXERCISE_MAP[key] ?? null;
}

export function getUnmappedBig4Presets(): string[] {
	const BIG4_PRESET_NAMES = [
		"Barbell Back Squat",
		"Flat Barbell Bench Press",
		"Deadlift",
		"Overhead Barbell Press",
	];
	return BIG4_PRESET_NAMES.filter(
		(name) => !BIG4_EXERCISE_MAP[normalizeExerciseName(name)],
	);
}
