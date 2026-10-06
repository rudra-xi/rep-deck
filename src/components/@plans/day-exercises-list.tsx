"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SunDimIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
	addExerciseToDay,
	deleteExercise,
	reorderExercises,
	updateExercise,
} from "@/actions/plans";
import { CardsHeader } from "@/common";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import type { DayWithExercises } from "@/db/schema";
import { deriveWeekdayShort } from "@/lib/weekday-anchor";
import { CreateExerciseDialog } from "@/plan-dialogs";
import { DayExercisesListSkeleton } from "@/skeletons";
import { SortableExerciseRow } from "./sortable-exercise-row";

interface DayExercisesListProps {
	day?: DayWithExercises;
	anchorWeekday?: number | null;
	loading?: boolean;
}

export function DayExercisesList({
	day,
	anchorWeekday,
	loading = false,
}: DayExercisesListProps) {
	const router = useRouter();
	const [optimisticOrder, setOptimisticOrder] = useState<string[] | null>(
		null,
	);

	// Sensors: pointer for mouse/touch, keyboard for accessibility.
	const sensors = useSensors(
		useSensor(PointerSensor, {
			// Prevent dragging when the user clicks the handle to focus it.
			activationConstraint: { distance: 4 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const derived = day
		? deriveWeekdayShort(anchorWeekday ?? null, day.dayIndex)
		: null;

	const exercises = day
		? optimisticOrder
			? optimisticOrder
					.map((id) => day.exercises.find((e) => e.id === id))
					.filter((e): e is NonNullable<typeof e> => e != null)
			: day.exercises
		: [];

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
		await updateExercise(exerciseId, data);
		router.refresh();
	};

	const handleDeleteExercise = async (exerciseId: string) => {
		await deleteExercise(exerciseId);
		router.refresh();
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		if (!day) return;
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = exercises.findIndex((e) => e.id === active.id);
		const newIndex = exercises.findIndex((e) => e.id === over.id);
		if (oldIndex < 0 || newIndex < 0) return;

		const reordered = arrayMove(exercises, oldIndex, newIndex);
		const orderedIds = reordered.map((e) => e.id);

		// Optimistic update so the row doesn't snap back during the round-trip.
		setOptimisticOrder(orderedIds);

		const res = await reorderExercises(day.id, orderedIds);

		if (!res.success) {
			toast.error("Failed to save new order", {
				description: res.error,
			});
			setOptimisticOrder(null);
			return;
		}

		router.refresh();
		setOptimisticOrder(null);
	};

	if (loading)
		return <DayExercisesListSkeleton rows={day?.exercises.length ?? 4} />;

	if (!day) {
		return (
			<Card
				size="sm"
				className="fcard-flat h-full min-h-50 w-full card-ease"
			>
				<Empty className="p-8 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
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
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={SunDimIcon}
				title={derived ? `${day.label} · ${derived}` : day.label}
				trailing={
					<CreateExerciseDialog
						programDayId={day.id}
						onAddExercise={handleAddExercise}
					/>
				}
			/>

			<CardContent className="p-4 pt-1">
				{exercises.length === 0 ? (
					<p className="text-xs text-muted-foreground py-4 text-center">
						No exercises configured for this day.
					</p>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={exercises.map((e) => e.id)}
							strategy={verticalListSortingStrategy}
						>
							<table className="w-full text-left text-xs border-collapse">
								<thead>
									<tr className="border-b border-border/50 text-[11px] text-muted-foreground uppercase font-medium">
										<th className="w-6 py-2 pl-1" />
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
									{exercises.map((ex) => (
										<SortableExerciseRow
											key={ex.id}
											exercise={ex}
											onEdit={handleEditExercise}
											onDelete={handleDeleteExercise}
										/>
									))}
								</tbody>
							</table>
						</SortableContext>
					</DndContext>
				)}
			</CardContent>
		</Card>
	);
}
