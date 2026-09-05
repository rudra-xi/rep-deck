import { useEffect, useState } from "react";
import {
	getExercisePerformanceHistory,
	type ExercisePerformanceSummary,
} from "@/actions/workout";

interface Exercise {
	id: string;
	name: string;
}

// Extend the type to include isPR
interface ExercisePerformanceWithPR extends ExercisePerformanceSummary {
	isPR: boolean;
}

export function useExercisePerformance(exercises: Exercise[]) {
	const [lastLogs, setLastLogs] = useState<
		Record<string, ExercisePerformanceWithPR | null>
	>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchPerformance() {
			setIsLoading(true);
			const logs: Record<string, ExercisePerformanceWithPR | null> = {};

			for (const ex of exercises) {
				try {
					const performance = await getExercisePerformanceHistory(
						ex.name,
					);

					// The isPR is already returned from the server action
					const isPR = performance?.isPR ?? false;

					logs[ex.id] = {
						...performance,
						isPR,
					} as ExercisePerformanceWithPR;
				} catch (error) {
					console.error(
						`Failed to fetch performance for ${ex.name}:`,
						error,
					);
					logs[ex.id] = null;
				}
			}

			setLastLogs(logs);
			setIsLoading(false);
		}

		if (exercises.length > 0) {
			fetchPerformance();
		} else {
			setIsLoading(false);
		}
	}, [exercises]);

	return { lastLogs, isLoading };
}
