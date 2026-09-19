import { useEffect, useState } from "react";
import { getExercisePerformanceBatch } from "@/actions/workout";
import type { ExercisePerformanceWithPR } from "@/types/workout-log";

interface Exercise {
	id: string;
	name: string;
}

export function useExercisePerformance(exercises: Exercise[]) {
	const [performanceMap, setPerformanceMap] = useState<
		Record<string, ExercisePerformanceWithPR | null>
	>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function fetchPerformance() {
			if (exercises.length === 0) {
				if (isMounted) {
					setPerformanceMap({});
					setIsLoading(false);
				}
				return;
			}

			setIsLoading(true);
			try {
				const names = exercises.map((e) => e.name);
				const result = await getExercisePerformanceBatch(names);

				if (!isMounted) return;

				const normalized: Record<
					string,
					ExercisePerformanceWithPR | null
				> = {};
				for (const name of names) {
					const perf = result[name];
					normalized[name] = perf
						? { ...perf, name, isPR: perf.isPR ?? false }
						: null;
				}
				setPerformanceMap(normalized);
			} catch (error) {
				console.error("Failed to fetch exercise performance:", error);
			} finally {
				if (isMounted) setIsLoading(false);
			}
		}

		fetchPerformance();
		return () => {
			isMounted = false;
		};
	}, [exercises]);

	return { performanceMap, isLoading };
}

export function wouldBePR(
	weight: number | string,
	reps: number | string,
	previousBest: { weight: number; reps: number } | null | undefined,
): boolean {
	const w = Number(weight);
	const r = Number(reps);

	if (!Number.isFinite(w) || !Number.isFinite(r) || r <= 0 || w <= 0) {
		return false;
	}

	if (!previousBest) return true;

	const current1RM = w * (1 + r / 30);
	const prev1RM = previousBest.weight * (1 + previousBest.reps / 30);

	return current1RM > prev1RM;
}
