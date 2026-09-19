"use client";

import { CalendarDotsIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { CardsHeader } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
		if (day.dayIndex === selectedDayIndex) {
			toast.info(`Already on ${day.label}`, {
				description: `Day ${day.dayIndex} is currently selected.`,
				duration: 2000,
			});
			return;
		}

		toast.info(`Switched to ${day.label}`, {
			description: `Day ${day.dayIndex} - ${day.label}`,
			duration: 2500,
			icon: <CalendarDotsIcon className="size-4" weight="bold" />,
		});

		onSelectDay(day.dayIndex);
	};

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader icon={CalendarDotsIcon} title={programName} />

			<CardContent className="p-4 pt-1 fcol3">
				<div className="fcb">
					<span className="ftext-xs2 font-medium fmuted fupper">
						Select Training Day
					</span>
				</div>

				{days.length === 0 ? (
					<p className="text-xs fmuted italic py-1">
						No days configured for this program.
					</p>
				) : (
					<div className="fwrap gap-2">
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
											: "border-border/40 bg-background/10 fmuted hover:text-foreground hover:border-primary/40"
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

				<div className="fc justify-end gap-3 text-xs fmuted">
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
