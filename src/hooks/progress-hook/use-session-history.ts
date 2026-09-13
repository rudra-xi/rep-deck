// hooks/progress-hook/use-session-history.ts
import { useState, useEffect, useMemo } from "react";
import { getRecentSessions } from "@/actions/progress";
import { useRouter } from "next/navigation";
import { useUnits } from "@/common"; // ✅ ADD

export function useSessionHistory(
	initialData: any[] = [],
	propLoading: boolean = false,
) {
	const router = useRouter();
	const { fmtWeight } = useUnits(); // ✅ ADD

	const [sessions, setSessions] = useState(initialData);
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
			getRecentSessions().then((res) => {
				if (res) setSessions(res);
				setLoading(false);
			});
		} else {
			setSessions(initialData);
			setLoading(false);
		}
	}, [initialData, propLoading]);

	// ✅ Convert volume to user's unit for chart display
	const chartData = useMemo(() => {
		return sessions.map((s) => {
			// Support both new shape (totalVolumeKg: number)
			// and legacy shape (totalVolume: "1,234 kg")
			const rawKg =
				typeof s.totalVolumeKg === "number"
					? s.totalVolumeKg
					: typeof s.totalVolume === "number"
						? s.totalVolume
						: Number(
								s.totalVolume
									?.toString()
									.replace(/[^0-9.]/g, ""),
							) || 0;

			return {
				...s,
				volume: fmtWeight(rawKg), // ✅ user's unit
			};
		});
	}, [sessions, fmtWeight]);

	const navigateToSession = (id: string) => {
		router.push(`/workout-log/${id}`);
	};

	return {
		sessions,
		chartData,
		loading,
		hasData: sessions.length > 0,
		navigateToSession,
	};
}
