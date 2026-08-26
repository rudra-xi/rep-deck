"use client";

import { BarbellIcon, CalendarDotsIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DAYS } from "@/constants/mock-data";

interface DaySelectorProps {
	selectedDay: number;
	onSelectDay: (day: number) => void;
}

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
	const currentDayLabel =
		DAYS.find((d) => d.id === selectedDay)?.label || "Select a day";

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 base-ease hover:border-primary/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div>
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<BarbellIcon weight="bold" className="text-popover-foreground"/>
						Base Sets v3
					</CardTitle>
				</div>

				<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
					<CalendarDotsIcon className="size-4" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
				<div className="sm:col-span-2 space-y-1.5">
					<span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
						Select Training Day
					</span>
					<Select
						value={String(selectedDay)}
						onValueChange={(val) => onSelectDay(Number(val))}
					>
						<SelectTrigger className="w-full rounded-none text-xs font-semibold h-9 border-border/50 bg-background/50 hover:border-primary/50 transition-colors">
							<SelectValue placeholder={currentDayLabel}>
								{currentDayLabel}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className="rounded-none border-secondary/50">
							{DAYS.map((day) => (
								<SelectItem
									key={day.id}
									value={String(day.id)}
									className="rounded-none text-xs font-medium focus:bg-accent focus:text-accent-foreground cursor-pointer"
								>
									{day.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="sm:col-span-1 flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
					<span>
						Total Days:{" "}
						<strong className="text-foreground">
							{DAYS.length}
						</strong>
					</span>
					<span>
						Active:{" "}
						<strong className="text-primary">
							Day {selectedDay}
						</strong>
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
