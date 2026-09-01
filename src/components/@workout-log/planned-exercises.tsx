"use client";

import { useState } from "react";
import {
	CaretDownIcon,
	CaretUpIcon,
	CheckIcon,
	ChecksIcon,
	PlusSquareIcon,
	ChatTextIcon,
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

interface ExerciseTemplate {
	id: string;
	name: string;
	type: string;
	targetSets: number | null;
	targetRepRange: string | null;
}

interface PlannedExercisesProps {
	exercises: ExerciseTemplate[];
	onAddSet: (set: Omit<LoggedSet, "id"> & { templateId?: string }) => void;
}

export function PlannedExercises({
	exercises,
	onAddSet,
}: PlannedExercisesProps) {
	const [completed, setCompleted] = useState<Record<string, boolean>>({});
	const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
	// Local state for exercise-level notes
	const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>(
		{},
	);

	const { handleInputChange, markSetAsAdded, getSetInput } =
		useExerciseInputs();
	const { lastLogs, isLoading } = useExercisePerformance(exercises);

	const handleAddSingleSet = (ex: ExerciseTemplate, setNumber: number) => {
		const setData = getSetInput(ex.id, setNumber);
		if (!setData?.weight || !setData?.reps) return;

		const note = exerciseNotes[ex.id] || "";
		console.log(`📝 Adding note for ${ex.name}:`, note); // ✅ This is already there

		onAddSet({
			exerciseName: ex.name,
			templateId: ex.id,
			weight: setData.weight,
			reps: setData.reps,
			rpe: setData.rpe || "",
			notes: note,
		});

		markSetAsAdded(ex.id, setNumber);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
			{exercises.map((ex) => {
				const setArray = Array.from(
					{ length: ex.targetSets || 1 },
					(_, i) => i + 1,
				);
				const isOpen = openStates[ex.id] ?? true;
				const isCompleted = completed[ex.id];

				const perfData = lastLogs[ex.id];
				const lastBest = perfData?.lastBest?.formatted ?? null;
				const overallBest = perfData?.overallBest?.formatted ?? null;
				// Retrieve last session's note for this exercise from performance hook
				const lastNote = perfData?.lastNote ?? null;

				return (
					<Card
						key={ex.id}
						size="sm"
						className={`h-fit border bg-card/40 backdrop-blur-sm rounded-none shadow-none transition-all ${
							isCompleted
								? "border-primary/50 bg-primary/5 opacity-75"
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
										onClick={() =>
											setCompleted((prev) => ({
												...prev,
												[ex.id]: !prev[ex.id],
											}))
										}
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
												<Spinner className="inline-block size-3 ml-1" />
											) : (
												overallBest || "—"
											)}
										</span>
									</span>

									<span className="gap-1">
										Last:{" "}
										<span className="text-foreground font-semibold tracking-wider">
											{isLoading ? (
												<Spinner className="inline-block size-3 ml-1" />
											) : (
												lastBest || "—"
											)}
										</span>
									</span>
								</div>

								{/* Display Last Session Notes or Loading state */}
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
									<span className="col-span-2 text-left">
										Set
									</span>
									<span className="col-span-3">Kg</span>
									<span className="col-span-3">Reps</span>
									<span className="col-span-2">RPE</span>
									<span className="col-span-2"></span>
								</div>

								{setArray.map((setNum) => {
									const setData = getSetInput(ex.id, setNum);
									const isSetAdded = setData?.added;

									return (
										<div
											key={setNum}
											className={`grid grid-cols-12 gap-1 items-center p-1 border transition-colors ${
												isSetAdded
													? "bg-primary/10 border-primary/30"
													: "bg-background/50 border-border/40"
											}`}
										>
											<span className="col-span-2 text-[10px] font-mono font-bold text-foreground text-left pl-0.5">
												#{setNum}
											</span>

											<Input
												placeholder="kg"
												type="number"
												step="any"
												disabled={isSetAdded}
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
												disabled={isSetAdded}
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
												disabled={isSetAdded}
												className="col-span-2 rounded-none h-6 px-1 text-center font-mono text-xs border-border/50 bg-background/50 focus:border-primary/50 disabled:opacity-50"
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

											<div className="col-span-2 flex justify-end">
												<Button
													size="icon"
													variant={
														isSetAdded
															? "default"
															: "secondary"
													}
													disabled={isSetAdded}
													className="h-6 w-full rounded-none cursor-pointer border border-border/40"
													onClick={() =>
														handleAddSingleSet(
															ex,
															setNum,
														)
													}
												>
													{isSetAdded ? (
														<CheckIcon
															className="size-3"
															weight="bold"
														/>
													) : (
														<PlusSquareIcon
															className="size-3"
															weight="bold"
														/>
													)}
												</Button>
											</div>
										</div>
									);
								})}

								{/* Exercise Note Input */}
								<Input
									placeholder="Add note for this exercise (e.g. adjust seat height to 4)..."
									className="rounded-none h-7 text-[11px] border-border/40 bg-background/40 focus:border-primary/50"
									value={exerciseNotes[ex.id] || ""}
									onChange={(e) => {
										const note = e.target.value;
										console.log(
											`✏️ Typing note for ${ex.name}:`,
											note,
										); // ✅ Debug
										setExerciseNotes((prev) => ({
											...prev,
											[ex.id]: note,
										}));
									}}
								/>
							</CollapsibleContent>
						</Collapsible>
					</Card>
				);
			})}
		</div>
	);
}
