"use client";

import { AsteriskIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { CardsHeader, useUnits } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { PRESET_EXERCISES, type PresetExercise } from "@/constants";
import { useFormField, useRangedInput } from "@/hooks";
import type { LoggedSet } from "@/types";

interface PlannedExerciseItem {
	id: string;
	name: string;
}

interface QuickAddExtraProps {
	plannedExercises?: PlannedExerciseItem[];
	onAddSet: (set: Omit<LoggedSet, "id"> & { templateId?: string }) => void;
}

export function QuickAddExtra({
	plannedExercises = [],
	onAddSet,
}: QuickAddExtraProps) {
	const [exerciseName, setExerciseName] = useState("");
	const weight = useFormField("");
	const reps = useFormField("");
	const rpe = useRangedInput("", 0, 10);

	const { weightUnit } = useUnits();

	const handleSelectExercise = (item: PresetExercise | string | null) => {
		if (!item) return;

		if (typeof item === "object") {
			setExerciseName(item.name);
		} else {
			setExerciseName(item);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const finalName = exerciseName.trim();
		if (!finalName || !weight.value || !reps.value) return;

		const matchedPlannedExercise = plannedExercises.find(
			(ex) => ex.name.toLowerCase() === finalName.toLowerCase(),
		);

		try {
			onAddSet({
				exerciseName: finalName,
				templateId: matchedPlannedExercise?.id,
				weight: weight.value.toString(),
				reps: reps.value.toString(),
				rpe: rpe.value.toString() || "",
				notes: "",
			});

			toast.success("Extra set added", {
				description: `Added 1 set of ${finalName} (${weight.value}${weightUnit} × ${reps.value}).`,
			});

			setExerciseName("");
			weight.setValue("");
			reps.setValue("");
			rpe.setValue("");
		} catch {
			toast.error("Failed to add set", {
				description: "There was an error adding the extra set.",
			});
		}
	};

	const isPreset = PRESET_EXERCISES.some(
		(e) => e.name.toLowerCase() === exerciseName.trim().toLowerCase(),
	);

	return (
		<Card size="sm" className="relative fcard-flat card-ease">
			<CardsHeader icon={AsteriskIcon} title="Add Extra Work" />

			<CardContent className="p-4 pt-1">
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="space-y-1">
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

						{exerciseName.trim() && !isPreset && (
							<p className="text-[10px] text-muted-foreground mt-0.5">
								Custom exercise: "{exerciseName.trim()}"
							</p>
						)}
					</div>

					<div className="grid grid-cols-3 gap-2">
						<Input
							placeholder={weightUnit}
							type="number"
							value={weight.value}
							onChange={weight.onChange}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
						<Input
							placeholder="reps"
							max={100}
							min={1}
							type="number"
							value={reps.value}
							onChange={reps.onChange}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
						<Input
							placeholder="rpe"
							max={10}
							min={1}
							type="number"
							value={rpe.value}
							onChange={rpe.onChange}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
					</div>

					<Button
						type="submit"
						variant="outline"
						disabled={
							!exerciseName.trim() || !weight.value || !reps.value
						}
						className="rounded-none w-full h-8 text-xs gap-1.5 font-semibold border-border/50 hover:border-primary/50 cursor-pointer"
					>
						<PlusIcon className="size-4" weight="bold" />
						Add Extra Set
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
