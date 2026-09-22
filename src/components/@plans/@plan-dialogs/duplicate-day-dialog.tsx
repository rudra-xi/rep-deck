"use client";

import { CopyIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { duplicateDay } from "@/actions/plans";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/hooks";

interface DuplicateDayDialogProps {
	day: { id: string; label: string };
	onSuccess?: (newDayId: string) => void;
}

export function DuplicateDayDialog({
	day,
	onSuccess,
}: DuplicateDayDialogProps) {
	const router = useRouter();
	const { open, setOpen, loading, setLoading } = useDialog();
	const [label, setLabel] = useState(`${day.label} (Copy)`);

	useEffect(() => {
		if (open) {
			setLabel(`${day.label} (Copy)`);
		}
	}, [open, day.label]);

	const handleDuplicate = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!day?.id) {
			toast.error("Error: Missing day ID");
			return;
		}

		if (!label.trim()) {
			toast.error("Please enter a valid day label");
			return;
		}

		setLoading(true);
		try {
			const res = await duplicateDay(day.id, { label: label.trim() });

			if (res?.success) {
				toast.success("Day duplicated", {
					description: `"${label.trim()}" has been created successfully.`,
				});
				setOpen(false);
				router.refresh();
				if (res.day?.id && onSuccess) {
					onSuccess(res.day.id);
				}
			} else {
				toast.error("Duplicate failed", {
					description:
						res?.error || "There was an error duplicating the day.",
				});
			}
		} catch (error) {
			console.error("Duplicate Day Error:", error);
			toast.error("Duplicate failed", {
				description: "An unexpected error occurred while duplicating.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						size="icon"
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation();
							setOpen(true);
						}}
						className="size-6 p-0 fmuted hover:text-primary"
					>
						<CopyIcon className="size-3.5" />
					</Button>
				}
			/>

			<DialogContent
				onKeyDown={(e) => e.stopPropagation()}
				className="sm:max-w-md rounded-none border-secondary/50 bg-card"
			>
				<DialogHeader>
					<DialogTitle className="text-sm font-bold fupper fcy gap-2 text-primary">
						<CopyIcon className="size-4" weight="bold" />
						Duplicate
						<span className="text-foreground">{day?.label}</span>
					</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						All exercises will be duplicated into the new day.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleDuplicate} className="space-y-4 pt-2">
					<div className="space-y-1">
						<span className="ftext-xs2 font-medium fupper fmuted block">
							New Day Label
						</span>
						<Input
							value={label}
							onChange={(e) => setLabel(e.target.value)}
							placeholder={`${day?.label || "Day"} (Copy)`}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
							required
							autoFocus
						/>
					</div>

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setOpen(false)}
							className="rounded-none h-8 text-xs mr-2"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={loading || !label.trim()}
							className="rounded-none h-8 text-xs gap-1.5 font-semibold"
						>
							{loading ? "Duplicating..." : "Duplicate"}
							<CopyIcon className="size-3.5" weight="bold" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
