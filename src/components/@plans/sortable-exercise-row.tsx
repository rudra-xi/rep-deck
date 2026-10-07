"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ExerciseTemplate } from "@/db/schema";
import { cn } from "@/lib/utils";
import { DeleteExerciseDialog, EditExerciseDialog } from "@/plan-dialogs";

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
		zIndex: isDragging ? 10 : undefined,
		opacity: isDragging ? 0.9 : 1,
	};

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			className={cn(
				"transition-colors hover:bg-background/40",
				isDragging && "bg-background shadow-lg",
			)}
		>
			<TableCell className="w-8 py-2.5 pl-2 pr-0">
				<button
					type="button"
					{...attributes}
					{...listeners}
					className="fc size-6 cursor-grab touch-none rounded-none text-muted-foreground/50 transition-colors hover:text-foreground active:cursor-grabbing"
					aria-label={`Reorder ${exercise.name}`}
				>
					<DotsSixVerticalIcon className="size-4" weight="bold" />
				</button>
			</TableCell>

			<TableCell className="py-2.5 px-2">
				<div className="min-w-0">
					<Popover>
						<PopoverTrigger
							nativeButton={false}
							render={
								<span className="block truncate font-semibold text-foreground capitalize cursor-help">
									{exercise.name}
								</span>
							}
						/>
						<PopoverContent
							align="start"
							className="w-auto max-w-xs rounded-none border-secondary/50 p-2 text-xs"
						>
							<p className="font-semibold text-foreground">
								{exercise.name}
							</p>
							{exercise.type && (
								<p className="fmuted ftext-2xs fupper mt-1">
									{exercise.type}
								</p>
							)}
						</PopoverContent>
					</Popover>
				</div>
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

			<TableCell className="py-2.5 pl-1 pr-2 text-right">
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
