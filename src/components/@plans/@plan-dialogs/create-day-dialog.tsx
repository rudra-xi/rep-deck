"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDialog, useFormField } from "@/hooks";
import { toast } from "sonner";

interface CreateDayDialogProps {
	onAddDay: (label: string) => void | Promise<void>;
}

export function CreateDayDialog({ onAddDay }: CreateDayDialogProps) {
	const { open, setOpen, loading, setLoading } = useDialog();
	const label = useFormField("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!label.value.trim()) return;

		setLoading(true);
		try {
			await onAddDay(label.value.trim());
			toast.success("Day added", {
				description: `${label.value.trim()} has been added successfully.`,
			});
			label.reset();
			setOpen(false);
		} catch (error) {
			toast.error("Failed to add day", {
				description: "There was an error adding the day.",
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
						size="sm"
						variant="outline"
						className="h-7 text-xs rounded-none gap-1 border-border/50"
					>
						<PlusIcon className="size-3.5" weight="bold" />
						Add Day
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-[425px] rounded-none border-secondary/50 bg-card">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
							Add Training Day
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 space-y-1">
						<span className="text-[11px] font-medium uppercase text-muted-foreground">
							Day Label
						</span>
						<Input
							placeholder="e.g., Upper Body, Leg Day, Push A"
							value={label.value}
							onChange={label.onChange}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
							autoFocus
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							className="rounded-none h-8 text-xs border-border/50"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={loading}
							className="rounded-none h-8 text-xs"
						>
							{loading ? "Adding..." : "Add Day"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
