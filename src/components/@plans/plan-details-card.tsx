"use client";

import { BlueprintIcon, CalendarIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Plan } from "@/constants/mock-data";
import { Button } from "../ui/button";

interface PlanDetailsCardProps {
	plan: Plan;
	selectedDayId: number;
	onSelectDay: (dayId: number) => void;
}

export function PlanDetailsCard({
	plan,
	selectedDayId,
	onSelectDay,
}: PlanDetailsCardProps) {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 base-ease hover:border-primary/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div className="flex items-center gap-2">
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<BlueprintIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						{plan.name} ({plan.version})
					</CardTitle>
				</div>

				<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
					<CalendarIcon className="size-4" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-2">
				<span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
					Select Training Day
				</span>

				<div className="space-y-1.5">
					{plan.days.map((day) => {
						const isSelected = day.id === selectedDayId;
						return (
							<Button
								key={day.id}
								onClick={() => onSelectDay(day.id)}
								className={`w-full fcb p-2.5 text-left text-xs transition-colors rounded-none border ${
									isSelected
										? "border-primary bg-primary/10 text-foreground font-semibold"
										: "border-border/40 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/40"
								}`}
							>
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-bold px-1.5 py-0.5 bg-background border border-border/50 text-primary">
										{day.label}
									</span>
									<span className="line-clamp-1">
										{day.title}
									</span>
								</div>
								<CaretRightIcon
									className={`size-3.5 transition-transform ${
										isSelected
											? "text-primary translate-x-0.5"
											: "text-muted-foreground"
									}`}
								/>
							</Button>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
