"use client";

import { TrashIcon } from "@phosphor-icons/react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteExerciseDialogProps {
	exerciseName: string;
	onDelete: () => void | Promise<void>;
}

export function DeleteExerciseDialog({
	exerciseName,
	onDelete,
}: DeleteExerciseDialogProps) {
	const handleDelete = async () => {
		try {
			await onDelete();
			toast.success("Exercise deleted", {
				description: `"${exerciseName}" has been deleted.`,
			});
		} catch (error) {
			toast.error("Delete failed", {
				description: "There was an error deleting the exercise.",
			});
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={
					<Button
						size="sm"
						variant="ghost"
						className="size-7 p-0 text-muted-foreground hover:text-destructive"
					>
						<TrashIcon className="size-3.5" />
					</Button>
				}
			/>

			<AlertDialogContent className="rounded-none border-secondary/50 bg-card">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-sm font-bold uppercase">
						Delete Exercise?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs">
						Are you sure you want to delete &quot;{exerciseName}
						&quot;? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="rounded-none h-8 text-xs">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className="rounded-none h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
