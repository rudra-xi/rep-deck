"use client";

import { CalendarIcon, PlusIcon, RepeatIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createPlan } from "@/actions/plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDialogForm } from "@/hooks";
import { WEEKDAY_NAMES } from "@/lib/weekday-anchor";

const NO_ANCHOR = "none";

export function CreatePlanDialog() {
	const router = useRouter();
	const { open, setOpen, name, setName, loading, handleSubmit } =
		useDialogForm({
			onSuccess: () => {
				toast.success("Plan created", {
					description: `${name.trim()} has been created successfully.`,
				});
				router.refresh();
			},
		});

	const [startDate, setStartDate] = useState<Date | undefined>(new Date());
	const [anchor, setAnchor] = useState<string>(NO_ANCHOR);

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		try {
			await handleSubmit(async () => {
				await createPlan({
					name: name.trim(),
					startDate: startDate ? startDate.toISOString() : undefined,
					anchorWeekday: anchor === NO_ANCHOR ? null : Number(anchor),
				});
			});
		} catch {
			toast.error("Failed to create plan", {
				description: "There was an error creating the plan.",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				nativeButton={false}
				render={
					<Card
						size="sm"
						className="relative cursor-pointer border border-dashed border-primary/40 bg-card/30 hover:bg-card/60 base-ease rounded-none shadow-none hover:border-primary group h-full fcol justify-between"
					>
						<CardHeader className="space-y-0 pb-2 flex fcb">
							<div className="fg1_5">
								<CardTitle className="text-xs font-bold fupper fmuted group-hover:text-primary transition-colors">
									New Plan
								</CardTitle>
								<Badge
									variant="outline"
									className="rounded-none ftext-3xs font-extrabold fupper px-1 py-0 bg-primary/10 text-primary border-primary/20"
								>
									CREATE
								</Badge>
							</div>

							<div className="ficon-box-sm group-hover:scale-105 transition-transform">
								<PlusIcon className="size-3.5" weight="bold" />
							</div>
						</CardHeader>

						<CardContent className="space-y-3 pt-1 fgrow fcol justify-between">
							<div className="fcol items-center justify-center py-4 text-center border-t border-border/40">
								<div className="fc p-2 rounded-full bg-primary/10 text-primary mb-1">
									<PlusIcon
										className="size-4"
										weight="bold"
									/>
								</div>
								<span className="text-xs font-semibold text-foreground">
									Add Training Plan
								</span>
								<span className="ftext-2xs fmuted">
									Click to configure details
								</span>
							</div>
						</CardContent>
					</Card>
				}
			/>

			<DialogContent className="sm:max-w-[425px] rounded-none border-secondary/50 bg-card">
				<form onSubmit={handleFormSubmit}>
					<DialogHeader>
						<DialogTitle className="fupper">
							Create New Training Plan
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 space-y-4">
						<div className="space-y-1">
							<span className="ftext-xs2 font-medium fupper fmuted">
								Plan Name
							</span>
							<Input
								placeholder="e.g., Push Pull Legs, Hypertrophy Split"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
								autoFocus
							/>
						</div>

						<div className="space-y-1 fcol">
							<span className="ftext-xs2 font-medium fupper fmuted">
								Start Date
							</span>
							<Popover>
								<PopoverTrigger
									render={
										<Button
											variant="outline"
											className={`w-full justify-start text-left font-normal h-8 text-xs rounded-none border-border/50 bg-background/50 ${
												!startDate && "fmuted"
											}`}
										>
											<CalendarIcon className="mr-2 size-3.5" />
											{startDate ? (
												format(startDate, "PPP")
											) : (
												<span>Pick a start date</span>
											)}
										</Button>
									}
								/>
								<PopoverContent
									className="w-auto p-0 rounded-none border border-secondary/50"
									align="start"
								>
									<Calendar
										mode="single"
										selected={startDate}
										onSelect={setStartDate}
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className="space-y-1">
							<div className="fcb">
								<span className="ftext-xs2 font-medium fupper fmuted">
									Anchor to Weekday
								</span>
								<span className="ftext-2xs fmuted">
									Optional
								</span>
							</div>
							<Select
								value={anchor}
								onValueChange={(value) =>
									setAnchor(value ?? NO_ANCHOR)
								}
							>
								<SelectTrigger className="rounded-none h-8 text-xs border-border/50 bg-background/50">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="rounded-none">
									<SelectItem
										value={NO_ANCHOR}
										label="No anchor (rotation)"
										className="text-xs rounded-none"
									>
										<span className="fcy gap-1.5">
											<RepeatIcon
												className="size-3"
												weight="bold"
											/>
											No anchor (rotation)
										</span>
									</SelectItem>
									{WEEKDAY_NAMES.map((day, i) => (
										<SelectItem
											key={day}
											value={i.toString()}
											label={`Starts on ${day}`}
											className="text-xs rounded-none"
										>
											Starts on {day}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="ftext-2xs fmuted pt-1">
								{anchor === NO_ANCHOR
									? "Your plan cycles through the days in order, with no fixed weekday."
									: `Day 1 is ${WEEKDAY_NAMES[Number(anchor)]}, day 2 is the next weekday, and so on.`}
							</p>
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
							{loading ? "Creating..." : "Create Plan"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
