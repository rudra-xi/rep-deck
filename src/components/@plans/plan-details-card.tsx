// biome-ignore-all lint/a11y/useSemanticElements: interactive row wraps multi-element content; <button> would produce invalid HTML
"use client";

import { BlueprintIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { addPlanDay, deletePlanDay } from "@/actions/plans";
import { CardsHeader } from "@/common";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreateDayDialog, DeleteDayDialog } from "@/plan-dialogs";
import { PlanDetailsCardSkeleton } from "@/skeletons";
import type { PlanWithStructure } from "@/db/schema";

interface PlanDetailsCardProps {
	plan: PlanWithStructure;
	selectedDayId: string;
	onSelectDay: (dayId: string) => void;
	loading?: boolean;
}

export function PlanDetailsCard({
	plan,
	selectedDayId,
	onSelectDay,
	loading = false,
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

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLDivElement>,
		dayId: string,
	) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onSelectDay(dayId);
		}
	};

	if (loading)
		return <PlanDetailsCardSkeleton dayCount={plan.days?.length ?? 3} />;

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={BlueprintIcon}
				title={
					<>
						{plan.name}
						<Badge
							variant="outline"
							className="text-xs font-bold lowercase ml-1"
						>
							v{plan.version}
						</Badge>
					</>
				}
				trailing={<CreateDayDialog onAddDay={handleAddDay} />}
			/>

			<CardContent className="p-4 pt-1 fcol2">
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
								<div className="fcy gap-2">
									<span className="text-[10px] font-bold px-1.5 py-0.5 bg-background border border-border/50 text-primary">
										Day {day.dayIndex}
									</span>
									<span className="line-clamp-1">
										{day.label}
									</span>
								</div>

								<div className="fcy gap-1">
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
