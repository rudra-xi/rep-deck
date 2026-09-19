import { notFound } from "next/navigation";
import { getWorkoutSessionDetails } from "@/actions/workout";
import { WorkoutDetail } from "@/workout-log";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function WorkoutPage({ params }: PageProps) {
	const { id } = await params;

	if (!id) {
		notFound();
	}

	const session = await getWorkoutSessionDetails(id);

	if (!session) {
		notFound();
	}

	return <WorkoutDetail session={session} sessions={session.sessions} />;
}
