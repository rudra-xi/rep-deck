"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDialog, useFormField } from "@/hooks";

interface CreateDayDialogProps {
	onAddDay: (label: string, isRestDay: boolean) => void | Promise<void>;
}

export function CreateDayDialog({ onAddDay }: CreateDayDialogProps) {
	const { open, setOpen, loading, setLoading } = useDialog();
	const label = useFormField("");
	const [isRestDay, setIsRestDay] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!label.value.trim()) return;

		setLoading(true);
		try {
			await onAddDay(label.value.trim(), isRestDay);
			toast.success("Day added", {
				description: `${label.value.trim()} has been added.`,
			});
			label.reset();
			setIsRestDay(false);
			setOpen(false);
		} catch {
			toast.error("Failed to add day");
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
						<DialogTitle className="text-sm font-bold fupper text-foreground">
							Add Training Day
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 space-y-3">
						<div className="space-y-1">
							<span className="ftext-xs2 font-medium fupper fmuted">
								Day Label
							</span>
							<Input
								placeholder="e.g., Upper Body, Leg Day, Rest"
								value={label.value}
								onChange={label.onChange}
								className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
								autoFocus
							/>
						</div>

						<div className="fcy justify-between gap-3 p-2.5 border border-border/40 bg-background/50 rounded-none">
							<div className="fcol1 min-w-0">
								<Label className="text-xs font-medium text-foreground">
									Rest Day
								</Label>
								<p className="ftext-2xs fmuted leading-snug">
									Not counted as a training day.
								</p>
							</div>
							<Switch
								checked={isRestDay}
								onCheckedChange={setIsRestDay}
								className="shrink-0"
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							className="rounded-none h-8 text-xs border-border/50 mr-2"
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
