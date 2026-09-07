// hooks/useBodyMetrics.ts
import { useState, useEffect } from "react";
import { getBodyMetrics } from "@/actions/progress";

export function useBodyMetrics(
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

	const weightDiff =
		latest?.weight && first?.weight
			? (latest.weight - first.weight).toFixed(1)
			: "0.0";

	const fatDiff =
		latest?.bodyFat && first?.bodyFat
			? (latest.bodyFat - first.bodyFat).toFixed(1)
			: "0.0";

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
