import { useState, useEffect } from "react";

export interface StrengthTrendDataPoint {
	date: string;
	squat?: number;
	bench?: number;
	deadlift?: number;
	ohp?: number;
	prs?: {
		squat?: boolean;
		bench?: boolean;
		deadlift?: boolean;
		ohp?: boolean;
	};
}

export function useStrengthChart(data: StrengthTrendDataPoint[] = []) {
	const [activeLifts, setActiveLifts] = useState<Record<string, boolean>>({
		squat: true,
		bench: true,
		deadlift: true,
		ohp: true,
	});

	const [prCount, setPrCount] = useState(0);
	const [prData, setPrData] = useState<StrengthTrendDataPoint[]>([]);

	useEffect(() => {
		if (data?.length > 0) {
			let count = 0;
			const prs: StrengthTrendDataPoint[] = [];

			data.forEach((point) => {
				if (point.prs) {
					const hasPR = Object.values(point.prs).some(
						(v) => v === true,
					);
					if (hasPR) {
						prs.push(point);
						Object.values(point.prs).forEach((isPR) => {
							if (isPR) count++;
						});
					}
				}
			});

			setPrCount(count);
			setPrData(prs);
		} else {
			setPrCount(0);
			setPrData([]);
		}
	}, [data]);

	const toggleLift = (key: string) => {
		setActiveLifts((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const hasData = data && data.length > 0;

	return {
		activeLifts,
		toggleLift,
		prCount,
		prData,
		hasData,
	};
}
