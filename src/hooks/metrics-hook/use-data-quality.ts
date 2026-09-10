// hooks/useDataQuality.ts
import { useMemo } from "react";

interface DataQualityProps {
	daysSinceLastMeasurement?: number;
	averageGapDays?: number;
}

export function useDataQuality({
	daysSinceLastMeasurement = 0,
	averageGapDays = 0,
}: DataQualityProps = {}) {
	const hasNoEntries = daysSinceLastMeasurement === 999;
	const isStale = hasNoEntries || daysSinceLastMeasurement > 14;

	const lastLoggedText = useMemo(() => {
		if (hasNoEntries) return "Never";
		if (daysSinceLastMeasurement === 0) return "Today";
		if (daysSinceLastMeasurement === 1) return "Yesterday";
		return `${daysSinceLastMeasurement} days ago`;
	}, [daysSinceLastMeasurement, hasNoEntries]);

	const status = useMemo(() => {
		if (hasNoEntries) {
			return {
				type: "warning" as const,
				message:
					"No entries logged yet. Add your first measurement to start tracking trends.",
				icon: "WarningIcon",
			};
		}
		if (isStale) {
			return {
				type: "warning" as const,
				message:
					"No measurements logged in 14+ days. Log soon to keep trendlines accurate.",
				icon: "WarningIcon",
			};
		}
		return {
			type: "good" as const,
			message: "✓ Log frequency is optimal for trend calculations.",
			icon: "ShieldCheckIcon",
		};
	}, [isStale, hasNoEntries]);

	return {
		isStale,
		lastLoggedText,
		daysSinceLastMeasurement,
		averageGapDays,
		status,
	};
}
