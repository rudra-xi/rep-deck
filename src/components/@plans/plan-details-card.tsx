"use client";

import { useRouter } from "next/navigation";
import { addPlanDay, deletePlanDay } from "@/actions/plans";
import { CreateDayDialog, DeleteDayDialog } from "@/plan-dialogs";
import { BlueprintIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanWithStructure } from "@/types/plans";

interface PlanDetailsCardProps {
	plan: PlanWithStructure;
	selectedDayId: string;
	onSelectDay: (dayId: string) => void;
}

export function PlanDetailsCard({
	plan,
	selectedDayId,
	onSelectDay,
}: PlanDetailsCardProps) {
	const router = useRouter();

	const handleAddDay = async (label: string) => {
		await addPlanDay(plan.id, label);
		router.refresh();
	};

	const handleDeleteDay = async (dayId: string) => {
		await deletePlanDay(dayId);
		router.refresh();
	};

	// Keyboard event handler for accessibility
	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLDivElement>,
		dayId: string,
	) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onSelectDay(dayId);
		}
	};

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<BlueprintIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					{plan.name} (v{plan.version})
				</CardTitle>

				{/* Modularized Create Day Dialog */}
				<CreateDayDialog onAddDay={handleAddDay} />
			</CardHeader>

			<CardContent className="space-y-2">
				<span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
					Select Training Day
				</span>

				<div className="space-y-1.5">
					{plan.days.map((day) => {
						const isSelected = day.id === selectedDayId;
						return (
							<div
								key={day.id}
								onClick={() => onSelectDay(day.id)}
								onKeyDown={(e) => handleKeyDown(e, day.id)}
								role="button"
								tabIndex={0}
								className={`w-full fcb p-2.5 text-xs capitalize transition-colors cursor-pointer border ${
									isSelected
										? "border-primary bg-primary/10 text-foreground font-semibold"
										: "border-border/40 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/40"
								}`}
							>
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-bold px-1.5 py-0.5 bg-background border border-border/50 text-primary">
										Day {day.dayIndex}
									</span>
									<span className="line-clamp-1">
										{day.label}
									</span>
								</div>

								<div className="flex items-center gap-1">
									{/* Modularized Delete Day Dialog */}
									<DeleteDayDialog
										dayLabel={day.label}
										onDelete={() => handleDeleteDay(day.id)}
									/>
									<CaretRightIcon
										className={`size-3.5 ${
											isSelected
												? "text-primary translate-x-0.5"
												: "text-muted-foreground"
										}`}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
