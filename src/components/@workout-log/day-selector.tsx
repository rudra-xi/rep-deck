"use client";

import {
	CalendarDotsIcon,
	CaretLeftIcon,
	CaretRightIcon,
	CheckCircleIcon,
} from "@phosphor-icons/react";
import { addDays, format, isToday, subDays } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { CardsHeader } from "@/common";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { deriveWeekdayShort } from "@/lib/weekday-anchor";
import { Badge } from "../ui/badge";

interface ProgramDay {
	id: string;
	dayIndex: number;
	label: string;
}

interface DaySelectorProps {
	programName?: string;
	days?: ProgramDay[];
	selectedDayIndex: number;
	anchorWeekday?: number | null;
	onSelectDay: (dayIndex: number) => void;

	date?: Date;
	onDateChange?: (date: Date) => void;
	scheduledDayIndex?: number | null;
	scheduledDayLabel?: string | null;
}

export function DaySelector({
	programName = "",
	days = [],
	selectedDayIndex,
	anchorWeekday,
	onSelectDay,
	date,
	onDateChange,
	scheduledDayIndex,
	scheduledDayLabel,
}: DaySelectorProps) {
	const [calendarOpen, setCalendarOpen] = useState(false);

	const isAnchored = anchorWeekday != null;
	const today = new Date();
	const canGoNext = date
		? addDays(date, 1).getTime() <= today.getTime()
		: false;
	const showDateRow = date != null && onDateChange != null;

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
				{showDateRow && (
					<div className="fcol2 pb-3 border-b border-border/40">
						<div className="fcb">
							<span className="ftext-xs2 font-medium fmuted fupper">
								Session Date
							</span>
							{!isToday(date) && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => onDateChange(new Date())}
									className="h-6 px-2 text-[10px] rounded-none fmuted hover:text-primary"
								>
									Back to today
								</Button>
							)}
						</div>

						<div className="fcy gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => onDateChange(subDays(date, 1))}
								className="size-8 rounded-none shrink-0"
								title="Previous day"
							>
								<CaretLeftIcon size={14} weight="bold" />
							</Button>

							<Popover
								open={calendarOpen}
								onOpenChange={setCalendarOpen}
							>
								<PopoverTrigger
									render={
										<Button
											variant="outline"
											className="h-8 flex-1 justify-start text-xs rounded-none border-border/50 bg-background/50"
										>
											<CalendarDotsIcon className="mr-2 size-3.5 text-primary" />
											{format(date, "PPP")}
											{isToday(date) && (
												<Badge
													variant={"link"}
													className="text-xs opacity-60"
												>
													Today
												</Badge>
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
										selected={date}
										onSelect={(d) => {
											if (d) {
												onDateChange(d);
												setCalendarOpen(false);
											}
										}}
										disabled={(d) => d > new Date()}
									/>
								</PopoverContent>
							</Popover>

							<Button
								variant="outline"
								size="icon"
								onClick={() => onDateChange(addDays(date, 1))}
								disabled={!canGoNext}
								className="size-8 rounded-none shrink-0"
								title="Next day"
							>
								<CaretRightIcon size={14} weight="bold" />
							</Button>
						</div>

						<div className="text-xs">
							{isAnchored ? (
								scheduledDayIndex != null ? (
									<p className="fcy gap-2">
										<span className="text-muted-foreground">
											Scheduled:
										</span>
										<span className="font-semibold text-foreground">
											{scheduledDayLabel}
										</span>
									</p>
								) : (
									<p className="fmuted italic">
										No session scheduled for this day — pick
										a day manually below.
									</p>
								)
							) : (
								<p className="fmuted italic">
									This plan isn't anchored to weekdays. Pick
									the day you trained below.
								</p>
							)}
						</div>
					</div>
				)}

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
							const derived = deriveWeekdayShort(
								anchorWeekday ?? null,
								day.dayIndex,
							);
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
										{day.label}
										{derived && (
											<span className="ftext-2xs fmuted ml-1">
												· {derived}
											</span>
										)}
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
