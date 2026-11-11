import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getPlanDayBreakdown, getScheduleHeatmap } from "@/actions/progress";
import { getActiveWorkoutPlan } from "@/actions/workout";
import ProgressClientPage from "./client-page";

export default async function Progress() {
	const { supabaseUser } = await getCurrentUser();
	if (!supabaseUser) redirect("/");

	const scheduleData = await getScheduleHeatmap(52);
	const [breakdown, plan] = await Promise.all([
		getPlanDayBreakdown(3),
		getActiveWorkoutPlan(),
	]);

	return (
		<ProgressClientPage
			scheduleData={scheduleData}
			initialBreakdown={breakdown}
			anchorWeekday={plan?.anchorWeekday ?? null}
			programName={plan?.name}
		/>
	);
}
