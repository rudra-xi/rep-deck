"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import type { ScheduleHeatmapDay } from "@/actions/progress";
import { DAY_LABELS, STATUS_STYLE } from "@/constants";
import { useMediaQuery } from "@/hooks";
import { cn } from "@/lib/utils";

interface ScheduleHeatmapProps {
	data: ScheduleHeatmapDay[];
	weeks?: number;
}

interface WeekGrid {
	key: string;
	days: Array<ScheduleHeatmapDay | null>;
}

export function ScheduleHeatmap({ data, weeks = 26 }: ScheduleHeatmapProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const displayWeeks = isDesktop ? weeks : Math.min(weeks, 52);

	const { grid } = useMemo(() => {
		const byDate = new Map(data.map((d) => [d.date, d]));
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Monday-first: 0=Mon..6=Sun
		const dayIdxMondayFirst = (today.getDay() + 6) % 7;

		const endOfWeek = new Date(today);
		endOfWeek.setDate(today.getDate() + (6 - dayIdxMondayFirst));

		const grid: WeekGrid[] = [];
		for (let w = displayWeeks - 1; w >= 0; w--) {
			const weekStart = new Date(endOfWeek);
			weekStart.setDate(endOfWeek.getDate() - w * 7 - 6);
			const weekKey = format(weekStart, "yyyy-MM-dd");

			const days: Array<ScheduleHeatmapDay | null> = [];
			for (let d = 0; d < 7; d++) {
				const date = new Date(weekStart);
				date.setDate(weekStart.getDate() + d);
				const iso = format(date, "yyyy-MM-dd");
				days.push(byDate.get(iso) ?? null);
			}

			grid.push({ key: weekKey, days });
		}
		return { grid };
	}, [data, displayWeeks]);

	const trainedCount = data.filter((d) => d.status === "trained").length;
	const skippedCount = data.filter((d) => d.status === "skipped").length;
	const restCount = data.filter((d) => d.status === "rest").length;

	return (
		<div className="fcol gap-3">
			<div className="w-full overflow-x-auto pb-1">
				<div className="flex gap-2 items-start w-max">
					{/* Day-of-week labels */}
					<div className="fcol gap-1 sm:gap-1.5">
						{DAY_LABELS.map((day, i) => (
							<span
								key={day.key}
								className="ftext-2xs fmuted fupper flex items-center h-4 sm:h-5 leading-none"
							>
								{i % 2 === 0 ? day.short : ""}
							</span>
						))}
					</div>

					{/* Grid */}
					<div className="flex gap-1 sm:gap-1.5">
						{grid.map((week) => (
							<div
								key={week.key}
								className="fcol gap-1 sm:gap-1.5"
							>
								{week.days.map((day, di) => {
									if (!day) {
										return (
											<div
												key={`empty-${week.key}-${di}`}
												className="size-4 sm:size-5 rounded-none border border-border/10"
											/>
										);
									}
									const style = STATUS_STYLE[day.status];
									return (
										<div
											key={day.date}
											className={cn(
												"size-4 sm:size-5 rounded-none border",
												style.className,
											)}
											title={`${format(new Date(day.date), "PPP")} · ${style.description}${
												day.scheduledDayLabel
													? ` (${day.scheduledDayLabel})`
													: ""
											}`}
										/>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Legend */}
			<div className="fwrap gap-x-6 gap-y-2 items-center">
				{(["trained", "rest", "skipped"] as const).map((status) => {
					const style = STATUS_STYLE[status];
					const count =
						status === "trained"
							? trainedCount
							: status === "rest"
								? restCount
								: skippedCount;
					return (
						<div key={status} className="fcy gap-2">
							<span
								className={cn(
									"size-3 rounded-none border",
									style.className,
								)}
							/>
							<span className="ftext-xs fmuted capitalize">
								{style.label}
								<span className="ml-1.5 text-foreground font-semibold tabular-nums">
									{count}
								</span>
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
