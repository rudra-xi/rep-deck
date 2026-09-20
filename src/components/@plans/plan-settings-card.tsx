"use client";

import {
	CalendarDotsIcon,
	FloppyDiskIcon,
	GearIcon,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updatePlan } from "@/actions/plans";
import { CardsHeader } from "@/common";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { PlanWithStructure } from "@/db/schema";
import { cn } from "@/lib/utils";
import { PlanSettingsCardSkeleton } from "@/skeletons";

interface PlanSettingsCardProps {
	plan: PlanWithStructure;
	isLoading?: boolean;
}

export function PlanSettingsCard({
	plan,
	isLoading = false,
}: PlanSettingsCardProps) {
	const router = useRouter();
	const [name, setName] = useState(plan.name);
	const [version, setVersion] = useState(plan.version);
	const [startDate, setStartDate] = useState<Date | undefined>(
		plan.startDate ? new Date(plan.startDate) : undefined,
	);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setName(plan.name);
		setVersion(plan.version);
		setStartDate(plan.startDate ? new Date(plan.startDate) : undefined);
	}, [plan]);

	const handleSave = async () => {
		setLoading(true);
		try {
			await updatePlan(plan.id, {
				name: name.trim(),
				version: Number(version),
				startDate: startDate ? startDate.toISOString() : null,
			});
			toast.success("Plan updated", {
				description: `"${name.trim()}" (v${version}) has been updated successfully.`,
			});
		} catch {
			toast.error("Update failed", {
				description: "There was an error updating the plan.",
			});
		} finally {
			setLoading(false);
		}

		router.refresh();
	};

	if (isLoading) return <PlanSettingsCardSkeleton />;

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={GearIcon}
				title={`Configuration: ${plan.name} (v${plan.version})`}
			/>

			<CardContent className="p-4 pt-1 fcol4">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
							Plan Name
						</span>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
					</div>

					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
							Version Number
						</span>
						<Input
							type="number"
							value={version}
							onChange={(e) => setVersion(Number(e.target.value))}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
					</div>

					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
							Start Date
						</span>
						<Popover>
							<PopoverTrigger
								render={
									<Button
										variant="outline"
										className={cn(
											"w-full h-8 justify-start text-left text-xs font-normal rounded-none border-border/50 bg-background/50",
											!startDate &&
												"text-muted-foreground",
										)}
									>
										<CalendarDotsIcon className="mr-2 size-3.5 text-muted-foreground" />
										{startDate ? (
											format(startDate, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								}
							/>
							<PopoverContent
								className="w-auto p-0 rounded-none border-secondary/50 bg-card"
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

				<div className="fcy justify-end gap-2 pt-2 border-t border-border/40">
					<Button
						size="sm"
						variant="default"
						disabled={loading}
						onClick={handleSave}
						className="rounded-none h-8 text-xs gap-1 font-semibold"
					>
						<FloppyDiskIcon className="size-3.5" weight="bold" />
						{loading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
