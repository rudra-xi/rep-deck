"use client";

import { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { useDialog, useFormField } from "@/hooks";
import { toast } from "sonner";
import { PRESET_EXERCISES, PRESET_REP_RANGES, type PresetExercise } from "@/constants";

interface CreateExerciseDialogProps {
	programDayId: string;
	onAddExercise: (data: {
		programDayId: string;
		name: string;
		type: string;
		targetSets: number;
		targetRepRange: string;
	}) => void | Promise<void>;
}

export function CreateExerciseDialog({
	programDayId,
	onAddExercise,
}: CreateExerciseDialogProps) {
	const { open, setOpen, loading, setLoading } = useDialog();

	// State for exercise name
	const [exerciseName, setExerciseName] = useState("");

	const type = useFormField("Chest");
	const targetSets = useFormField(3);
	const targetRepRange = useFormField("8-12");

	// Handle item selection from Combobox
	const handleSelectExercise = (item: PresetExercise | string | null) => {
		if (!item) return;

		if (typeof item === "object") {
			setExerciseName(item.name);
			type.setValue(item.type);
		} else {
			setExerciseName(item);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const finalName = exerciseName.trim();
		if (!finalName) return;

		setLoading(true);
		try {
			await onAddExercise({
				programDayId,
				name: finalName,
				type: type.value.toString().trim() || "Chest",
				targetSets: Number(targetSets.value) || 3,
				targetRepRange:
					targetRepRange.value.toString().trim() || "8-12",
			});
			toast.success("Exercise added", {
				description: `"${finalName}" has been added successfully.`,
			});

			// Reset fields
			setExerciseName("");
			type.reset();
			targetSets.reset();
			targetRepRange.reset();
			setOpen(false);
		} catch {
			toast.error("Failed to add exercise", {
				description: "There was an error adding the exercise.",
			});
		} finally {
			setLoading(false);
		}
	};

	const isPreset = PRESET_EXERCISES.some(
		(e) => e.name.toLowerCase() === exerciseName.trim().toLowerCase(),
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						size="sm"
						variant="outline"
						className="h-7 text-xs rounded-none gap-1 border-border/50"
					>
						<PlusIcon className="size-3.5" weight="bold" />
						Add Exercise
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-[425px] rounded-none border-secondary/50 bg-card">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
							Add Exercise
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 space-y-3">
						{/* Combobox Exercise Input */}
						<div className="space-y-1">
							<span className="text-[11px] font-medium uppercase text-muted-foreground block">
								Exercise Name
							</span>
							<Combobox
								items={PRESET_EXERCISES}
								itemToStringValue={(item) =>
									typeof item === "string" ? item : item.name
								}
								onValueChange={handleSelectExercise}
							>
								<ComboboxInput
									placeholder="Search or type exercise name..."
									value={exerciseName}
									onChange={(e) =>
										setExerciseName(e.target.value)
									}
									className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50 w-full"
									autoFocus
								/>
								<ComboboxContent className="rounded-none border-secondary/50 bg-card max-h-48 overflow-y-auto">
									<ComboboxEmpty className="text-xs text-muted-foreground p-2">
										No matching exercise found.
									</ComboboxEmpty>
									<ComboboxList>
										{(item: PresetExercise) => (
											<ComboboxItem
												key={item.name}
												value={item}
												className="text-xs rounded-none py-1.5 px-2 hover:bg-muted cursor-pointer flex justify-between items-center"
											>
												<span>{item.name}</span>
												<span className="text-[10px] text-muted-foreground uppercase">
													{item.type}
												</span>
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>

							{/* Custom exercise notification tag */}
							{exerciseName.trim() && !isPreset && (
								<p className="text-[10px] text-muted-foreground mt-1">
									Custom exercise: "{exerciseName.trim()}"
									will be added
								</p>
							)}
						</div>

						{/* Sets, Reps, and Type Inputs */}
						<div className="grid grid-cols-3 gap-2">
							<div className="space-y-1">
								<span className="text-[11px] font-medium uppercase text-muted-foreground block">
									Type
								</span>
								<Input
									placeholder="Chest"
									value={type.value}
									onChange={type.onChange}
									className="rounded-none h-8 text-xs border-border/50 bg-background/50"
								/>
							</div>

							<div className="space-y-1">
								<span className="text-[11px] font-medium uppercase text-muted-foreground block">
									Sets
								</span>
								<Input
									type="number"
									min={1}
									value={targetSets.value}
									onChange={targetSets.onChange}
									className="rounded-none h-8 text-xs border-border/50 bg-background/50"
								/>
							</div>

							<div className="space-y-1">
								<span className="text-[11px] font-medium uppercase text-muted-foreground block">
									Target Reps
								</span>
								<Combobox
									items={PRESET_REP_RANGES}
									value={targetRepRange.value.toString()}
									onValueChange={(val) =>
										targetRepRange.setValue(val || "")
									}
								>
									<ComboboxInput
										placeholder="8-12"
										value={targetRepRange.value.toString()}
										onChange={targetRepRange.onChange}
										className="rounded-none h-8 text-xs border-border/50 bg-background/50"
									/>
									<ComboboxContent className="rounded-none border-secondary/50 bg-card max-h-36 overflow-y-auto">
										<ComboboxList>
											{(repRange) => (
												<ComboboxItem
													key={repRange}
													value={repRange}
													className="text-xs rounded-none py-1 px-2 hover:bg-muted cursor-pointer"
												>
													{repRange}
												</ComboboxItem>
											)}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							className="rounded-none h-8 text-xs border-border/50"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={loading || !exerciseName.trim()}
							className="rounded-none h-8 text-xs"
						>
							{loading ? "Adding..." : "Add Exercise"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
