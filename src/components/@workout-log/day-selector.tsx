"use client";

import {
	BarbellIcon,
	CalendarDotsIcon,
	CheckCircleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ProgramDay {
	id: string;
	dayIndex: number;
	label: string;
}

interface DaySelectorProps {
	programName?: string;
	days?: ProgramDay[];
	selectedDayIndex: number;
	onSelectDay: (dayIndex: number) => void;
}

export function DaySelector({
	programName = "Base Sets v3",
	days = [],
	selectedDayIndex,
	onSelectDay,
}: DaySelectorProps) {
	const handleDaySelect = (day: ProgramDay) => {
		// Don't show toast if selecting the same day
		if (day.dayIndex === selectedDayIndex) {
			toast.info(`Already on ${day.label}`, {
				description: `Day ${day.dayIndex} is currently selected.`,
				duration: 2000,
			});
			return;
		}

		// Show toast when switching days
		toast.info(`Switched to ${day.label}`, {
			description: `Day ${day.dayIndex} - ${day.label}`,
			duration: 2500,
			icon: <CalendarDotsIcon className="size-4" weight="bold" />,
		});

		// Call the parent handler
		onSelectDay(day.dayIndex);
	};

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 base-ease hover:border-primary/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div>
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<BarbellIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						{programName}
					</CardTitle>
				</div>
				<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary sh0">
					<CalendarDotsIcon className="size-4" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-3">
				<div className="flex items-center justify-between">
					<span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
						Select Training Day
					</span>
				</div>

				{days.length === 0 ? (
					<p className="text-xs text-muted-foreground italic py-1">
						No days configured for this program.
					</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{days.map((day) => {
							const isActive = day.dayIndex === selectedDayIndex;
							return (
								<Button
									key={day.id}
									type="button"
									size="sm"
									variant={isActive ? "default" : "outline"}
									onClick={() => handleDaySelect(day)}
									className={`h-8 text-xs font-semibold gap-1.5 cursor-pointer transition-colors ${
										isActive
											? "border-primary bg-primary/10 text-foreground font-semibold"
											: "border-border/40 bg-background/10 text-muted-foreground hover:text-foreground hover:border-primary/40"
									}`}
								>
									{isActive && (
										<CheckCircleIcon
											className="size-3.5 text-primary-foreground"
											weight="bold"
										/>
									)}
									<span>
										{day.dayIndex}. {day.label}
									</span>
								</Button>
							);
						})}
					</div>
				)}
				<div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
					<span>
						Total Days:{" "}
						<strong className="text-foreground">
							{days.length}
						</strong>
					</span>
					<span>
						Active:{" "}
						<strong className="text-primary">
							Day {selectedDayIndex}
						</strong>
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
