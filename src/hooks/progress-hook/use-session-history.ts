// hooks/useSessionHistory.ts
import { useState, useEffect, useMemo } from "react";
import { getRecentSessions } from "@/actions/progress";
import { useRouter } from "next/navigation";

export function useSessionHistory(
	initialData: any[] = [],
	propLoading: boolean = false,
) {
	const router = useRouter();
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
		return sessions.map((s) => ({
			...s,
			volume:
				typeof s.totalVolume === "number"
					? s.totalVolume
					: Number(
							s.totalVolume?.toString().replace(/[^0-9.]/g, ""),
						) || 0,
		}));
	}, [sessions]);

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
