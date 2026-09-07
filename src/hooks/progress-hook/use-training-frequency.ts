// hooks/useTrainingFrequency.ts
import { useState, useEffect, useMemo } from "react";
import { getTrainingFrequency } from "@/actions/progress";
import { TWELVE_WEEK_BENCHMARK } from "@/constants";

export function useTrainingFrequency(
	initialData: any[] = [],
	propLoading: boolean = false,
) {
	const [data, setData] = useState(initialData);
	const [loading, setLoading] = useState(
		initialData.length === 0 && !propLoading,
	);

	useEffect(() => {
		if (propLoading) {
			setLoading(true);
			return;
		}

		if (initialData.length > 0) {
			setData(initialData);
			setLoading(false);
		} else {
			setLoading(true);
			getTrainingFrequency().then((res) => {
				if (res && res.length > 0) setData(res);
				setLoading(false);
			});
		}
	}, [initialData, propLoading]);

	const { combinedData, maxDomainValue, totalSessions, peakDay } =
		useMemo(() => {
			const baseData =
				data.length > 0
					? data
					: [
							{ day: "Mon", sessions: 0 },
							{ day: "Tue", sessions: 0 },
							{ day: "Wed", sessions: 0 },
							{ day: "Thu", sessions: 0 },
							{ day: "Fri", sessions: 0 },
							{ day: "Sat", sessions: 0 },
							{ day: "Sun", sessions: 0 },
						];

			let maxVal = 0;
			let total = 0;

			const combined = baseData.map((item) => {
				const targetVal = TWELVE_WEEK_BENCHMARK[item.day] ?? 0;
				if (item.sessions > maxVal) maxVal = item.sessions;
				total += item.sessions;

				return {
					...item,
					target: targetVal,
				};
			});

			const maxDomain = Math.max(maxVal, 12);

			const sorted = [...baseData].sort(
				(a, b) => b.sessions - a.sessions,
			);
			const peak = sorted[0] && sorted[0].sessions > 0 ? sorted[0] : null;

			return {
				combinedData: combined,
				maxDomainValue: maxDomain,
				totalSessions: total,
				peakDay: peak,
			};
		}, [data]);

	const hasData = data.length > 0 && data.some((d) => d.sessions > 0);

	return {
		data,
		combinedData,
		maxDomainValue,
		totalSessions,
		peakDay,
		loading,
		hasData,
	};
}
