"use client";

import { useState } from "react";
import { AsteriskIcon, PlusCircleIcon, PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LoggedSet } from "@/types";

interface QuickAddExtraProps {
	onAddSet: (set: Omit<LoggedSet, "id">) => void;
}

export function QuickAddExtra({ onAddSet }: QuickAddExtraProps) {
	const [exerciseName, setExerciseName] = useState("");
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const [rpe, setRpe] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!exerciseName || !weight || !reps) return;

		onAddSet({
			exerciseName,
			weight,
			reps,
			rpe: rpe || "8",
		});

		setExerciseName("");
		setWeight("");
		setReps("");
		setRpe("");
	};

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 base-ease hover:border-primary/50 rounded-none shadow-none space-y-0"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div>
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<AsteriskIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						Add Extra Work
					</CardTitle>
				</div>

				<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
					<PlusCircleIcon className="size-4" weight="bold" />
				</div>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-3">
					<Input
						placeholder="Exercise Name (e.g., Face Pulls)"
						className="rounded-none text-xs border-border/50 bg-background/50 focus:border-primary/50"
						value={exerciseName}
						onChange={(e) => setExerciseName(e.target.value)}
					/>
					<div className="grid grid-cols-3 gap-2">
						<Input
							placeholder="Weight (kg)"
							type="number"
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
							value={weight}
							onChange={(e) => setWeight(e.target.value)}
						/>
						<Input
							placeholder="Reps"
							type="number"
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
							value={reps}
							onChange={(e) => setReps(e.target.value)}
						/>
						<Input
							placeholder="RPE"
							type="number"
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
							value={rpe}
							onChange={(e) => setRpe(e.target.value)}
						/>
					</div>
					<Button
						type="submit"
						variant="outline"
						className="rounded-none w-full h-8 text-xs gap-1.5 font-semibold border-border/50 hover:border-primary/50"
					>
						<PlusIcon className="size-4" weight="bold" />
						Add Extra Set
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
