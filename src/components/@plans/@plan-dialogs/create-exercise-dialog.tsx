"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	PRESET_EXERCISES,
	PRESET_REP_RANGES,
	type PresetExercise,
} from "@/constants";
import { useDialog, useFormField } from "@/hooks";

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

	const [exerciseName, setExerciseName] = useState("");

	const type = useFormField("Chest");
	const targetSets = useFormField(3);
	const targetRepRange = useFormField("8-12");

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
						<DialogTitle className="text-sm font-bold fupper text-foreground">
							Add Exercise
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 space-y-3">
						<div className="space-y-1">
							<span className="ftext-xs2 font-medium fupper fmuted block">
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
											<ComboboxItem className="text-xs rounded-none py-1.5 px-2 hover:bg-muted cursor-pointer fcb">
												<span>{item.name}</span>
												<span className="ftext-2xs fmuted fupper">
													{item.type}
												</span>
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>

							{exerciseName.trim() && !isPreset && (
								<p className="ftext-2xs fmuted mt-1">
									Custom exercise: "{exerciseName.trim()}"
									will be added
								</p>
							)}
						</div>

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
