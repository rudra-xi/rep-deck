import { useState, useEffect } from "react";

export interface TopLift {
	id: string | number;
	exercise: string;
	weightKg: number;
	reps: number;
	isPR?: boolean;
}

export interface LastWorkoutSession {
	id: string;
	date: string;
	programName: string;
	dayName: string;
	topLifts: TopLift[];
}

export function useLastWorkout(data?: LastWorkoutSession | null) {
	const [prCount, setPrCount] = useState(0);
	const [prs, setPrs] = useState<TopLift[]>([]);

	useEffect(() => {
		if (data?.topLifts) {
			const prLifts = data.topLifts.filter((lift) => lift.isPR);
			setPrCount(prLifts.length);
			setPrs(prLifts);
		}
	}, [data]);

	return { prCount, prs };
}
