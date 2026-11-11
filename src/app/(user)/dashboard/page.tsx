import { getDashboardData } from "@/actions/dashboard";
import { getPlanDayBreakdown, getScheduleHeatmap } from "@/actions/progress";
import { getActiveWorkoutPlan } from "@/actions/workout";
import { DashboardClientPage } from "./client-page";

export default async function DashboardPage() {
	const [dashboardData, scheduleData, breakdownData, activePlan] =
		await Promise.all([
			getDashboardData(),
			getScheduleHeatmap(24),
			getPlanDayBreakdown(2),
			getActiveWorkoutPlan(),
		]);

	return (
		<DashboardClientPage
			initialData={dashboardData}
			scheduleData={scheduleData}
			breakdownData={breakdownData}
			anchorWeekday={activePlan?.anchorWeekday ?? null}
			programName={activePlan?.name}
		/>
	);
}