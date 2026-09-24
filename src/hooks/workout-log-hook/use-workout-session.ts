import { useState } from "react";
import { toast } from "sonner";
import { finishWorkoutSession } from "@/actions/workout";
import type { LoggedSet } from "@/types";

interface UseWorkoutSessionProps {
	programId?: string;
	dayIndex?: number;
	onSuccess?: () => void;
}

export function useWorkoutSession({
	programId,
	dayIndex,
	onSuccess,
}: UseWorkoutSessionProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const submitWorkout = async (
		loggedSets: LoggedSet[],
		notes: string,
		date?: Date,
	) => {
		if (loggedSets.length === 0) {
			toast.error(
				"Please add at least one set before completing the session.",
			);
			return { success: false };
		}

		setIsSubmitting(true);

		try {
			const setCounts: Record<string, number> = {};
			const formattedSets = loggedSets.map((s) => {
				setCounts[s.exerciseName] =
					(setCounts[s.exerciseName] || 0) + 1;

				return {
					exerciseName: s.exerciseName,
					templateId: s.templateId || undefined,
					setNumber: setCounts[s.exerciseName],
					weight: Number(s.weight),
					reps: Number(s.reps),
					rpe: s.rpe ? Number(s.rpe) : undefined,
					notes: s.notes || "",
				};
			});

			const res = await finishWorkoutSession({
				programId,
				dayIndex,
				notes,
				date: date?.toISOString(),
				sets: formattedSets,
			});

			if (res.success) {
				onSuccess?.();
				return { success: true, data: res };
			}

			toast.error(res.error || "Failed to save workout session.");
			return { success: false, error: res.error };
		} catch (error) {
			console.error("Error saving workout:", error);
			toast.error("An unexpected error occurred while saving.");
			return { success: false, error: String(error) };
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		isSubmitting,
		submitWorkout,
	};
}
