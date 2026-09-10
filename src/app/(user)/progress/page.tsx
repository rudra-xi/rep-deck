import {
	getLiftDetails,
	getRecentSessions,
	getStrengthOverview,
	getTrainingFrequency,
} from "@/actions/progress";
import ProgressClientPage from "./client-page";

export default async function Progress() {
	// Fetch initial data in parallel on the server
	const [
		initialStrengthOverview,
		initialLiftDetails,
		initialSessions,
		initialFrequency,
	] = await Promise.all([
		getStrengthOverview("3M"),
		getLiftDetails("bench"),
		getRecentSessions(5),
		getTrainingFrequency(),
	]);

	return (
		<ProgressClientPage
			initialStrengthOverview={initialStrengthOverview}
			initialLiftDetails={initialLiftDetails}
			initialSessions={initialSessions}
			initialFrequency={initialFrequency}
		/>
	);
}
