export interface BodyMetricPoint {
	date: string;
	weight: number | null;
	bodyFat: number | null;
}

export interface LiftDetailPoint {
	date: string;
	weight: number;
	estimated1RM: number;
	isPR?: boolean;
}

export interface SessionHistoryItem {
	id: string;
	date: string;
	programName: string;
	dayLabel: string;
	keyLiftsSummary: string;
	totalVolumeKg: number;
}

export interface TrainingFrequencyDay {
	day: string;
	sessions: number;
}

export interface StrengthOverviewPoint {
	date: string;
	squat?: number;
	bench?: number;
	deadlift?: number;
	ohp?: number;
	squatReps?: number;
	benchReps?: number;
	deadliftReps?: number;
	ohpReps?: number;
	squatRpe?: number | null;
	benchRpe?: number | null;
	deadliftRpe?: number | null;
	ohpRpe?: number | null;
}

export interface MeasurementPoint {
	date: string;
	arms: number | null;
	forearms: number | null;
	thighs: number | null;
	chest: number | null;
	waist: number | null;
	hips: number | null;
}
