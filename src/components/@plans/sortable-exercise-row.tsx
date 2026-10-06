"use client";

import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EditExerciseDialog, DeleteExerciseDialog } from "@/plan-dialogs";
import type { ExerciseTemplate } from "@/db/schema";

interface SortableExerciseRowProps {
	exercise: ExerciseTemplate;
	onEdit: (
		exerciseId: string,
		data: {
			name: string;
			type: string;
			targetSets: number;
			targetRepRange: string;
		},
	) => void | Promise<void>;
	onDelete: (exerciseId: string) => void | Promise<void>;
}

export function SortableExerciseRow({
	exercise,
	onEdit,
	onDelete,
}: SortableExerciseRowProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: exercise.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		// Keep the row visible but visually behind while dragging.
		zIndex: isDragging ? 10 : undefined,
		opacity: isDragging ? 0.9 : 1,
	};

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			className={cn(
				"hover:bg-background/40 transition-colors",
				isDragging && "bg-background shadow-lg",
			)}
		>
			<TableCell className="w-6 py-2.5 pl-1 pr-0">
				<button
					type="button"
					{...attributes}
					{...listeners}
					className="fc size-5 cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
					aria-label={`Reorder ${exercise.name}`}
				>
					<DotsSixVerticalIcon className="size-4" weight="bold" />
				</button>
			</TableCell>

			<TableCell className="py-2.5 px-2 font-semibold text-foreground capitalize">
				{exercise.name}
			</TableCell>

			<TableCell className="py-2.5 px-2">
				<span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20">
					{exercise.type || "General"}
				</span>
			</TableCell>

			<TableCell className="py-2.5 px-2 text-center font-medium">
				{exercise.targetSets}
			</TableCell>

			<TableCell className="py-2.5 px-2 text-center font-medium">
				{exercise.targetRepRange || "-"}
			</TableCell>

			<TableCell className="py-2.5 px-2 text-right">
				<div className="fcy justify-end gap-1">
					<EditExerciseDialog
						exercise={exercise}
						onEditExercise={onEdit}
					/>
					<DeleteExerciseDialog
						exerciseName={exercise.name}
						onDelete={() => onDelete(exercise.id)}
					/>
				</div>
			</TableCell>
		</TableRow>
	);
}