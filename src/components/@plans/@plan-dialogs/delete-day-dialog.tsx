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
import { useDialog } from "@/hooks";
import { toast } from "sonner";

interface DeleteDayDialogProps {
	dayLabel: string;
	onDelete: () => void | Promise<void>;
}

export function DeleteDayDialog({ dayLabel, onDelete }: DeleteDayDialogProps) {
	const { open, setOpen, loading, setLoading } = useDialog();

	const handleDelete = async () => {
		setLoading(true);
		try {
			await onDelete();
			toast.success("Day deleted", {
				description: `"${dayLabel}" has been deleted.`,
			});
			setOpen(false);
		} catch (error) {
			toast.error("Delete failed", {
				description: "There was an error deleting the day.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={
					<Button
						size="sm"
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation();
							setOpen(true);
						}}
						className="size-6 p-0 text-muted-foreground hover:text-destructive"
					>
						<TrashIcon className="size-3.5" />
					</Button>
				}
			/>

			<AlertDialogContent
				onClick={(e) => e.stopPropagation()}
				className="rounded-none border-secondary/50 bg-card"
			>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-sm font-bold uppercase">
						Delete Training Day?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs">
						Are you sure you want to delete &quot;{dayLabel}&quot;?
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="rounded-none h-8 text-xs">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={loading}
						className="rounded-none h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{loading ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
