"use client";

import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
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

interface ExerciseData {
	id: string;
	name: string;
	type?: string | null;
	targetSets?: number | null;
	targetRepRange?: string | null;
}

interface EditExerciseDialogProps {
	exercise: ExerciseData;
	onEditExercise: (
		exerciseId: string,
		data: {
			name: string;
			type: string;
			targetSets: number;
			targetRepRange: string;
		},
	) => void | Promise<void>;
}

export function EditExerciseDialog({
	exercise,
	onEditExercise,
}: EditExerciseDialogProps) {
	const { open, setOpen, loading, setLoading } = useDialog();

	const [exerciseName, setExerciseName] = useState(exercise.name || "");
	const type = useFormField(exercise.type || "Chest");
	const targetSets = useFormField(exercise.targetSets || 3);
	const targetRepRange = useFormField(exercise.targetRepRange || "8-12");

	useEffect(() => {
		if (open) {
			setExerciseName(exercise.name || "");
			type.setValue(exercise.type || "Chest");
			targetSets.setValue(exercise.targetSets || 3);
			targetRepRange.setValue(exercise.targetRepRange || "8-12");
		}
	}, [
		open,
		exercise,
		targetRepRange.setValue,
		targetSets.setValue,
		type.setValue,
	]);

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
			await onEditExercise(exercise.id, {
				name: finalName,
				type: type.value.toString().trim() || "Chest",
				targetSets: Number(targetSets.value) || 3,
				targetRepRange:
					targetRepRange.value.toString().trim() || "8-12",
			});
			toast.success("Exercise updated", {
				description: `"${finalName}" has been updated successfully.`,
			});
			setOpen(false);
		} catch {
			toast.error("Update failed", {
				description: "There was an error updating the exercise.",
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
			{/* ✅ Removed nativeButton={true} — not needed on a ghost icon button */}
			<DialogTrigger
				render={
					<Button
						size="icon"
						variant="ghost"
						className="size-7 rounded-none fmuted hover:text-foreground"
					>
						<PencilSimpleIcon className="size-3.5" />
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-[425px] rounded-none border-secondary/50 bg-card">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-sm font-bold fupper text-foreground">
							Edit Exercise
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 fcol3">
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
									<ComboboxEmpty className="text-xs fmuted p-2">
										No matching exercise found.
									</ComboboxEmpty>
									<ComboboxList>
										{(item: PresetExercise) => (
											<ComboboxItem
												key={item.name}
												value={item}
												className="text-xs rounded-none py-1.5 px-2 hover:bg-muted cursor-pointer fcb"
											>
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
								</p>
							)}
						</div>

						<div className="grid grid-cols-3 gap-2">
							<div className="space-y-1">
								<span className="ftext-xs2 font-medium fupper fmuted block">
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
								<span className="ftext-xs2 font-medium fupper fmuted block">
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
								<span className="ftext-xs2 font-medium fupper fmuted block">
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
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
