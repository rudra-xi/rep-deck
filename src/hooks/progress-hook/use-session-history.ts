import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getRecentSessions } from "@/actions/progress";
import { useUnits } from "@/common";
import type { SessionHistoryItem } from "@/types/progress";

export function useSessionHistory(
	initialData: SessionHistoryItem[] = [],
	propLoading: boolean = false,
) {
	const router = useRouter();
	const { fmtWeight } = useUnits();

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

	const chartData = useMemo(() => {
		return sessions.map((s) => {
			const rawKg =
				typeof s.totalVolumeKg === "number" ? s.totalVolumeKg : 0;

			return {
				...s,
				volume: fmtWeight(rawKg),
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
