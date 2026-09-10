"use client";

import { useRouter } from "next/navigation";
import {
	addExerciseToDay,
	deleteExercise,
	updateExercise,
} from "@/actions/plans";
import {
	CreateExerciseDialog,
	DeleteExerciseDialog,
	EditExerciseDialog,
} from "@/plan-dialogs";
import { SunDimIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DayWithExercises } from "@/types/plans";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { DayExercisesListSkeleton } from "@/skeletons";

interface DayExercisesListProps {
	day?: DayWithExercises;
	loading?: boolean;
}

export function DayExercisesList({
	day,
	loading = false,
}: DayExercisesListProps) {
	const router = useRouter();

	const handleAddExercise = async (data: {
		programDayId: string;
		name: string;
		type: string;
		targetSets: number;
		targetRepRange: string;
	}) => {
		await addExerciseToDay(data);
		router.refresh();
	};

	const handleEditExercise = async (
		exerciseId: string,
		data: {
			name: string;
			type: string;
			targetSets: number;
			targetRepRange: string;
		},
	) => {
		if (typeof updateExercise === "function") {
			await updateExercise(exerciseId, data);
			router.refresh();
		}
	};

	const handleDeleteExercise = async (exerciseId: string) => {
		await deleteExercise(exerciseId);
		router.refresh();
	};

	if (loading)
		return <DayExercisesListSkeleton rows={day?.exercises.length ?? 4} />;

	// Empty state when no day is selected
	if (!day) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none h-full min-h-50  w-full"
			>
				<Empty className="p-8 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<SunDimIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-xs font-medium text-muted-foreground">
							No Day Selected
						</EmptyTitle>
						<EmptyDescription className="text-[11px] text-muted-foreground/60">
							Create a training day from the plan structure to
							view exercises.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</Card>
		);
	}

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<SunDimIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					Day {day.dayIndex} – {day.label}
				</CardTitle>

				{/* Modularized Create Exercise Dialog */}
				<CreateExerciseDialog
					programDayId={day.id}
					onAddExercise={handleAddExercise}
				/>
			</CardHeader>

			<CardContent className="space-y-3">
				{day.exercises.length === 0 ? (
					<p className="text-xs text-muted-foreground py-4 text-center">
						No exercises configured for this day.
					</p>
				) : (
					<table className="w-full text-left text-xs border-collapse">
						<thead>
							<tr className="border-b border-border/50 text-[11px] text-muted-foreground uppercase font-medium">
								<th className="py-2 px-2">Exercise</th>
								<th className="py-2 px-2">Type</th>
								<th className="py-2 px-2 text-center">Sets</th>
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
									<td className="py-2.5 px-2 font-semibold text-foreground capitalize">
										{ex.name}
									</td>
									<td className="py-2.5 px-2">
										<span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20">
											{ex.type || "General"}
										</span>
									</td>
									<td className="py-2.5 px-2 text-center font-medium">
										{ex.targetSets}
									</td>
									<td className="py-2.5 px-2 text-center font-medium">
										{ex.targetRepRange || "-"}
									</td>
									<td className="py-2.5 px-2 text-right">
										<div className="flex items-center justify-end gap-1">
											{/* Modularized Edit Exercise Dialog */}
											<EditExerciseDialog
												exercise={ex}
												onEditExercise={
													handleEditExercise
												}
											/>
											{/* Modularized Delete Exercise Dialog */}
											<DeleteExerciseDialog
												exerciseName={ex.name}
												onDelete={() =>
													handleDeleteExercise(ex.id)
												}
											/>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</CardContent>
		</Card>
	);
}
