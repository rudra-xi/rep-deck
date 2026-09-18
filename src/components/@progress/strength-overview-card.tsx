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
import { Card, CardContent } from "@/components/ui/card";
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
import { ChartCardSkeleton } from "@/skeletons";
import { CardsHeader, useUnits } from "@/common";

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
	const { weightUnit } = useUnits();

	const { data, loading, isFetching, hasData, timeRanges } =
		useStrengthOverview(initialData, propLoading, timeRange);

	if (loading) {
		return (
			<ChartCardSkeleton
				height="h-[200px] sm:h-[220px]"
				hasToggleRow
				toggleCount={4}
				titleWidth="w-40"
			/>
		);
	}

	// Time range toggle bar
	const rangeToggle = (
		<div className="flex border border-border/50 p-0.5 bg-background">
			{timeRanges.map((range) => (
				<Button
					key={range}
					size="sm"
					variant={timeRange === range ? "default" : "ghost"}
					onClick={() => onTimeRangeChange(range)}
					className="h-5 px-1.5 text-[10px] rounded-none uppercase"
				>
					{range}
				</Button>
			))}
		</div>
	);

	if (!hasData && !isFetching) {
		return (
			<Card size="sm" className="fcard-flat min-h-[280px]">
				<CardsHeader
					icon={GaugeIcon}
					title="Big 4 Strength Trend"
					trailing={rangeToggle}
				/>
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<TrendUpIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Strength Data
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
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

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={GaugeIcon}
				title={
					<span>
						Big 4 Strength Trend
						{isFetching && (
							<Spinner className="size-3 text-muted-foreground ml-1" />
						)}
					</span>
				}
				trailing={<span>{rangeToggle}</span>}
			/>

			<CardContent className="p-4 pt-1">
				<ChartContainer
					config={strengthChartConfig}
					className="h-[200px] sm:h-[220px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={data}
						margin={{ left: 12, right: 8, top: 8, bottom: 4 }}
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
							unit={weightUnit}
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
