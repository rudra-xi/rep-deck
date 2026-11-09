"use client";

import {
	CalendarDotsIcon,
	CaretRightIcon,
	ClockCounterClockwiseIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo } from "react";
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

	// ✅ Remove `chartData` from destructure — we build our own
	const { sessions, loading, hasData, navigateToSession } = useSessionHistory(
		initialData,
		propLoading,
	);

	const sessionChartConfig = {
		volume: { label: "Volume", color: "var(--chart-1)" },
		label: { color: "var(--primary-foreground)" },
	} satisfies ChartConfig;

	const chartData = useMemo(() => {
		return sessions.map((s) => {
			const rawKg =
				typeof s.totalVolumeKg === "number" ? s.totalVolumeKg : 0;
			const reps = typeof s.totalReps === "number" ? s.totalReps : 0;
			const isBodyweightOnly = rawKg === 0 && reps > 0;

			const displayValue = isBodyweightOnly ? reps : fmtWeight(rawKg);
			const displayUnit = isBodyweightOnly ? "reps" : weightUnit;

			return {
				...s,
				volume: displayValue,
				volumeLabel: `${displayValue.toLocaleString()} ${displayUnit}`,
			};
		});
	}, [sessions, fmtWeight, weightUnit]);

	if (loading) return <SessionHistoryListSkeleton rows={4} />;

	if (!hasData) {
		return (
			<Card size="sm" className="fcard-flat min-h-55 card-ease">
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
								<Link href="/workout-log">Log Workout</Link>
							}
						/>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	// ✅ Now declared AFTER chartData
	const recentBars = chartData.slice(0, 6).reverse();

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={ClockCounterClockwiseIcon}
				title="Recent Session Volume"
			/>

			<CardContent className="p-4 pt-1 fcol4">
				<ChartContainer
					config={sessionChartConfig}
					className="h-35 w-full border-b border-border/30 pb-2"
				>
					<BarChart
						accessibilityLayer
						data={recentBars}
						layout="vertical"
						margin={{ right: 70, top: 6, bottom: 6 }}
					>
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
							<LabelList
								dataKey="date"
								position="insideLeft"
								offset={8}
								className="fill-(--color-label)"
								fontSize={10}
							/>

							<LabelList
								dataKey="volumeLabel"
								position="right"
								offset={8}
								className="fill-foreground"
								fontSize={10}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>

				<div className="divide-y divide-border/30">
					{sessions.map((session) => {
						const hasVolume = session.totalVolumeKg > 0;
						const hasReps = session.totalReps > 0;

						const volumeLabel = (() => {
							if (hasVolume && hasReps) {
								return `${fmtWeight(session.totalVolumeKg).toLocaleString()} ${weightUnit} · ${session.totalReps} reps`;
							}
							if (hasVolume) {
								return `${fmtWeight(session.totalVolumeKg).toLocaleString()} ${weightUnit}`;
							}
							if (hasReps) {
								return `${session.totalReps} reps`;
							}
							return "—";
						})();

						return (
						<button
							key={session.id}
							type="button"
							onClick={() => navigateToSession(session.id)}
							className="w-full text-left py-2.5 fcb hover:bg-background/40 transition-colors cursor-pointer px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
								<div className="space-y-0.5 min-w-0">
									<div className="fcy gap-2">
										<span className="text-xs font-bold text-foreground sh0">
											{session.date}
										</span>
										<span className="text-[10px] font-semibold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20">
											{session.programName} –{" "}
											{session.dayLabel}
										</span>
									</div>
									<p className="text-[11px] text-muted-foreground">
										{session.keyLiftsSummary}
									</p>
								</div>

								<div className="fcy gap-3 sh0">
									<span className="text-xs font-semibold text-foreground hidden sm:inline tabular-nums">
										{volumeLabel}
									</span>
									<CaretRightIcon className="size-4 text-muted-foreground" />
								</div>
							</button>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
