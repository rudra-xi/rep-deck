"use client";

import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
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

interface EditDayDialogProps {
	day: { id: string; label: string; isRestDay: boolean };
	onEditDay: (
		dayId: string,
		data: { label: string; isRestDay: boolean },
	) => void | Promise<void>;
}

export function EditDayDialog({ day, onEditDay }: EditDayDialogProps) {
	const { open, setOpen, loading, setLoading } = useDialog();
	const label = useFormField(day.label);
	const [isRestDay, setIsRestDay] = useState(day.isRestDay);

	useEffect(() => {
		if (open) {
			label.setValue(day.label);
			setIsRestDay(day.isRestDay);
		}
	}, [open, day.label, day.isRestDay, label.setValue]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const finalLabel = label.value.trim();
		if (!finalLabel) return;

		setLoading(true);
		try {
			await onEditDay(day.id, {
				label: finalLabel,
				isRestDay,
			});
			toast.success("Day updated", {
				description: `"${finalLabel}" has been updated.`,
			});
			setOpen(false);
		} catch {
			toast.error("Update failed", {
				description: "There was an error updating the day.",
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
						className="size-6 p-0 fmuted hover:text-foreground"
					>
						<PencilSimpleIcon className="size-3.5" />
					</Button>
				}
			/>
			<DialogContent
				onKeyDown={(e) => e.stopPropagation()}
				className="sm:max-w-[425px] rounded-none border-secondary/50 bg-card"
			>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-sm font-bold fupper text-foreground">
							Edit Training Day
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 space-y-3">
						<div className="space-y-1">
							<span className="ftext-xs2 font-medium fupper fmuted">
								Day Label
							</span>
							<Input
								placeholder="e.g., Monday, Leg Day, Push A"
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
									Excluded from session targets and the
									workout log day picker.
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
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
