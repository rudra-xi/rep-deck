// hooks/useAllMeasurements.ts
import { useMemo } from "react";

interface AllMeasurementData {
	date: string;
	weight: number | null;
	bodyFat: number | null;
	arms: number | null;
	forearms: number | null;
	thighs: number | null;
	chest: number | null;
	waist: number | null;
	hips: number | null;
}

export function useAllMeasurements(data: AllMeasurementData[] = []) {
	const hasData = useMemo(() => {
		if (!data.length) return false;
		return data.some((d) =>
			Object.entries(d).some(
				([key, value]) =>
					key !== "date" && value != null && value !== 0,
			),
		);
	}, [data]);

	const latestValues = useMemo(() => {
		if (!data.length) return null;
		const last = data[data.length - 1];
		return {
			weight: last.weight,
			bodyFat: last.bodyFat,
			arms: last.arms,
			forearms: last.forearms,
			thighs: last.thighs,
			chest: last.chest,
			waist: last.waist,
			hips: last.hips,
		};
	}, [data]);

	return {
		data,
		hasData,
		latestValues,
	};
}
