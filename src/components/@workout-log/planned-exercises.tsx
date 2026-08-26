"use client";

import { useState } from "react";
import {
	CheckIcon,
	ChecksIcon,
	ListHeartIcon,
	PlusSquareIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_PROGRAM_DAYS } from "@/constants/mock-data";
import type { LoggedSet } from "@/types";

interface PlannedExercisesProps {
	selectedDay: number;
	onAddSet: (set: Omit<LoggedSet, "id">) => void;
}

export function PlannedExercises({
	selectedDay,
	onAddSet,
}: PlannedExercisesProps) {
	const [completed, setCompleted] = useState<Record<string, boolean>>({});
	const [inputs, setInputs] = useState<
		Record<string, { weight: string; reps: string; rpe: string }>
	>({});

	const exercises = MOCK_PROGRAM_DAYS[selectedDay] || [];

	const handleInputChange = (
		id: string,
		field: "weight" | "reps" | "rpe",
		value: string,
	) => {
		setInputs((prev) => ({
			...prev,
			[id]: {
				...(prev[id] || { weight: "", reps: "", rpe: "" }),
				[field]: value,
			},
		}));
	};

	const handleAdd = (id: string, exerciseName: string) => {
		const data = inputs[id];
		if (!data?.weight || !data?.reps) return;
		onAddSet({
			exerciseName,
			weight: data.weight,
			reps: data.reps,
			rpe: data.rpe || "8",
		});
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{exercises.map((ex) => (
				<Card
					key={ex.id}
					size="sm"
					className={`relative fcb2 border bg-card/50 base-ease rounded-none shadow-none transition-colors ${
						completed[ex.id]
							? "border-primary bg-primary/15 opacity-60 cubic-one"
							: "border-secondary/50 hover:border-primary/50"
					}`}
				>
					<div>
						{/* Header Section */}
						<CardHeader className="space-y-0 pb-2 flex fcb">
							<div className="fcy gap-1.5 flex-wrap">
								<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground line-clamp-1">
									{ex.name}
								</CardTitle>
							</div>

							<Badge
								variant={
									ex.type === "Primary"
										? "default"
										: ex.type === "Secondary"
											? "secondary"
											: "outline"
								}
								className="text-[9px] sm:text-[10px] px-1.5 py-0 font-semibold sh0"
							>
								{ex.type}
							</Badge>
						</CardHeader>

						{/* Content & Stats */}
						<CardContent className="space-y-3 pt-1">
							<div className="space-y-1">
								<div className="text-[11px] text-muted-foreground frw">
									<span>Target:</span>
									<span className="font-semibold text-foreground">
										{ex.target}
									</span>
								</div>
								<div className="text-[11px] text-muted-foreground frw">
									<span>Last Best:</span>
									<span className="font-semibold text-foreground">
										{ex.lastSession}
									</span>
								</div>
							</div>

							<Button
								size="sm"
								variant={
									completed[ex.id] ? "default" : "outline"
								}
								onClick={() =>
									setCompleted((prev) => ({
										...prev,
										[ex.id]: !prev[ex.id],
									}))
								}
								className="w-full rounded-none gap-1.5 text-xs h-7 border-border/50"
							>
								{completed[ex.id] ? (
									<>
										<ChecksIcon
											className="size-3.5"
											weight="bold"
										/>
										Done
									</>
								) : (
									<>
										<CheckIcon
											className="size-3.5"
											weight="bold"
										/>
										Mark Done
									</>
								)}
							</Button>
						</CardContent>
					</div>

					{/* Inputs Footer */}
					<div className="p-3 pt-0 mt-auto">
						<div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/40">
							<Input
								placeholder="Kg"
								type="number"
								className="rounded-none h-7 px-2 text-xs border-border/50 bg-background/50 focus:border-primary/50"
								value={inputs[ex.id]?.weight || ""}
								onChange={(e) =>
									handleInputChange(
										ex.id,
										"weight",
										e.target.value,
									)
								}
							/>
							<Input
								placeholder="Reps"
								type="number"
								className="rounded-none h-7 px-2 text-xs border-border/50 bg-background/50 focus:border-primary/50"
								value={inputs[ex.id]?.reps || ""}
								onChange={(e) =>
									handleInputChange(
										ex.id,
										"reps",
										e.target.value,
									)
								}
							/>
							<Input
								placeholder="RPE"
								type="number"
								className="rounded-none h-7 px-2 text-xs border-border/50 bg-background/50 focus:border-primary/50"
								value={inputs[ex.id]?.rpe || ""}
								onChange={(e) =>
									handleInputChange(
										ex.id,
										"rpe",
										e.target.value,
									)
								}
							/>
						</div>
						<Button
							size="sm"
							variant="secondary"
							className="w-full rounded-none h-7 text-xs gap-2 font-semibold border border-border/40 mt-1.5"
							onClick={() => handleAdd(ex.id, ex.name)}
						>
							<PlusSquareIcon
								className="size-3.5 -mt-0.5"
								weight="bold"
							/>
							Add Set
						</Button>
					</div>
				</Card>
			))}
		</div>
	);
}
