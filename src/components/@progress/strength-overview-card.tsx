"use client";

import { GaugeIcon, TrendUpIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { CardsHeader, useUnits } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useStrengthOverview } from "@/hooks";
import { ChartCardSkeleton } from "@/skeletons";
import type { StrengthOverviewPoint } from "@/types/progress";
import { type ViewMode, ViewToggle } from "../@common/view-toggle";

type TimeRange = "2M" | "3M" | "6M" | "1Y";

interface StrengthOverviewCardProps {
	timeRange: TimeRange;
	onTimeRangeChange: (range: TimeRange) => void;
	initialData?: StrengthOverviewPoint[];
	loading?: boolean;
}

export function StrengthOverviewCard({
	timeRange,
	onTimeRangeChange,
	initialData = [],
	loading: propLoading = false,
}: StrengthOverviewCardProps) {
	const { weightUnit, fmtWeight } = useUnits();
	const [view, setView] = useState<ViewMode>("chart");

	const { data, loading, isFetching, hasData, timeRanges } =
		useStrengthOverview(initialData, propLoading, timeRange);

	const strengthChartConfig = useMemo<ChartConfig>(
		() => ({
			squat: {
				label: `Squat (${weightUnit})`,
				color: "var(--chart-1)",
			},
			bench: {
				label: `Bench (${weightUnit})`,
				color: "var(--chart-2)",
			},
			deadlift: {
				label: `Deadlift (${weightUnit})`,
				color: "var(--chart-3)",
			},
			ohp: {
				label: `OHP (${weightUnit})`,
				color: "var(--chart-4)",
			},
		}),
		[weightUnit],
	);

	const convertedData = useMemo(
		() =>
			data.map((d) => ({
				...d,
				squat:
					typeof d.squat === "number" ? fmtWeight(d.squat) : d.squat,
				bench:
					typeof d.bench === "number" ? fmtWeight(d.bench) : d.bench,
				deadlift:
					typeof d.deadlift === "number"
						? fmtWeight(d.deadlift)
						: d.deadlift,
				ohp: typeof d.ohp === "number" ? fmtWeight(d.ohp) : d.ohp,
			})),
		[data, fmtWeight],
	);

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

	const controls = (
		<div className="fri gap-2 pb-2">
			<ViewToggle view={view} onChange={setView} />
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
		</div>
	);

	if (!hasData && !isFetching) {
		return (
			<Card size="sm" className="fcard-flat min-h-70 card-ease">
				<CardsHeader icon={GaugeIcon} title="Strength Trend" />
				<CardContent className="p-4 pt-1 fcol3">
					{controls}
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
								Log workouts with Squat, Bench Press, Deadlift,
								or Overhead Press to see your top-set
								progression over time.
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
				</CardContent>
			</Card>
		);
	}

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={GaugeIcon}
				title={
					<span>
						Strength Trend
						{isFetching && (
							<Spinner className="size-3 text-muted-foreground ml-1" />
						)}
					</span>
				}
			/>

			<CardContent className="p-4 pt-1">
				{controls}
				{view === "chart" ? (
					<ChartContainer
						config={strengthChartConfig}
						className="h-50 sm:h-55 w-full"
					>
						<LineChart
							accessibilityLayer
							data={convertedData}
							margin={{ left: 12, right: 8, top: 8, bottom: 4 }}
						>
							<CartesianGrid
								vertical={false}
								strokeDasharray="3 3"
							/>
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={6}
								fontSize={10}
								tickFormatter={(value: string) =>
									new Date(value).toLocaleDateString(
										"en-US",
										{
											month: "short",
											day: "numeric",
										},
									)
								}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={4}
								unit={weightUnit}
								domain={["auto", "auto"]}
								fontSize={10}
								width={32}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										indicator="line"
										labelFormatter={(value) =>
											new Date(
												value as string,
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})
										}
									/>
								}
							/>
							<ChartLegend content={<ChartLegendContent />} />

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
				) : (
					<div className="max-h-70 overflow-y-auto border border-border/40">
						<Table>
							<TableHeader>
								<TableRow className="border-border/60 hover:bg-transparent">
									<TableHead className="ftext-3xs fupper fmuted font-semibold">
										Date
									</TableHead>
									<TableHead className="ftext-3xs fupper fmuted font-semibold text-right">
										Squat
									</TableHead>
									<TableHead className="ftext-3xs fupper fmuted font-semibold text-right">
										Bench
									</TableHead>
									<TableHead className="ftext-3xs fupper fmuted font-semibold text-right">
										Deadlift
									</TableHead>
									<TableHead className="ftext-3xs fupper fmuted font-semibold text-right">
										OHP
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[...convertedData].reverse().map((row) => (
									<TableRow
										key={row.date}
										className="border-border/40 hover:bg-muted/40"
									>
										<TableCell className="text-xs font-medium text-foreground">
											{row.date}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums font-semibold text-foreground">
											{typeof row.squat === "number"
												? `${row.squat}`
												: "—"}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums font-semibold text-foreground">
											{typeof row.bench === "number"
												? `${row.bench}`
												: "—"}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums font-semibold text-foreground">
											{typeof row.deadlift === "number"
												? `${row.deadlift}`
												: "—"}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums font-semibold text-foreground">
											{typeof row.ohp === "number"
												? `${row.ohp}`
												: "—"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
