// hooks/useQuickStats.ts
import { useMemo } from "react";

interface QuickStatsData {
	weight?: { current: number | null; delta: number | null };
	bodyFat?: { current: number | null; delta: number | null };
	arms?: { current: number | null; delta: number | null };
	thighs?: { current: number | null; delta: number | null };
}

// hooks/useQuickStats.ts
export function useQuickStats(stats?: any) {
	const statCards = [
		{
			key: "notes",
			label: "Notes",
			value: stats?.notes || "No notes logged",
			icon: "NotePencilIcon",
		},
		{
			key: "weight",
			label: "Weight",
			value:
				stats?.weight?.current != null
					? `${stats.weight.current} kg`
					: "--",
			icon: "ScalesIcon",
			trend:
				stats?.weight?.delta != null
					? {
							direction:
								stats.weight.delta > 0
									? "up"
									: stats.weight.delta < 0
										? "down"
										: "neutral",
							value: `${stats.weight.delta > 0 ? "+" : ""}${stats.weight.delta} kg`,
						}
					: null,
		},
		{
			key: "bodyFat",
			label: "Body Fat",
			value:
				stats?.bodyFat?.current != null
					? `${stats.bodyFat.current}%`
					: "--",
			icon: "TargetIcon",
			trend:
				stats?.bodyFat?.delta != null
					? {
							direction:
								stats.bodyFat.delta > 0
									? "up"
									: stats.bodyFat.delta < 0
										? "down"
										: "neutral",
							value: `${stats.bodyFat.delta > 0 ? "+" : ""}${stats.bodyFat.delta}%`,
						}
					: null,
		},
		{
			key: "arms",
			label: "Arms",
			value:
				stats?.arms?.current != null
					? `${stats.arms.current} in`
					: "--",
			icon: "RulerIcon",
			trend:
				stats?.arms?.delta != null
					? {
							direction:
								stats.arms.delta > 0
									? "up"
									: stats.arms.delta < 0
										? "down"
										: "neutral",
							value: `${stats.arms.delta > 0 ? "+" : ""}${stats.arms.delta} in`,
						}
					: null,
		},
	];

	return { statCards };
}
