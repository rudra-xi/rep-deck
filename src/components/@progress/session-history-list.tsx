"use client";

import Link from "next/link";
import {
	ClockCounterClockwiseIcon,
	CalendarDotsIcon,
	CaretRightIcon,
} from "@phosphor-icons/react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useSessionHistory } from "@/hooks";

const sessionChartConfig = {
	volume: { label: "Volume (kg)", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface SessionHistoryListProps {
	initialData?: any[];
	loading?: boolean;
}

export function SessionHistoryList({
	initialData = [],
	loading: propLoading = false,
}: SessionHistoryListProps) {
	const { sessions, chartData, loading, hasData, navigateToSession } =
		useSessionHistory(initialData, propLoading);

	// Loading State
	if (loading) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
			>
				<CardHeader className="space-y-0 pb-3 flex fcb">
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<ClockCounterClockwiseIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						Recent Session Volume
					</CardTitle>
					<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
						<CalendarDotsIcon className="size-4" weight="bold" />
					</div>
				</CardHeader>
				<CardContent className="space-y-4 pt-0">
					<div className="flex flex-col items-center justify-center py-6 space-y-2">
						<Spinner className="size-6" />
						<p className="text-xs text-muted-foreground">
							Loading session history...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Empty State
	if (!hasData) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[220px]"
			>
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<CalendarDotsIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Sessions Yet
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
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

	// Data State
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<ClockCounterClockwiseIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					Recent Session Volume
				</CardTitle>

				<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
					<CalendarDotsIcon className="size-4" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-4 pt-0">
				<ChartContainer
					config={sessionChartConfig}
					className="h-[140px] w-full border-b border-border/30 pb-2"
				>
					<BarChart
						accessibilityLayer
						data={chartData.slice(0, 6).reverse()}
						layout="vertical"
						margin={{
							left: -10,
							right: 12,
							top: 4,
							bottom: 4,
						}}
					>
						<CartesianGrid
							horizontal={false}
							strokeDasharray="3 3"
						/>
						<XAxis
							type="number"
							fontSize={10}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							type="category"
							dataKey="date"
							fontSize={10}
							tickLine={false}
							axisLine={false}
							width={48}
						/>
						<ChartTooltip
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Bar
							dataKey="volume"
							fill="var(--color-volume)"
							radius={[0, 2, 2, 0]}
							barSize={12}
							isAnimationActive={true}
							animationDuration={800}
							animationEasing="ease-in-out"
						/>
					</BarChart>
				</ChartContainer>

				<div className="divide-y divide-border/30">
					{sessions.map((session) => (
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
							className="py-2.5 flex items-center justify-between hover:bg-background/40 transition-colors cursor-pointer px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							<div className="space-y-0.5">
								<div className="flex items-center gap-2">
									<span className="text-xs font-bold text-foreground">
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

							<div className="flex items-center gap-3">
								<span className="text-xs font-semibold text-foreground hidden sm:inline">
									{session.totalVolume}
								</span>
								<CaretRightIcon className="size-4 text-muted-foreground" />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
