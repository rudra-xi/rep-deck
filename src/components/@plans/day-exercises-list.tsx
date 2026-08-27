"use client";

import {
	PencilSimpleIcon,
	PlusIcon,
	RowsIcon,
	SunDimIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DayPlan } from "@/constants/mock-data";

interface DayExercisesListProps {
	day?: DayPlan;
}

export function DayExercisesList({ day }: DayExercisesListProps) {
	if (!day) return null;

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 base-ease hover:border-primary/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div>
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<SunDimIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						{day.label} – {day.title}
					</CardTitle>
				</div>

				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="outline"
						className="h-7 text-xs rounded-none gap-1 border-border/50"
					>
						<PlusIcon className="size-3.5" weight="bold" />
						Add Exercise
					</Button>
					<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
						<RowsIcon className="size-4" weight="bold" />
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3">
				{day.exercises.length === 0 ? (
					<p className="text-xs text-muted-foreground py-4 text-center">
						No exercises configured for this day.
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-xs border-collapse">
							<thead>
								<tr className="border-b border-border/50 text-[11px] text-muted-foreground uppercase font-medium">
									<th className="py-2 px-2">Exercise</th>
									<th className="py-2 px-2">Type</th>
									<th className="py-2 px-2 text-center">
										Sets
									</th>
									<th className="py-2 px-2 text-center">
										Target Reps
									</th>
									<th className="py-2 px-2 text-right">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/30">
								{day.exercises.map((ex) => (
									<tr
										key={ex.id}
										className="hover:bg-background/40 transition-colors"
									>
										<td className="py-2.5 px-2 font-semibold text-foreground">
											{ex.name}
										</td>
										<td className="py-2.5 px-2">
											<span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-none bg-primary/10 text-primary border border-primary/20">
												{ex.type}
											</span>
										</td>
										<td className="py-2.5 px-2 text-center font-medium text-foreground">
											{ex.sets}
										</td>
										<td className="py-2.5 px-2 text-center font-medium text-foreground">
											{ex.reps}
										</td>
										<td className="py-2.5 px-2 text-right">
											<div className="flex items-center justify-end gap-1">
												<Button
													size="sm"
													variant="ghost"
													className="size-7 p-0 rounded-none text-muted-foreground hover:text-foreground"
												>
													<PencilSimpleIcon className="size-3.5" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													className="size-7 p-0 rounded-none text-muted-foreground hover:text-destructive"
												>
													<TrashIcon className="size-3.5" />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
