"use client";

import {
	CheckCircleIcon,
	ClipboardTextIcon,
	PulseIcon,
	TrophyIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { LoggedSet } from "@/types";
import { useWorkoutSession } from "@/hooks";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { getLastSessionNote } from "@/actions/workout";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface ActiveSessionSummaryProps {
	loggedSets: LoggedSet[];
	notes: string;
	setNotes: (notes: string) => void;
	programId?: string;
	dayIndex?: number;
	onSuccess?: () => void;
}

interface ExerciseSummary {
	exercise: string;
	sets: LoggedSet[];
	isPR: boolean;
	bestSet: LoggedSet | null;
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

	// Check for PRs and derive best performance set per exercise
	const exerciseSummaries: ExerciseSummary[] = Object.entries(grouped).map(
		([exercise, sets]) => {
			// Find the best set using calculated 1RM (Epley formula: weight * (1 + reps / 30))
			const bestSet = sets.reduce((best, current) => {
				const currentWeight = Number(current.weight) || 0;
				const currentReps = Number(current.reps) || 0;
				const bestWeight = Number(best.weight) || 0;
				const bestReps = Number(best.reps) || 0;

				const currentScore = currentWeight * (1 + currentReps / 30);
				const bestScore = bestWeight * (1 + bestReps / 30);

				return currentScore > bestScore ? current : best;
			}, sets[0]);

			// Check if any set is flagged as PR by DB or context
			const isPR = sets.some(
				(set) => (set as Record<string, unknown>).isPR === true,
			);

			return {
				exercise,
				sets,
				isPR,
				bestSet,
			};
		},
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

			// Show PR celebration if any PRs were achieved
			const prCount = exerciseSummaries.filter((ex) => ex.isPR).length;
			if (prCount > 0) {
				toast.success("🏆 New Personal Records!", {
					description: `You achieved ${prCount} PR${prCount > 1 ? "s" : ""} in this session!`,
					duration: 5000,
				});
			}

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

		const loadingToast = toast.loading("Saving your workout...", {
			description: "Please wait while we log your session.",
		});

		try {
			const result = await submitWorkout(loggedSets, notes);
			toast.dismiss(loadingToast);

			if (!result.success) {
				toast.error("Failed to save workout", {
					description:
						result.error ||
						"There was an error saving your session. Please try again.",
					duration: 4000,
				});
			}
		} catch (error) {
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
	const prCount = exerciseSummaries.filter((ex) => ex.isPR).length;

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
						{prCount > 0 && (
							<Popover>
								<PopoverTrigger
									nativeButton={false}
									render={
										<Badge
											variant="default"
											className="h-4 px-1.5 text-[8px] font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white border-0 cursor-pointer"
										>
											<TrophyIcon
												className="size-2.5 mr-0.5"
												weight="fill"
											/>
											{prCount} PR{prCount > 1 ? "s" : ""}
										</Badge>
									}
								/>
								<PopoverContent className="w-auto p-2.5 text-xs">
									<div className="space-y-1.5">
										<p className="font-semibold flex items-center gap-1">
											<span>🏆</span> Personal Records
										</p>
										<ul className="space-y-1 text-muted-foreground">
											{exerciseSummaries
												.filter((ex) => ex.isPR)
												.map((ex) => (
													<li
														key={ex.exercise}
														className="text-xs"
													>
														<strong className="text-foreground">
															{ex.exercise}:
														</strong>{" "}
														{ex.bestSet?.weight}kg ×{" "}
														{ex.bestSet?.reps}
														{ex.bestSet?.rpe
															? ` @ RPE ${ex.bestSet.rpe}`
															: ""}
													</li>
												))}
										</ul>
									</div>
								</PopoverContent>
							</Popover>
						)}
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
							{prCount > 0 && (
								<Popover>
									<PopoverTrigger
										nativeButton={false}
										render={
											<span className="text-amber-500 font-bold cursor-pointer hover:underline">
												🏆 {prCount} PR
												{prCount > 1 ? "s" : ""}
											</span>
										}
									/>
									<PopoverContent className="w-auto p-2.5 text-xs">
										<div className="space-y-1.5">
											<p className="font-semibold flex items-center gap-1">
												<span>🏆</span> PR Achievements
											</p>
											<ul className="space-y-1 text-muted-foreground">
												{exerciseSummaries
													.filter((ex) => ex.isPR)
													.map((ex) => (
														<li
															key={ex.exercise}
															className="text-xs"
														>
															<strong className="text-foreground">
																{ex.exercise}:
															</strong>{" "}
															{ex.bestSet?.weight}
															kg ×{" "}
															{ex.bestSet?.reps}
															{ex.bestSet?.rpe
																? ` @ RPE ${ex.bestSet.rpe}`
																: ""}
														</li>
													))}
											</ul>
										</div>
									</PopoverContent>
								</Popover>
							)}
						</div>

						<div className="space-y-2.5">
							{exerciseSummaries.map(
								({ exercise, sets, isPR, bestSet }) => (
									<div
										key={exercise}
										className={`rounded-none border p-3 bg-background/50 space-y-2 ${
											isPR
												? "border-amber-500/50 bg-amber-500/5"
												: "border-border/50"
										}`}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
													{exercise}
												</h3>
												{isPR && (
													<Popover>
														<PopoverTrigger
															nativeButton={false}
															render={
																<Badge
																	variant="default"
																	className="h-4 px-1.5 text-[8px] font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white border-0 cursor-pointer"
																>
																	<TrophyIcon
																		className="size-2.5 mr-0.5"
																		weight="fill"
																	/>
																	PR
																</Badge>
															}
														/>
														<PopoverContent className="w-auto p-2.5 text-xs">
															<p className="font-semibold text-amber-500">
																New Personal
																Record!
															</p>
															<p className="text-muted-foreground mt-1">
																Best Set:{" "}
																<strong className="text-foreground">
																	{
																		bestSet?.weight
																	}
																	kg ×{" "}
																	{
																		bestSet?.reps
																	}
																</strong>
																{bestSet?.rpe
																	? ` @ RPE ${bestSet.rpe}`
																	: ""}
															</p>
														</PopoverContent>
													</Popover>
												)}
											</div>
											<span className="text-[10px] text-muted-foreground">
												{sets.length} set
												{sets.length > 1 ? "s" : ""}
											</span>
										</div>
										<div className="flex flex-wrap gap-1.5">
											{sets.map((s, idx) => {
												const isSetPR =
													(
														s as Record<
															string,
															unknown
														>
													).isPR === true;
												return (
													<Popover key={s.id ?? idx}>
														<PopoverTrigger
															nativeButton={false}
															render={
																<span
																	className={`text-xs font-mono px-2 py-0.5 rounded-none border cursor-pointer ${
																		isSetPR
																			? "bg-amber-500/20 border-amber-500/50 text-amber-700 dark:text-amber-400"
																			: "bg-accent/50 border-border/50 text-foreground"
																	}`}
																>
																	Set{" "}
																	{idx + 1}:{" "}
																	{s.weight}kg
																	× {s.reps}
																	{s.rpe
																		? ` @ RPE ${s.rpe}`
																		: ""}
																	{isSetPR &&
																		" 🏆"}
																</span>
															}
														/>
														{isSetPR && (
															<PopoverContent className="w-auto p-2 text-xs">
																<p className="font-semibold text-amber-500">
																	🏆 Personal
																	Record!
																</p>
																<p className="text-muted-foreground mt-0.5">
																	{s.weight}kg
																	× {s.reps}
																	{s.rpe
																		? ` @ RPE ${s.rpe}`
																		: ""}
																</p>
															</PopoverContent>
														)}
													</Popover>
												);
											})}
										</div>
									</div>
								),
							)}
						</div>
					</>
				)}

				<div className="space-y-3 pt-1">
					{/* Last Session Note */}
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
							<Spinner className="size-4" />
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
