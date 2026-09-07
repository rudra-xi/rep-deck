// hooks/useStrengthOverview.ts
import { useState, useEffect } from "react";
import { getStrengthOverview } from "@/actions/progress";

type TimeRange = "2M" | "3M" | "6M" | "1Y";

const TIME_RANGES: TimeRange[] = ["2M", "3M", "6M", "1Y"];

export function useStrengthOverview(
	initialData: any[] = [],
	propLoading: boolean = false,
	defaultRange: TimeRange = "3M",
) {
	const [timeRange, setTimeRange] = useState<TimeRange>(defaultRange);
	const [cache, setCache] = useState<Record<string, any[]>>({});
	const [loading, setLoading] = useState(
		initialData.length === 0 && !propLoading,
	);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		if (initialData.length > 0) {
			setCache((prev) => ({ ...prev, [defaultRange]: initialData }));
			setLoading(false);
		}
	}, [initialData, defaultRange]);

	useEffect(() => {
		if (propLoading) {
			setLoading(true);
			return;
		}

		if (cache[timeRange]) {
			setLoading(false);
			return;
		}

		setIsFetching(true);
		getStrengthOverview(timeRange).then((res) => {
			setCache((prev) => ({ ...prev, [timeRange]: res || [] }));
			setIsFetching(false);
			setLoading(false);
		});
	}, [timeRange, propLoading, cache]);

	const data = cache[timeRange] || [];
	const hasData = data.some((d) => d.squat || d.bench || d.deadlift || d.ohp);

	return {
		timeRange,
		setTimeRange,
		data,
		loading,
		isFetching,
		hasData,
		timeRanges: TIME_RANGES,
	};
}
