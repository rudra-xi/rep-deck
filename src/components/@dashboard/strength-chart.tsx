"use client";

import { TrendUpIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { CardsHeader, useUnits } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
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
import { useStrengthChart } from "@/hooks";
import { ChartCardSkeleton } from "@/skeletons";

export interface StrengthTrendDataPoint {
	date: string;
	squat?: number;
	bench?: number;
	deadlift?: number;
	ohp?: number;
}

const chartConfig = {
	squat: { label: "Squat", color: "var(--chart-1)" },
	bench: { label: "Bench", color: "var(--chart-2)" },
	deadlift: { label: "Deadlift", color: "var(--chart-3)" },
	ohp: { label: "OHP", color: "var(--chart-4)" },
} satisfies ChartConfig;

interface StrengthChartProps {
	data?: StrengthTrendDataPoint[];
	loading?: boolean;
}

export function StrengthChart({
	data = [],
	loading = false,
}: StrengthChartProps) {
	const { weightUnit, fmtWeight } = useUnits();
	const { activeLifts, toggleLift, hasData } = useStrengthChart(data);

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
				height="h-55 lg:h-70"
				hasToggleRow
				toggleCount={4}
				titleWidth="w-24"
			/>
		);
	}

	const liftToggles = (
		<div className="fg1 fwrap w-full justify-end">
			{Object.entries(chartConfig).map(([key, config]) => {
				const isActive = activeLifts[key as keyof typeof activeLifts];
				return (
					<Button
						key={key}
						variant="ghost"
						size="sm"
						onClick={() => toggleLift(key)}
						className={`h-7 px-2 text-xs rounded-none transition-colors fgrow sm:flex-initial ${
							isActive
								? "border border-primary bg-primary/10 text-accent-foreground font-medium"
								: "bg-transparent fmuted hover:text-foreground border border-border"
						}`}
					>
						<span
							className="mr-1.5 size-2 sh0 rounded-full"
							style={{ backgroundColor: config.color }}
						/>
						{config.label}
					</Button>
				);
			})}
		</div>
	);

	if (!hasData) {
		return (
			<Card
				size="sm"
				className="fcard-flat relative min-h-[300px] w-full"
			>
				<Empty className="p-8 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<TrendUpIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Strength Data Yet
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
							Log workouts with Squat, Bench Press, Deadlift, or
							Overhead Press to see your estimated 1RM progression
							over time.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							nativeButton={false}
							variant="outline"
							size="sm"
							className="text-xs mt-1 rounded-none"
							render={
								<Link href="/workout-log">
									Log Your First Workout
								</Link>
							}
						/>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	return (
		<Card size="sm" className="fcard-flat w-full card-ease">
			<CardsHeader icon={TrendUpIcon} title="Estimated ORM" />

			<CardContent className="p-4 pt-1 fcol3">
				{liftToggles}

				<ChartContainer
					config={chartConfig}
					className="h-55 lg:h-70 w-full"
				>
					<LineChart
						accessibilityLayer
						data={convertedData}
						margin={{
							top: 10,
							right: 10,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							opacity={0.4}
						/>
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							fontSize={10}
							interval="preserveStartEnd"
						/>
						<YAxis
							fontSize={10}
							tickLine={false}
							axisLine={false}
							unit={weightUnit}
							width={38}
							tickMargin={4}
							domain={["auto", "auto"]}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>

						{activeLifts.squat && (
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
						)}
						{activeLifts.bench && (
							<Line
								type="monotone"
								dataKey="bench"
								stroke="var(--color-bench)"
								strokeWidth={2}
								dot={{ r: 3 }}
								connectNulls
								isAnimationActive={true}
								animationDuration={1000}
							/>
						)}
						{activeLifts.deadlift && (
							<Line
								type="monotone"
								dataKey="deadlift"
								stroke="var(--color-deadlift)"
								strokeWidth={2}
								dot={{ r: 3 }}
								connectNulls
								isAnimationActive={true}
								animationDuration={1300}
							/>
						)}
						{activeLifts.ohp && (
							<Line
								type="monotone"
								dataKey="ohp"
								stroke="var(--color-ohp)"
								strokeWidth={2}
								dot={{ r: 3 }}
								connectNulls
								isAnimationActive={true}
								animationDuration={1500}
							/>
						)}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
