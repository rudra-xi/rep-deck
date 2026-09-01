import { getActiveWorkoutPlan } from "@/actions/workout";
import WorkoutLogClientView from "./client-page";

export default async function WorkoutLogPage() {
	const activePlan = await getActiveWorkoutPlan();

	return <WorkoutLogClientView initialPlan={activePlan} />;
}
