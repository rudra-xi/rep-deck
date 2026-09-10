"use client";

import { useState } from "react";
import {
	CaretDownIcon,
	CaretUpIcon,
	CheckIcon,
	ChecksIcon,
	ChatTextIcon,
	BarbellIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import type { LoggedSet } from "@/types";
import { useExerciseInputs, useExercisePerformance } from "@/hooks";
import { Spinner } from "@/components/ui/spinner";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { InlineStatSkeleton } from "@/skeletons";

interface ExerciseTemplate {
	id: string;
	name: string;
	type: string;
	targetSets: number | null;
	targetRepRange: string | null;
}

interface PlannedExercisesProps {
	exercises: ExerciseTemplate[];
	// Replaced single set handler with batch submission/removal
	onAddExerciseSets: (
		sets: Array<Omit<LoggedSet, "id"> & { templateId?: string }>,
	) => void;
	onRemoveExerciseSets?: (templateId: string) => void;
}

export function PlannedExercises({
	exercises,
	onAddExerciseSets,
	onRemoveExerciseSets,
}: PlannedExercisesProps) {
	const [completed, setCompleted] = useState<Record<string, boolean>>({});
	const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
	const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>(
		{},
	);

	const { handleInputChange, getSetInput } = useExerciseInputs();
	const { lastLogs, isLoading } = useExercisePerformance(exercises);

	const handleToggleDone = (ex: ExerciseTemplate) => {
		const isCurrentlyCompleted = !!completed[ex.id];
		const nextCompletedState = !isCurrentlyCompleted;

		setCompleted((prev) => ({
			...prev,
			[ex.id]: nextCompletedState,
		}));

		if (nextCompletedState) {
			// User marked as DONE -> Collect all valid set inputs for this exercise
			const targetSetsCount = ex.targetSets || 1;
			const validSets: Array<
				Omit<LoggedSet, "id"> & { templateId?: string }
			> = [];
			const currentNote = exerciseNotes[ex.id]?.trim() || "";

			for (let setNum = 1; setNum <= targetSetsCount; setNum++) {
				const setData = getSetInput(ex.id, setNum);

				// Only add sets that have both weight and reps filled out
				if (setData?.weight && setData?.reps) {
					validSets.push({
						exerciseName: ex.name,
						templateId: ex.id,
						setNumber: setNum,
						weight: Number(setData.weight),
						reps: Number(setData.reps),
						rpe: setData.rpe ? String(setData.rpe) : "",
						notes: currentNote,
					});
				}
			}

			if (validSets.length > 0) {
				onAddExerciseSets(validSets);
			}
		} else {
			// User UNMARKED -> Remove logged sets for this exercise if handler exists
			if (onRemoveExerciseSets) {
				onRemoveExerciseSets(ex.id);
			}
		}
	};

	if (!exercises || exercises.length === 0) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[200px] w-full"
			>
				<Empty className="p-6 sm:p-8 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<BarbellIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Exercises Found
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
							This day doesn't have any exercises configured yet.
							Add exercises to start logging your workout.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							nativeButton={false}
							variant="outline"
							size="sm"
							className="text-xs mt-1"
							render={<Link href="/plans">Manage Exercises</Link>}
						/>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
			{exercises.map((ex) => {
				const setArray = Array.from(
					{ length: ex.targetSets || 1 },
					(_, i) => i + 1,
				);
				const isOpen = openStates[ex.id] ?? true;
				const isCompleted = !!completed[ex.id];

				const perfData = lastLogs[ex.id];
				const lastBest = perfData?.lastBest?.formatted ?? null;
				const overallBest = perfData?.overallBest?.formatted ?? null;
				const lastNote = perfData?.lastNote ?? null;

				return (
					<Card
						key={ex.id}
						size="sm"
						className={`h-fit border bg-card/40 backdrop-blur-sm rounded-none shadow-none transition-all ${
							isCompleted
								? "border-primary/50 bg-primary/5 opacity-80"
								: "border-border/60 hover:border-primary/40"
						}`}
					>
						<CardHeader className="p-3 pb-2 space-y-2">
							<div className="flex items-center justify-between gap-2">
								<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
									{ex.name}
								</CardTitle>
								<div className="flex items-center gap-1.5 shrink-0">
									<Badge
										variant="outline"
										className="text-[9px] px-1.5 py-0 h-4 font-semibold uppercase rounded-none border-border/60"
									>
										{ex.type}
									</Badge>
									<Button
										size="sm"
										variant={
											isCompleted ? "default" : "ghost"
										}
										onClick={() => handleToggleDone(ex)}
										className="h-5 px-1.5 text-[10px] rounded-none gap-1 cursor-pointer"
									>
										{isCompleted ? (
											<ChecksIcon
												className="size-3"
												weight="bold"
											/>
										) : (
											<CheckIcon
												className="size-3"
												weight="bold"
											/>
										)}
										{isCompleted ? "Done" : "Mark"}
									</Button>
								</div>
							</div>

							<div className="flex items-end justify-between">
								<div className="flex flex-col text-[10px] text-muted-foreground pt-1.5 min-h-8">
									<span>
										PR:{" "}
										<span className="text-foreground font-semibold tracking-wider">
											{isLoading ? (
												<InlineStatSkeleton />
											) : (
												overallBest || "—"
											)}
										</span>
									</span>

									<span className="gap-1">
										Last: PR:{" "}
										<span className="text-foreground font-semibold tracking-wider">
											{isLoading ? (
												<InlineStatSkeleton />
											) : (
												overallBest || "—"
											)}
										</span>
									</span>
								</div>

								{lastNote && (
									<Popover>
										<PopoverTrigger
											nativeButton={false}
											render={
												<Badge
													variant="outline"
													className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-accent/50"
												>
													<ChatTextIcon
														className="size-3.5 text-primary shrink-0"
														weight="bold"
													/>
													<span className="italic truncate max-w-46">
														~{" "}
														{lastNote.length > 40
															? lastNote.slice(
																	0,
																	40,
																) + "..."
															: lastNote}{" "}
														~
													</span>
												</Badge>
											}
										/>
										<PopoverContent className="max-w-xs text-xs p-3">
											<span className="italic">
												{lastNote}
											</span>
										</PopoverContent>
									</Popover>
								)}
							</div>
						</CardHeader>

						<Collapsible
							open={isOpen}
							onOpenChange={(open) =>
								setOpenStates((prev) => ({
									...prev,
									[ex.id]: open,
								}))
							}
							className="border-t border-border/30 bg-background/20"
						>
							<div className="flex items-center justify-between px-3 py-1.5 bg-accent/15">
								<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
									Target:{" "}
									{ex.targetSets ? `${ex.targetSets} × ` : ""}
									{ex.targetRepRange || "N/A"}
								</span>
								<CollapsibleTrigger
									render={
										<Button
											variant="ghost"
											size="icon"
											className="h-5 w-5 rounded-none hover:bg-transparent cursor-pointer"
										>
											{isOpen ? (
												<CaretUpIcon
													className="size-3 text-muted-foreground"
													weight="bold"
												/>
											) : (
												<CaretDownIcon
													className="size-3 text-muted-foreground"
													weight="bold"
												/>
											)}
										</Button>
									}
								/>
							</div>

							<CollapsibleContent className="p-2 space-y-2">
								<div className="grid grid-cols-12 gap-1 text-[9px] font-semibold text-muted-foreground uppercase px-1 text-center">
									<span className="col-span-3 text-left">
										Set
									</span>
									<span className="col-span-3">Kg</span>
									<span className="col-span-3">Reps</span>
									<span className="col-span-3">RPE</span>
								</div>

								{setArray.map((setNum) => {
									const setData = getSetInput(ex.id, setNum);

									return (
										<div
											key={setNum}
											className={`grid grid-cols-12 gap-1 items-center p-1 border transition-colors ${
												isCompleted
													? "bg-primary/10 border-primary/30"
													: "bg-background/50 border-border/40"
											}`}
										>
											<span className="col-span-3 text-[10px] font-mono font-bold text-foreground text-left pl-0.5">
												#{setNum}
											</span>

											<Input
												placeholder="kg"
												type="number"
												step="any"
												disabled={isCompleted}
												className="col-span-3 rounded-none h-6 px-1 text-center font-mono text-xs border-border/50 bg-background/50 focus:border-primary/50 disabled:opacity-50"
												value={setData?.weight || ""}
												onChange={(e) =>
													handleInputChange(
														ex.id,
														setNum,
														"weight",
														e.target.value,
													)
												}
											/>
											<Input
												placeholder="reps"
												type="number"
												disabled={isCompleted}
												className="col-span-3 rounded-none h-6 px-1 text-center font-mono text-xs border-border/50 bg-background/50 focus:border-primary/50 disabled:opacity-50"
												value={setData?.reps || ""}
												onChange={(e) =>
													handleInputChange(
														ex.id,
														setNum,
														"reps",
														e.target.value,
													)
												}
											/>
											<Input
												placeholder="rpe"
												max={10}
												min={0}
												type="number"
												step="any"
												disabled={isCompleted}
												className="col-span-3 rounded-none h-6 px-1 text-center font-mono text-xs border-border/50 bg-background/50 focus:border-primary/50 disabled:opacity-50"
												value={setData?.rpe || ""}
												onChange={(e) =>
													handleInputChange(
														ex.id,
														setNum,
														"rpe",
														e.target.value,
													)
												}
											/>
										</div>
									);
								})}

								{/* Exercise Level Note Input */}
								<Input
									placeholder="Exercise note (e.g. seat height 4, felt easy)..."
									disabled={isCompleted}
									className="rounded-none h-7 text-[11px] border-border/40 bg-background/40 focus:border-primary/50 disabled:opacity-50"
									value={exerciseNotes[ex.id] || ""}
									onChange={(e) =>
										setExerciseNotes((prev) => ({
											...prev,
											[ex.id]: e.target.value,
										}))
									}
								/>
							</CollapsibleContent>
						</Collapsible>
					</Card>
				);
			})}
		</div>
	);
}
