import { useEffect, useState } from "react";
import { getDashboardData } from "@/actions/dashboard";

export function useDashboardData() {
	const [data, setData] = useState<Awaited<
		ReturnType<typeof getDashboardData>
	> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadData() {
			try {
				setLoading(true);
				const result = await getDashboardData();
				setData(result);
				setError(null);
			} catch (err) {
				console.error("Failed to load dashboard data", err);
				setError(
					err instanceof Error ? err.message : "Failed to load data",
				);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	const refresh = async () => {
		try {
			setLoading(true);
			const result = await getDashboardData();
			setData(result);
			setError(null);
		} catch (err) {
			console.error("Failed to refresh dashboard data", err);
			setError(
				err instanceof Error ? err.message : "Failed to refresh data",
			);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, refresh };
}
