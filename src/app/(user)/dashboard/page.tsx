import { getDashboardData } from "@/actions/dashboard";
import { getScheduleHeatmap } from "@/actions/progress";
import { DashboardClientPage } from "./client-page";

export default async function DashboardPage() {
  const [dashboardData, scheduleData] = await Promise.all([
		getDashboardData(),
		getScheduleHeatmap(24),
	]);
  return (
		<DashboardClientPage
			initialData={dashboardData}
			scheduleData={scheduleData}
		/>
	);
}
