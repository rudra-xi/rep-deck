export type LoggedSet = {
	id: string;
	exerciseName: string;
	weight: number | string;
	reps: number | string;
	rpe: number | string;
	notes: string;
	templateId?: string;
	isPR?: boolean;
	setNumber?: number | string;
};

export type Exercise = {
	id: string;
	name: string;
	type: "Primary" | "Secondary" | "Accessory";
	target: string;
	lastSession: string;
};

export type Day = {
	id: number;
	label: string;
	exercises?: Exercise[];
};

export interface ExercisePerformanceSummary {
	lastBest: {
		weight: number;
		reps: number;
		rpe?: number | null;
		formatted: string;
	} | null;
	overallBest: {
		weight: number;
		reps: number;
		rpe?: number | null;
		formatted: string;
	} | null;
	lastNote?: string | null;
	isPR?: boolean;
}

export interface ExercisePerformanceWithPR extends ExercisePerformanceSummary {
	name: string;
	isPR: boolean;
}
