import { useEffect, useState } from "react";
import { getStrengthOverview } from "@/actions/progress";
import type { StrengthOverviewPoint } from "@/types/progress";

type TimeRange = "2M" | "3M" | "6M" | "1Y";

const TIME_RANGES: TimeRange[] = ["2M", "3M", "6M", "1Y"];

export function useStrengthOverview(
	initialData: StrengthOverviewPoint[] = [],
	propLoading: boolean = false,
	timeRange: TimeRange = "3M",
) {
	const [cache, setCache] = useState<Record<string, StrengthOverviewPoint[]>>(
		{},
	);
	const [loading, setLoading] = useState(initialData.length === 0);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		if (initialData.length > 0) {
			setCache((prev) =>
				prev[timeRange] ? prev : { ...prev, [timeRange]: initialData },
			);
		}
	}, [initialData, timeRange]);

	useEffect(() => {
		if (propLoading) {
			setLoading(true);
			return;
		}

		if (cache[timeRange]) {
			setLoading(false);
			return;
		}

		let isMounted = true;
		setIsFetching(true);

		getStrengthOverview(timeRange).then((res) => {
			if (!isMounted) return;
			setCache((prev) => ({ ...prev, [timeRange]: res || [] }));
			setIsFetching(false);
			setLoading(false);
		});

		return () => {
			isMounted = false;
		};
	}, [timeRange, propLoading, cache]);

	const data = cache[timeRange] || [];
	const hasData = data.some((d) => d.squat || d.bench || d.deadlift || d.ohp);

	return {
		data,
		loading,
		isFetching,
		hasData,
		timeRanges: TIME_RANGES,
	};
}
