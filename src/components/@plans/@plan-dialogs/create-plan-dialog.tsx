"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPlan } from "@/actions/plans";
import { CalendarIcon, PlusIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
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
import { useDialogForm } from "@/hooks";
import { toast } from "sonner";

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

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		try {
			await handleSubmit(async () => {
				await createPlan({
					name: name.trim(),
					startDate: startDate ? startDate.toISOString() : undefined,
				});
			});
		} catch (error) {
			toast.error("Failed to create plan", {
				description: "There was an error creating the plan.",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* Card styled directly as the DialogTrigger */}
			<DialogTrigger
				nativeButton={false}
				render={
					<Card
						size="sm"
						className="relative cursor-pointer border border-dashed border-primary/40 bg-card/30 hover:bg-card/60 base-ease rounded-none shadow-none transition-all hover:border-primary group h-full flex flex-col justify-between"
					>
						<CardHeader className="space-y-0 pb-2 flex fcb">
							<div className="flex items-center gap-1.5">
								<CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
									New Plan
								</CardTitle>
								<span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-none bg-primary/10 text-primary border border-primary/20">
									CREATE
								</span>
							</div>

							<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0 group-hover:scale-105 transition-transform">
								<PlusIcon className="size-3.5" weight="bold" />
							</div>
						</CardHeader>

						<CardContent className="space-y-3 pt-1 flex-1 flex flex-col justify-between">
							<div className="flex flex-col items-center justify-center py-4 text-center border-t border-border/40">
								<div className="fc p-2 rounded-full bg-primary/10 text-primary mb-1">
									<PlusIcon
										className="size-4"
										weight="bold"
									/>
								</div>
								<span className="text-xs font-semibold text-foreground">
									Add Training Plan
								</span>
								<span className="text-[10px] text-muted-foreground">
									Click to configure details
								</span>
							</div>
						</CardContent>
					</Card>
				}
			/>

			{/* Modal Dialog Content */}
			<DialogContent className="sm:max-w-[425px] rounded-none border-secondary/50 bg-card">
				<form onSubmit={handleFormSubmit}>
					<DialogHeader>
						<DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
							Create New Training Plan
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 space-y-4">
						{/* Plan Name Input */}
						<div className="space-y-1">
							<span className="text-[11px] font-medium uppercase text-muted-foreground">
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

						{/* Shadcn Calendar Date Picker */}
						<div className="space-y-1 flex flex-col">
							<span className="text-[11px] font-medium uppercase text-muted-foreground">
								Start Date
							</span>
							<Popover>
								<PopoverTrigger
									render={
										<Button
											variant="outline"
											className={`w-full justify-start text-left font-normal h-8 text-xs rounded-none border-border/50 bg-background/50 ${
												!startDate &&
												"text-muted-foreground"
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
							{loading ? "Creating..." : "Create Plan"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
