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

interface DeletePlanDialogProps {
	planName: string;
	onDelete: () => void | Promise<void>;
}

export function DeletePlanDialog({
	planName,
	onDelete,
}: DeletePlanDialogProps) {
	const { open, setOpen, loading, setLoading } = useDialog();

	const handleDelete = async () => {
		setLoading(true);
		try {
			await onDelete();
			toast.success("Plan deleted", {
				description: `"${planName}" has been deleted.`,
			});
			setOpen(false);
		} catch (error) {
			toast.error("Delete failed", {
				description: "There was an error deleting the plan.",
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
						size="icon-sm"
						variant="outline"
						onClick={(e) => {
							e.stopPropagation();
							setOpen(true);
						}}
						className="rounded-none h-7 text-[11px] gap-1 border-border/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
					>
						<TrashIcon className="size-3" weight="bold" />
						
					</Button>
				}
			/>

			<AlertDialogContent
				onClick={(e) => e.stopPropagation()}
				className="rounded-none"
			>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-sm font-bold uppercase">
						Delete Training Plan?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs">
						Are you sure you want to delete &quot;{planName}&quot;?
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
