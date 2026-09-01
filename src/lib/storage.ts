// lib/storage.ts
export const STORAGE_KEYS = {
	WORKOUT_SESSION: "workout_session_draft",
	WORKOUT_NOTES: "workout_session_notes_draft",
	WORKOUT_SELECTED_DAY: "workout_selected_day_index",
	EXERCISE_INPUTS: "planned_exercises_draft_inputs",
	EXERCISE_COMPLETED: "planned_exercises_completed",
} as const;

export function clearAllWorkoutData() {
	Object.values(STORAGE_KEYS).forEach((key) => {
		localStorage.removeItem(key);
	});
}

export function clearWorkoutSession() {
	localStorage.removeItem(STORAGE_KEYS.WORKOUT_SESSION);
	localStorage.removeItem(STORAGE_KEYS.WORKOUT_NOTES);
	localStorage.removeItem(STORAGE_KEYS.EXERCISE_INPUTS);
	localStorage.removeItem(STORAGE_KEYS.EXERCISE_COMPLETED);
}

// Helper to check if any workout data exists
export function hasWorkoutData(): boolean {
	return Object.values(STORAGE_KEYS).some((key) => {
		return localStorage.getItem(key) !== null;
	});
}

// Helper to get all workout data
export function getAllWorkoutData() {
	const data: Record<string, any> = {};
	Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
		const value = localStorage.getItem(storageKey);
		if (value) {
			try {
				data[key] = JSON.parse(value);
			} catch {
				data[key] = value;
			}
		}
	});
	return data;
}
