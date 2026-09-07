// hooks/useLiftDetails.ts
import { useState, useEffect } from "react";
import { getLiftDetails } from "@/actions/progress";

type LiftType = "bench" | "squat" | "deadlift" | "ohp";

const LIFT_LABELS: Record<LiftType, string> = {
	bench: "Bench",
	squat: "Squat",
	deadlift: "Deadlift",
	ohp: "OHP",
};

export function useLiftDetails(
	initialData: any[] = [],
	propLoading: boolean = false,
	defaultLift: LiftType = "bench",
) {
	const [selectedLift, setSelectedLift] = useState<LiftType>(defaultLift);
	const [cache, setCache] = useState<Record<string, any[]>>({});
	const [loading, setLoading] = useState(
		initialData.length === 0 && !propLoading,
	);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		if (initialData.length > 0) {
			setCache((prev) => ({ ...prev, [defaultLift]: initialData }));
			setLoading(false);
		}
	}, [initialData, defaultLift]);

	useEffect(() => {
		if (propLoading) {
			setLoading(true);
			return;
		}

		if (cache[selectedLift]) {
			setLoading(false);
			return;
		}

		setIsFetching(true);
		getLiftDetails(selectedLift).then((res) => {
			setCache((prev) => ({ ...prev, [selectedLift]: res || [] }));
			setIsFetching(false);
			setLoading(false);
		});
	}, [selectedLift, propLoading, cache]);

	const data = cache[selectedLift] || [];
	const latest = data[data.length - 1];
	const lastPR = data.filter((d) => d.isPR).pop()?.date || "N/A";

	return {
		selectedLift,
		setSelectedLift,
		data,
		latest,
		lastPR,
		loading,
		isFetching,
		hasData: data.length > 0,
		liftLabels: LIFT_LABELS,
		liftTypes: Object.keys(LIFT_LABELS) as LiftType[],
	};
}
