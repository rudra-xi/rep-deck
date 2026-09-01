import { useEffect, useState } from "react";
import {
	getExercisePerformanceHistory,
	type ExercisePerformanceSummary,
} from "@/actions/workout";

interface Exercise {
	id: string;
	name: string;
}

export function useExercisePerformance(exercises: Exercise[]) {
	const [lastLogs, setLastLogs] = useState<
		Record<string, ExercisePerformanceSummary | null>
	>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchPerformance() {
			setIsLoading(true);
			const logs: Record<string, ExercisePerformanceSummary | null> = {};

			for (const ex of exercises) {
				try {
					const performance = await getExercisePerformanceHistory(
						ex.name,
					);
					logs[ex.id] = performance;
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
