"use client";

import {
	CheckCircleIcon,
	ClipboardTextIcon,
	PulseIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { LoggedSet } from "@/types";

interface ActiveSessionSummaryProps {
	loggedSets: LoggedSet[];
}

export function ActiveSessionSummary({
	loggedSets,
}: ActiveSessionSummaryProps) {
	const grouped = loggedSets.reduce<Record<string, LoggedSet[]>>(
		(acc, set) => {
			acc[set.exerciseName] = acc[set.exerciseName] || [];
			acc[set.exerciseName].push(set);
			return acc;
		},
		{},
	);

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
					<div className="space-y-2.5">
						{Object.entries(grouped).map(([exercise, sets]) => (
							<div
								key={exercise}
								className="rounded-none border border-border/50 p-3 bg-background/50 space-y-2"
							>
								<h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
									{exercise}
								</h3>
								<div className="flex flex-wrap gap-1.5">
									{sets.map((s, idx) => (
										<span
											key={s.id}
											className="text-xs font-mono px-2 py-0.5 rounded-none bg-accent/50 border border-border/50 text-foreground"
										>
											Set {idx + 1}: {s.weight}kg ×{" "}
											{s.reps} @ RPE {s.rpe}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				)}

				<div className="space-y-3 pt-1">
					<Textarea
						placeholder="Workout notes (e.g., felt strong on bench, energy was high)..."
						className="rounded-none text-xs resize-none h-20 border-border/50 bg-background/50 focus:border-primary/50"
					/>
					<Button className="rounded-none w-full gap-2 font-bold uppercase tracking-wider text-xs">
						<CheckCircleIcon className="size-4" weight="bold" />
						Finish Workout
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
