"use client";

import {
	ChatTextIcon,
	CheckCircleIcon,
	ClipboardTextIcon,
	PulseIcon,
	TrophyIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getLastSessionNote } from "@/actions/workout";
import { CardsHeader, useUnits } from "@/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useWorkoutSession } from "@/hooks";
import { wouldBePR } from "@/hooks/workout-log-hook/use-exercise-performance";
import type { LoggedSet } from "@/types";
import type { ExercisePerformanceWithPR } from "@/types/workout-log";

interface ActiveSessionSummaryProps {
	loggedSets: LoggedSet[];
	notes: string;
	setNotes: (notes: string) => void;
	performanceMap: Record<string, ExercisePerformanceWithPR | null>;
	programId?: string;
	dayIndex?: number;
	onSuccess?: () => void;
}

interface ExerciseSummary {
	exercise: string;
	sets: LoggedSet[];
	isPR: boolean;
	bestSet: LoggedSet | null;
	exerciseNote?: string | null;
}

export function ActiveSessionSummary({
	loggedSets,
	notes,
	setNotes,
	performanceMap,
	programId,
	dayIndex,
	onSuccess,
}: ActiveSessionSummaryProps) {
	const [lastSessionNote, setLastSessionNote] = useState<string | null>(null);
	const [isLoadingNote, setIsLoadingNote] = useState(false);

	const { weightUnit } = useUnits();

	const findPerfEntry = (exercise: string) =>
		performanceMap[exercise] ??
		Object.entries(performanceMap).find(
			([name]) =>
				name.trim().toLowerCase() === exercise.trim().toLowerCase(),
		)?.[1] ??
		null;

	const grouped = loggedSets.reduce<Record<string, LoggedSet[]>>(
		(acc, set) => {
			acc[set.exerciseName] = acc[set.exerciseName] || [];
			acc[set.exerciseName].push(set);
			return acc;
		},
		{},
	);

	const exerciseSummaries: ExerciseSummary[] = Object.entries(grouped).map(
		([exercise, sets]) => {
			const bestSet = sets.reduce((best, current) => {
				const currentScore =
					(Number(current.weight) || 0) *
					(1 + (Number(current.reps) || 0) / 30);
				const bestScore =
					(Number(best.weight) || 0) *
					(1 + (Number(best.reps) || 0) / 30);
				return currentScore > bestScore ? current : best;
			}, sets[0]);

			const previousBest = findPerfEntry(exercise)?.overallBest ?? null;

			const isPR = wouldBePR(
				bestSet.weight,
				bestSet.reps,
				previousBest
					? { weight: previousBest.weight, reps: previousBest.reps }
					: null,
			);

			const exerciseNote =
				sets.find((s) => s.notes && s.notes.trim() !== "")?.notes ||
				null;

			return { exercise, sets, isPR, bestSet, exerciseNote };
		},
	);

	const totalSets = loggedSets.length;
	const totalExercises = Object.keys(grouped).length;
	const prCount = exerciseSummaries.filter((ex) => ex.isPR).length;

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

	const { isSubmitting, submitWorkout } = useWorkoutSession({
		programId,
		dayIndex,
		onSuccess: () => {
			setNotes("");
			onSuccess?.();
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

			if (result.success) {
				const serverPRCount = result.data?.prCount ?? 0;

				if (serverPRCount > 0) {
					toast.success("New Personal Records!", {
						description: `You achieved ${serverPRCount} PR${
							serverPRCount > 1 ? "s" : ""
						} in this session!`,
						duration: 5000,
					});
				}

				toast.success("Workout completed!", {
					description: `Successfully logged ${totalSets} sets across ${totalExercises} exercises.`,
					duration: 4000,
				});
			} else {
				toast.error("Failed to save workout", {
					description:
						result.error ||
						"There was an error saving your session. Please try again.",
					duration: 4000,
				});
			}
		} catch {
			toast.dismiss(loadingToast);
			toast.error("Unexpected error", {
				description:
					"An unexpected error occurred while saving your workout.",
				duration: 4000,
			});
		}
	};

	return (
		<Card size="sm" className="relative fcard-flat card-ease">
			<CardsHeader icon={PulseIcon} title="Session Summary" />

			<CardContent className="p-4 pt-1 fcol4">
				{loggedSets.length === 0 ? (
					<p className="text-xs fmuted italic py-1">
						No sets logged yet for this session. Add sets above or
						through quick add.
					</p>
				) : (
					<>
						<div className="fcb text-xs text-muted-foreground px-1">
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
								<span className="text-primary font-bold fcy gap-1">
									<TrophyIcon
										className="size-3.5"
										weight="duotone"
									/>
									{prCount} PR{prCount > 1 ? "s" : ""}
								</span>
							)}
						</div>

						<div className="space-y-2.5">
							{exerciseSummaries.map(
								({ exercise, sets, isPR, exerciseNote }) => (
									<div
										key={exercise}
										className={`rounded-none border p-3 bg-background/50 space-y-2 ${
											isPR
												? "border-primary/50 bg-primary/5"
												: "border-border/50"
										}`}
									>
										<div className="fcb">
											<div className="fcy gap-2">
												<h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
													{exercise}
												</h3>
												{isPR && (
													<Badge
														variant="default"
														className="h-4 px-1.5 text-[8px] font-bold uppercase tracking-wider bg-primary text-primary-foreground border-0"
													>
														<TrophyIcon
															className="size-2.5 mr-0.5"
															weight="duotone"
														/>
														PR
													</Badge>
												)}
											</div>
											<span className="text-[10px] text-muted-foreground">
												{sets.length} set
												{sets.length > 1 ? "s" : ""}
											</span>
										</div>

										{exerciseNote && (
											<div className="fcy gap-1.5 text-[11px] text-muted-foreground bg-accent/30 p-1.5 border border-border/30">
												<ChatTextIcon
													className="size-3.5 text-primary sh0"
													weight="bold"
												/>
												<span className="italic">
													~ {exerciseNote}
												</span>
											</div>
										)}

										<div className="fwrap gap-1.5">
											{sets.map((s, idx) => {
												const previousBest =
													findPerfEntry(exercise)
														?.overallBest ?? null;

												const isSetPR = wouldBePR(
													s.weight,
													s.reps,
													previousBest
														? {
																weight: previousBest.weight,
																reps: previousBest.reps,
															}
														: null,
												);
												const hasSetNote = Boolean(
													s.notes &&
														s.notes.trim() !== "",
												);

												return (
													<Popover key={s.id ?? idx}>
														<PopoverTrigger
															nativeButton={false}
															render={
																<span
																	className={`text-xs px-2 py-0.5 rounded-none border cursor-pointer fcy gap-1 ${
																		isSetPR
																			? "bg-primary/20 border-primary/50 text-primary"
																			: "bg-accent/50 border-border/50 text-foreground"
																	}`}
																>
																	{isSetPR && (
																		<TrophyIcon
																			className="size-2.5 mb-0.5 mr-1"
																			weight="duotone"
																		/>
																	)}
																	<span className="text-xs">
																		Set{" "}
																		{idx +
																			1}
																		:{" "}
																		{
																			s.weight
																		}
																		{
																			weightUnit
																		}{" "}
																		×{" "}
																		{s.reps}
																		{s.rpe
																			? ` @ RPE ${s.rpe}`
																			: ""}
																	</span>
																</span>
															}
														/>
														<PopoverContent className="w-auto max-w-xs p-2 text-xs space-y-1">
															{isSetPR && (
																<p className="font-semibold text-primary fcy gap-1">
																	<TrophyIcon
																		className="size-3.5"
																		weight="duotone"
																	/>
																	Personal
																	Record!
																</p>
															)}
															<p className="text-muted-foreground">
																{s.weight}
																{weightUnit} ×{" "}
																{s.reps}
																{s.rpe
																	? ` @ RPE ${s.rpe}`
																	: ""}
															</p>
															{hasSetNote && (
																<p className="text-foreground italic pt-1 border-t border-border/40">
																	"{s.notes}"
																</p>
															)}
														</PopoverContent>
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
					{(lastSessionNote || isLoadingNote) && (
						<div className="rounded-none border border-primary/20 bg-primary/5 p-2.5">
							{isLoadingNote ? (
								<div className="space-y-2">
									<Skeleton className="h-3 w-24 rounded-sm" />
									<Skeleton className="h-3 w-full rounded-sm" />
								</div>
							) : (
								<div className="ft gap-2">
									<ClipboardTextIcon
										className="size-3.5 text-primary sh0 mt-0.5"
										weight="bold"
									/>
									<div className="fgrow">
										<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
											Last Session Note
										</span>
										<p className="text-xs text-foreground italic mt-0.5">
											{lastSessionNote}
										</p>
									</div>
								</div>
							)}
						</div>
					)}

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
