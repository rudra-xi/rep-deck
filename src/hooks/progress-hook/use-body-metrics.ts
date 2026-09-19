import { useEffect, useMemo, useState } from "react";
import { getBodyMetrics } from "@/actions/progress";
import { useUnits } from "@/common";
import type { BodyMetricPoint } from "@/types/progress";

export function useBodyMetrics(
	initialData: BodyMetricPoint[] = [],
	propLoading: boolean = false,
) {
	const { fmtWeight } = useUnits();

	const [data, setData] = useState(initialData);
	const [loading, setLoading] = useState(
		initialData.length === 0 && !propLoading,
	);

	useEffect(() => {
		if (propLoading) {
			setLoading(true);
			return;
		}

		if (initialData.length === 0) {
			setLoading(true);
			getBodyMetrics().then((res) => {
				if (res) setData(res);
				setLoading(false);
			});
		} else {
			setData(initialData);
			setLoading(false);
		}
	}, [initialData, propLoading]);

	const first = data[0];
	const latest = data[data.length - 1];

	const weightDiff = useMemo(() => {
		if (first?.weight == null || latest?.weight == null) return "0.0";
		const diff = fmtWeight(latest.weight) - fmtWeight(first.weight);
		return diff.toFixed(1);
	}, [first?.weight, latest?.weight, fmtWeight]);

	const fatDiff = useMemo(() => {
		if (first?.bodyFat == null || latest?.bodyFat == null) return "0.0";
		const diff = latest.bodyFat - first.bodyFat;
		return diff.toFixed(1);
	}, [first?.bodyFat, latest?.bodyFat]);

	return {
		data,
		loading,
		first,
		latest,
		weightDiff,
		fatDiff,
		hasData: data.length > 0,
	};
}
