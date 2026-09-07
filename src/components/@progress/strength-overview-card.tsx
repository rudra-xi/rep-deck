"use client";

import Link from "next/link";
import { GaugeIcon, TrendUpIcon } from "@phosphor-icons/react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
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
import { useStrengthOverview } from "@/hooks";

const strengthChartConfig = {
	squat: { label: "Squat", color: "var(--chart-1)" },
	bench: { label: "Bench", color: "var(--chart-2)" },
	deadlift: { label: "Deadlift", color: "var(--chart-3)" },
	ohp: { label: "OHP", color: "var(--chart-4)" },
} satisfies ChartConfig;

type TimeRange = "2M" | "3M" | "6M" | "1Y";

interface StrengthOverviewCardProps {
	timeRange: TimeRange;
	onTimeRangeChange: (range: TimeRange) => void;
	initialData?: any[];
	loading?: boolean;
}

export function StrengthOverviewCard({
	timeRange,
	onTimeRangeChange,
	initialData = [],
	loading: propLoading = false,
}: StrengthOverviewCardProps) {
	const { data, loading, isFetching, hasData, timeRanges } =
		useStrengthOverview(initialData, propLoading, timeRange);

	// Loading State
	if (loading) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
			>
				<CardHeader className="space-y-0 pb-2 flex fcb">
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<GaugeIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						Big 4 Strength Trend
					</CardTitle>
					<div className="flex items-center gap-2">
						<div className="flex border border-border/50 p-0.5 bg-background">
							{timeRanges.map((range) => (
								<Button
									key={range}
									size="sm"
									variant={
										timeRange === range
											? "default"
											: "ghost"
									}
									className="h-5 px-1.5 text-[10px] rounded-none uppercase"
									disabled
								>
									{range}
								</Button>
							))}
						</div>
						<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
							<TrendUpIcon className="size-3.5" weight="bold" />
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-0 space-y-3">
					<div className="flex flex-col items-center justify-center py-6 space-y-2">
						<Spinner className="size-6" />
						<p className="text-xs text-muted-foreground">
							Loading strength data...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Empty State
	if (!hasData && !isFetching) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[280px]"
			>
				<CardHeader className="space-y-0 pb-2 flex fcb">
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<GaugeIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						Big 4 Strength Trend
					</CardTitle>
					<div className="flex items-center gap-2">
						<div className="flex border border-border/50 p-0.5 bg-background">
							{timeRanges.map((range) => (
								<Button
									key={range}
									size="sm"
									variant={
										timeRange === range
											? "default"
											: "ghost"
									}
									onClick={() => onTimeRangeChange(range)}
									className="h-5 px-1.5 text-[10px] rounded-none uppercase"
								>
									{range}
								</Button>
							))}
						</div>
					</div>
				</CardHeader>
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<TrendUpIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Strength Data
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
							Log workouts with Squat, Bench Press, Deadlift, or
							Overhead Press to see your strength progression over
							time.
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

	// Main Chart View
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<GaugeIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					Big 4 Strength Trend
					{isFetching && (
						<Spinner className="size-3 text-muted-foreground ml-1" />
					)}
				</CardTitle>

				<div className="flex items-center gap-2">
					<div className="flex border border-border/50 p-0.5 bg-background">
						{timeRanges.map((range) => (
							<Button
								key={range}
								size="sm"
								variant={
									timeRange === range ? "default" : "ghost"
								}
								onClick={() => onTimeRangeChange(range)}
								className="h-5 px-1.5 text-[10px] rounded-none uppercase"
							>
								{range}
							</Button>
						))}
					</div>
					<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<TrendUpIcon className="size-3.5" weight="bold" />
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-0 space-y-3">
				<ChartContainer
					config={strengthChartConfig}
					className="h-[200px] sm:h-[220px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={data}
						margin={{ left: 0, right: 8, top: 8, bottom: 4 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={6}
							fontSize={10}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={4}
							domain={["auto", "auto"]}
							fontSize={10}
							width={28}
						/>
						<ChartTooltip
							content={<ChartTooltipContent indicator="line" />}
						/>
						<ChartLegend content={<ChartLegendContent />} />

						<ReferenceLine
							y={100}
							stroke="var(--muted-foreground)"
							strokeDasharray="2 2"
							strokeOpacity={0.4}
						/>

						<Line
							type="monotone"
							dataKey="squat"
							stroke="var(--color-squat)"
							strokeWidth={2}
							dot={{ r: 3 }}
							connectNulls
							isAnimationActive={true}
							animationDuration={900}
						/>
						<Line
							type="monotone"
							dataKey="bench"
							stroke="var(--color-bench)"
							strokeWidth={2}
							dot={{ r: 3 }}
							connectNulls
							isAnimationActive={true}
							animationDuration={700}
						/>
						<Line
							type="monotone"
							dataKey="deadlift"
							stroke="var(--color-deadlift)"
							strokeWidth={2}
							dot={{ r: 3 }}
							connectNulls
							isAnimationActive={true}
							animationDuration={800}
						/>
						<Line
							type="monotone"
							dataKey="ohp"
							stroke="var(--color-ohp)"
							strokeWidth={2}
							dot={{ r: 3 }}
							connectNulls
							isAnimationActive={true}
							animationDuration={1000}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
