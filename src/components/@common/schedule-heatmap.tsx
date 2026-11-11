"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import type { ScheduleHeatmapDay } from "@/actions/progress";
import { DAY_LABELS, HEATMAP_MONTHS, STATUS_STYLE } from "@/constants";
import { useMediaQuery } from "@/hooks";
import { cn } from "@/lib/utils";

interface ScheduleHeatmapProps {
	data: ScheduleHeatmapDay[];
	weeks?: number;
}

interface WeekGrid {
	key: string;
	weekStart: Date;
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

			grid.push({ key: weekKey, weekStart, days });
		}
		return { grid };
	}, [data, displayWeeks]);

	const trainedCount = data.filter((d) => d.status === "trained").length;
	const skippedCount = data.filter((d) => d.status === "skipped").length;
	const restCount = data.filter((d) => d.status === "rest").length;

	// Month labels — show the month for a week column only when
	// the month changes from the previous week. This avoids
	// repeating "Jan Jan Jan Jan Jan..." across 52 columns.
	const monthLabels = grid.map((week, idx) => {
		const prev = idx > 0 ? grid[idx - 1].weekStart : null;
		const currMonth = week.weekStart.getMonth();
		const prevMonth = prev?.getMonth();
		return prevMonth !== currMonth ? HEATMAP_MONTHS[currMonth] : null;
	});

	// ── Rectangle dimensions ───────────────────────────────────
	// Mobile: 20×16 (wider than tall)
	// Desktop: 24×18 (larger, still wide)
	const cellW = "w-8 lg:w-15"; // 20px → 24px
	const cellH = "h-3 lg:h-4"; // 16px → 18px
	const gap = "gap-1 lg:gap-1.5";

	return (
		<div className="fcol gap-3">
			<div className="w-full overflow-x-auto pb-1">
				<div className="flex gap-2 items-start w-max">
					{/* Day-of-week labels */}
					<div className={cn("fcol", gap)}>
						{DAY_LABELS.map((day, i) => (
							<span
								key={day.key}
								className={cn(
									"ftext-2xs fmuted fupper flex items-center leading-none",
									cellH,
								)}
							>
								{i % 2 === 0 ? day.short : ""}
							</span>
						))}
					</div>

					{/* Grid + month labels */}
					<div className="fcol gap-1">
						{/* Month labels row */}
						<div className={cn("flex", gap)}>
							{monthLabels.map((label, idx) => (
								<div
									key={grid[idx].key}
									className={cn(
										"ftext-3xs fmuted font-semibold fupper",
										"shrink-0",
										cellW,
									)}
								>
									{label ?? ""}
								</div>
							))}
						</div>

						{/* Heatmap grid */}
						<div className={cn("flex", gap)}>
							{grid.map((week) => (
								<div key={week.key} className={cn("fcol", gap)}>
									{week.days.map((day, di) => {
										if (!day) {
											return (
												<div
													key={`empty-${week.key}-${di}`}
													className={cn(
														"rounded-none border border-border/10",
														cellW,
														cellH,
													)}
												/>
											);
										}
										const style = STATUS_STYLE[day.status];
										return (
											<div
												key={day.date}
												className={cn(
													"rounded-none border transition-colors",
													cellW,
													cellH,
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
									"h-3 w-5 rounded-none border",
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
