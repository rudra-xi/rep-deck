// hooks/progress-hook/use-body-metrics.ts
import { useState, useEffect, useMemo } from "react";
import { getBodyMetrics } from "@/actions/progress";
import { useUnits } from "@/common";

export function useBodyMetrics(
	initialData: any[] = [],
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

	// ✅ Compute diff in user's preferred unit
	// `fmtWeight` converts DB kg → user unit (kg or lb)
	// Since the chart / UI also display in user's unit, this stays consistent.
	const weightDiff = useMemo(() => {
		if (first?.weight == null || latest?.weight == null) return "0.0";
		const diff = fmtWeight(latest.weight) - fmtWeight(first.weight);
		return diff.toFixed(1);
	}, [first?.weight, latest?.weight, fmtWeight]);

	const fatDiff = useMemo(() => {
		if (first?.bodyFat == null || latest?.bodyFat == null) return "0.0";
		// Body fat is a % — no conversion needed
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
