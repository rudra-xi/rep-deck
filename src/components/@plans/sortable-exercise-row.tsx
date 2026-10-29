"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ExerciseTemplate } from "@/db/schema";
import { formatTargetReps } from "@/lib/format-target-reps";
import { cn } from "@/lib/utils";
import { DeleteExerciseDialog, EditExerciseDialog } from "@/plan-dialogs";

interface SortableExerciseRowProps {
	exercise: ExerciseTemplate;
	variant: "card" | "row";
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
	variant,
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
		zIndex: isDragging ? 50 : undefined,
		opacity: isDragging ? 0.9 : 1,
	};

	const target = formatTargetReps(exercise.targetRepRange);

	const handle = (
		<button
			type="button"
			{...attributes}
			{...listeners}
			className={cn(
				"fc cursor-grab touch-none rounded-none transition-colors active:cursor-grabbing",
				variant === "card"
					? "w-8 shrink-0 border border-border/30 bg-muted/20 text-muted-foreground/60 hover:text-foreground"
					: "size-6 text-muted-foreground/50 hover:text-foreground",
			)}
			aria-label={`Reorder ${exercise.name}`}
		>
			<DotsSixVerticalIcon className="size-4" weight="bold" />
		</button>
	);

	if (variant === "card") {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className={cn(
					"flex items-stretch gap-2 border border-border/40 bg-background/50 p-2 transition-colors",
					isDragging &&
						"bg-card shadow-lg ring-1 ring-primary/40 scale-[1.02]",
				)}
			>
				{handle}

				<div className="flex flex-col gap-1.5 min-w-0 flex-1 py-0.5">
					<div className="flex items-start justify-between gap-2">
						<div className="flex items-center gap-1.5 min-w-0 flex-wrap">
							<p className="text-xs font-semibold text-foreground capitalize leading-tight">
								{exercise.name}
							</p>
						</div>

						<div className="flex items-center gap-0.5 shrink-0">
							<EditExerciseDialog
								exercise={exercise}
								onEditExercise={onEdit}
							/>
							<DeleteExerciseDialog
								exerciseName={exercise.name}
								onDelete={() => onDelete(exercise.id)}
							/>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 ftext-xs2">
						<Badge
							variant="outline"
							className="border-primary/70 bg-primary/20 font-extrabold fupper text-[9px]"
						>
							{exercise.type || "General"}
						</Badge>
						<span className="fmuted">
							<span className="font-bold text-foreground">
								{exercise.targetSets}
							</span>{" "}
							sets
						</span>
						·
						<span className="fmuted">
							<span className="font-bold text-foreground">
								{target.value}
							</span>
							{target.label ? ` ${target.label}` : ""}
						</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			className={cn(
				"transition-colors hover:bg-background/40",
				isDragging && "bg-card shadow-lg ring-1 ring-primary/40",
			)}
		>
			<TableCell className="w-8 py-2.5 pl-2 pr-0">{handle}</TableCell>

			<TableCell className="py-2.5 px-2">
				<p className="font-semibold text-foreground capitalize truncate">
					{exercise.name}
				</p>
			</TableCell>

			<TableCell className="py-2.5 px-2 text-center text-sm font-medium">
				{exercise.targetSets}
			</TableCell>

			<TableCell className="py-2.5 px-2 text-center text-sm font-medium">
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
