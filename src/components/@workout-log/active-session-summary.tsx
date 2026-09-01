"use client";

import {
	CheckCircleIcon,
	ClipboardTextIcon,
	PulseIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { LoggedSet } from "@/types";
import { useWorkoutSession } from "@/hooks";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useEffect, useState } from "react";
import { getLastSessionNote } from "@/actions/workout";

interface ActiveSessionSummaryProps {
	loggedSets: LoggedSet[];
	notes: string;
	setNotes: (notes: string) => void;
	programId?: string;
	dayIndex?: number;
	onSuccess?: () => void;
}

export function ActiveSessionSummary({
	loggedSets,
	notes,
	setNotes,
	programId,
	dayIndex,
	onSuccess,
}: ActiveSessionSummaryProps) {
	const [lastSessionNote, setLastSessionNote] = useState<string | null>(null);
	const [isLoadingNote, setIsLoadingNote] = useState(false);

	// Group sets by exercise name
	const grouped = loggedSets.reduce<Record<string, LoggedSet[]>>(
		(acc, set) => {
			acc[set.exerciseName] = acc[set.exerciseName] || [];
			acc[set.exerciseName].push(set);
			return acc;
		},
		{},
	);

	// Fetch last session note for this day
	useEffect(() => {
		async function fetchLastSessionNote() {
			if (!programId || dayIndex === undefined) return;

			setIsLoadingNote(true);
			try {
				const note = await getLastSessionNote(programId, dayIndex);
				setLastSessionNote(note);
			} catch (error) {
				console.error("Failed to fetch last session note:", error);
			} finally {
				setIsLoadingNote(false);
			}
		}

		fetchLastSessionNote();
	}, [programId, dayIndex]);

	// Use the workout session hook
	const { isSubmitting, submitWorkout } = useWorkoutSession({
		programId,
		dayIndex,
		onSuccess: () => {
			setNotes("");
			onSuccess?.();
			toast.success("Workout completed!", {
				description: `Successfully logged ${loggedSets.length} sets across ${Object.keys(grouped).length} exercises.`,
				duration: 4000,
			});
		},
	});

	const handleFinish = async () => {
		if (loggedSets.length === 0) {
			toast.error("No sets to log", {
				description:
					"Please add at least one set before finishing your workout.",
				duration: 3000,
			});
			return;
		}

		// Debug: Check if notes are present
		console.log(
			"📝 Sets with notes before submitting:",
			loggedSets.map((s) => ({
				name: s.exerciseName,
				notes: s.notes,
			})),
		);

		// Show loading toast
		const loadingToast = toast.loading("Saving your workout...", {
			description: "Please wait while we log your session.",
		});

		try {
			// Submit the raw loggedSets - the hook will format them
			const result = await submitWorkout(loggedSets, notes);

			// Dismiss loading toast
			toast.dismiss(loadingToast);

			if (result.success) {
				// Success toast is already handled in the onSuccess callback
			} else {
				toast.error("Failed to save workout", {
					description:
						result.error ||
						"There was an error saving your session. Please try again.",
					duration: 4000,
				});
			}
		} catch (error) {
			// Dismiss loading toast
			toast.dismiss(loadingToast);

			toast.error("Unexpected error", {
				description:
					"An unexpected error occurred while saving your workout.",
				duration: 4000,
			});
		}
	};

	const totalSets = loggedSets.length;
	const totalExercises = Object.keys(grouped).length;

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 base-ease hover:border-primary/50 rounded-none shadow-none space-y-0"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div>
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<PulseIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						Session Summary
					</CardTitle>
				</div>
				<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
					<ClipboardTextIcon className="size-4" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{loggedSets.length === 0 ? (
					<p className="text-xs text-muted-foreground italic py-1">
						No sets logged yet for this session. Add sets above or
						through quick add.
					</p>
				) : (
					<>
						<div className="flex items-center justify-between text-xs text-muted-foreground px-1">
							<span>
								Total Sets:{" "}
								<strong className="text-foreground">
									{totalSets}
								</strong>
							</span>
							<span>
								Exercises:{" "}
								<strong className="text-foreground">
									{totalExercises}
								</strong>
							</span>
						</div>
						<div className="space-y-2.5">
							{Object.entries(grouped).map(([exercise, sets]) => (
								<div
									key={exercise}
									className="rounded-none border border-border/50 p-3 bg-background/50 space-y-2"
								>
									<div className="flex items-center justify-between">
										<h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
											{exercise}
										</h3>
										<span className="text-[10px] text-muted-foreground">
											{sets.length} set
											{sets.length > 1 ? "s" : ""}
										</span>
									</div>
									<div className="flex flex-wrap gap-1.5">
										{sets.map((s, idx) => (
											<span
												key={s.id}
												className="text-xs font-mono px-2 py-0.5 rounded-none bg-accent/50 border border-border/50 text-foreground"
											>
												Set {idx + 1}: {s.weight}kg ×{" "}
												{s.reps} @ RPE {s.rpe}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</>
				)}

				<div className="space-y-3 pt-1">
					{/* Last Session Note - Display above the textarea */}
					{lastSessionNote && (
						<div className="rounded-none border border-primary/20 bg-primary/5 p-2.5">
							<div className="flex items-start gap-2">
								<ClipboardTextIcon
									className="size-3.5 text-primary shrink-0 mt-0.5"
									weight="bold"
								/>
								<div className="flex-1">
									<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
										Last Session Note
									</span>
									<p className="text-xs text-foreground italic mt-0.5">
										{lastSessionNote}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Loading state for note */}
					{isLoadingNote && (
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<Spinner className="size-3" />
							<span>Loading last session note...</span>
						</div>
					)}

					{/* Current Session Note Input */}
					<Textarea
						placeholder="Workout notes (e.g., felt strong on bench, energy was high)..."
						className="rounded-none text-xs resize-none h-20 border-border/50 bg-background/50 focus:border-primary/50"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
					/>
					<Button
						disabled={isSubmitting || loggedSets.length === 0}
						onClick={handleFinish}
						className="rounded-none w-full gap-2 font-bold uppercase tracking-wider text-xs cursor-pointer"
					>
						{isSubmitting ? (
							<Spinner />
						) : (
							<CheckCircleIcon className="size-4" weight="bold" />
						)}
						{isSubmitting ? "Saving Session..." : "Finish Workout"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
