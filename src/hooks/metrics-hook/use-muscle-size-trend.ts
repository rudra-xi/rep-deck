// hooks/useMuscleSizeTrend.ts
import { useMemo } from "react";

const MUSCLE_COLORS = {
	arms: "var(--chart-1)",
	forearms: "var(--chart-2)",
	thighs: "var(--chart-3)",
	chest: "var(--chart-4)",
};

interface MuscleSizeData {
	date: string;
	arms: number | null;
	forearms: number | null;
	thighs: number | null;
	chest: number | null;
	waist: number | null;
}

export function useMuscleSizeTrend(data: MuscleSizeData[] = []) {
	const muscleColors = MUSCLE_COLORS;

	const muscleKeys = useMemo(() => Object.keys(muscleColors), []);

	const hasData = data.length > 0;

	const latestValues = useMemo(() => {
		if (!hasData) return null;
		const latest = data[data.length - 1];
		return {
			arms: latest.arms,
			forearms: latest.forearms,
			thighs: latest.thighs,
			chest: latest.chest,
			waist: latest.waist,
		};
	}, [data, hasData]);

	return {
		data,
		muscleColors,
		muscleKeys,
		hasData,
		latestValues,
	};
}
