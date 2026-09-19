// biome-ignore-all lint/a11y/useSemanticElements: interactive row wraps multi-element content; <button> would produce invalid HTML
"use client";

import {
	CalendarDotsIcon,
	CaretRightIcon,
	ClockCounterClockwiseIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { CardsHeader, useUnits } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useSessionHistory } from "@/hooks";
import { SessionHistoryListSkeleton } from "@/skeletons";
import type { SessionHistoryItem } from "@/types/progress";

interface SessionHistoryListProps {
	initialData?: SessionHistoryItem[];
	loading?: boolean;
}

export function SessionHistoryList({
	initialData = [],
	loading: propLoading = false,
}: SessionHistoryListProps) {
	const { weightUnit, fmtWeight } = useUnits();

	const { sessions, chartData, loading, hasData, navigateToSession } =
		useSessionHistory(initialData, propLoading);

	const sessionChartConfig = {
		volume: { label: "Volume", color: "var(--chart-1)" },
		label: { color: "var(--primary-foreground)" },
	} satisfies ChartConfig;

	if (loading) return <SessionHistoryListSkeleton rows={4} />;

	if (!hasData) {
		return (
			<Card size="sm" className="fcard-flat min-h-[220px]">
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<CalendarDotsIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Sessions Yet
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
							Complete your first workout to see your session
							history and volume tracking.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							nativeButton={false}
							variant="outline"
							size="sm"
							className="text-xs mt-1"
							render={
								<Link href="/workouts/new">Log Workout</Link>
							}
						/>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	// Last 6 sessions, oldest → newest for left-to-right reading
	const recentBars = chartData.slice(0, 6).reverse();

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={ClockCounterClockwiseIcon}
				title="Recent Session Volume"
			/>

			<CardContent className="p-4 pt-1 fcol4">
				{/* Horizontal bar chart — date inside bar, volume + unit outside right */}
				<ChartContainer
					config={sessionChartConfig}
					className="h-[140px] w-full border-b border-border/30 pb-2"
				>
					<BarChart
						accessibilityLayer
						data={recentBars}
						layout="vertical"
						margin={{ right: 60, top: 6, bottom: 6 }}
					>
						{/* Both axes hidden — labels live inside/outside the bars */}
						<XAxis type="number" dataKey="volume" hide />
						<YAxis
							type="category"
							dataKey="date"
							tickLine={false}
							axisLine={false}
							hide
						/>

						<Bar
							dataKey="volume"
							fill="var(--color-volume)"
							radius={0}
							isAnimationActive={true}
							animationDuration={800}
							animationEasing="ease-out"
						>
							{/* Date label — inside the bar, left-aligned */}
							<LabelList
								dataKey="date"
								position="insideLeft"
								offset={8}
								className="fill-(--color-label)"
								fontSize={10}
							/>

							{/* Volume value + unit — outside the bar, right-aligned */}
							<LabelList
								dataKey="volume"
								position="right"
								offset={8}
								className="fill-foreground"
								fontSize={10}
								formatter={(value: number) =>
									`${Number(value).toLocaleString()} ${weightUnit}`
								}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>

				{/* Session list */}
				<div className="divide-y divide-border/30">
					{sessions.map((session) => {
						const hasVolume =
							typeof session.totalVolumeKg === "number" &&
							!Number.isNaN(session.totalVolumeKg);

						return (
							<div
								key={session.id}
								tabIndex={0}
								role="button"
								onClick={() => navigateToSession(session.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										navigateToSession(session.id);
									}
								}}
								className="py-2.5 fcb hover:bg-background/40 transition-colors cursor-pointer px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<div className="space-y-0.5 min-w-0">
									<div className="fcy gap-2">
										<span className="text-xs font-bold text-foreground sh0">
											{session.date}
										</span>
										<span className="text-[10px] font-semibold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 ">
											{session.programName} –{" "}
											{session.dayLabel}
										</span>
									</div>
									<p className="text-[11px] text-muted-foreground ">
										{session.keyLiftsSummary}
									</p>
								</div>

								<div className="fcy gap-3 sh0">
									<span className="text-xs font-semibold text-foreground hidden sm:inline tabular-nums">
										{hasVolume
											? `${fmtWeight(session.totalVolumeKg).toLocaleString()} ${weightUnit}`
											: "—"}
									</span>
									<CaretRightIcon className="size-4 text-muted-foreground" />
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
