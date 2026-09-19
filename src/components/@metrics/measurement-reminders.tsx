"use client";

import {
	AlarmIcon,
	ArrowClockwiseIcon,
	CheckCircleIcon,
} from "@phosphor-icons/react";
import { CardsHeader } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMeasurementReminders } from "@/hooks";

export function MeasurementReminders() {
	const { selectedDays, toggleDay, isDaySelected, days, resetToDefaults } =
		useMeasurementReminders();

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={AlarmIcon}
				title="Reminder"
				trailing={
					selectedDays.length > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={resetToDefaults}
							className="h-5 px-1.5 ftext-3xs fmuted hover:text-foreground rounded-none"
						>
							<ArrowClockwiseIcon
								className="size-3 mr-0.5"
								weight="bold"
							/>
							Reset
						</Button>
					)
				}
			/>

			<CardContent className="p-4 pt-1 fcol3">
				<div className="text-xs text-muted-foreground space-y-1">
					<p>
						• Weigh & measure 1–2 times per week at the same time of
						day.
					</p>
					<p>• Use morning, fasted weight for maximum consistency.</p>
				</div>

				<div className="pt-1">
					<div className="fcb mb-1.5">
						<span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
							Target Tracking Days
						</span>
						<span className="text-[9px] text-muted-foreground">
							{selectedDays.length} selected
						</span>
					</div>
					<div className="fwrap gap-1">
						{days.map((day) => {
							const selected = isDaySelected(day);
							return (
								<Button
									key={day}
									size="sm"
									variant={selected ? "default" : "outline"}
									onClick={() => toggleDay(day)}
									className="h-6 px-2 text-[10px] rounded-none uppercase base-ease"
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
