import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getScheduleHeatmap } from "@/actions/progress";
import ProgressClientPage from "./client-page";

export default async function Progress() {
	const { supabaseUser } = await getCurrentUser();
	if (!supabaseUser) redirect("/");

	const scheduleData = await getScheduleHeatmap(52);

	return <ProgressClientPage scheduleData={scheduleData} />;
}
