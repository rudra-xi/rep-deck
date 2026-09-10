"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	AlarmIcon,
	CheckCircleIcon,
	ArrowClockwiseIcon,
} from "@phosphor-icons/react";
import { useMeasurementReminders } from "@/hooks";

export function MeasurementReminders() {
	const { selectedDays, toggleDay, isDaySelected, days, resetToDefaults } =
		useMeasurementReminders();

	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none">
			<CardHeader className="p-4 pb-2">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center justify-between gap-2.5">
					<div className="flex items-center gap-2.5">
						<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
							<AlarmIcon className="size-4" weight="bold" />
						</div>
						Reminder
					</div>
					{selectedDays.length > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={resetToDefaults}
							className="h-5 px-1.5 text-[9px] text-muted-foreground hover:text-foreground rounded-none"
						>
							<ArrowClockwiseIcon
								className="size-3 mr-0.5"
								weight="bold"
							/>
							Reset
						</Button>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-1 space-y-3">
				<div className="text-xs text-muted-foreground space-y-1">
					<p>
						• Weigh & measure 1–2 times per week at the same time of
						day.
					</p>
					<p>• Use morning, fasted weight for maximum consistency.</p>
				</div>

				<div className="pt-1">
					<div className="flex items-center justify-between mb-1.5">
						<span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
							Target Tracking Days
						</span>
						<span className="text-[9px] text-muted-foreground">
							{selectedDays.length} selected
						</span>
					</div>
					<div className="flex flex-wrap gap-1">
						{days.map((day) => {
							const selected = isDaySelected(day);
							return (
								<Button
									key={day}
									size="sm"
									variant={selected ? "default" : "outline"}
									onClick={() => toggleDay(day)}
									className="h-6 px-2 text-[10px] rounded-none uppercase transition-all duration-200"
								>
									{day}
									{selected && (
										<CheckCircleIcon
											className="ml-1 size-3"
											weight="bold"
										/>
									)}
								</Button>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
