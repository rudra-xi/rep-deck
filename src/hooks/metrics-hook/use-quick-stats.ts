import { useMemo } from "react";

interface QuickStatsData {
	weight?: {
		current: number | null;
		delta: number | null;
		unit?: string;
	};
	bodyFat?: {
		current: number | null;
		delta: number | null;
		unit?: string;
	};
	arms?: {
		current: number | null;
		delta: number | null;
		unit?: string;
	};
	thighs?: {
		current: number | null;
		delta: number | null;
		unit?: string;
	};
	notes?: string | null;
}

export function useQuickStats(stats?: QuickStatsData) {
	const statCards = useMemo(() => {
		const weightUnit = stats?.weight?.unit ?? "kg";
		const armsUnit = stats?.arms?.unit ?? "in";

		return [
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
						? `${stats.weight.current} ${weightUnit}`
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
								value: `${stats.weight.delta > 0 ? "+" : ""}${stats.weight.delta} ${weightUnit}`,
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
						? `${stats.arms.current} ${armsUnit}`
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
								value: `${stats.arms.delta > 0 ? "+" : ""}${stats.arms.delta} ${armsUnit}`,
							}
						: null,
			},
		];
	}, [stats]);

	return { statCards };
}
