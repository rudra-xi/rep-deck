"use client";

import Link from "next/link";
import { NumberSquareOneIcon, TrendUpIcon } from "@phosphor-icons/react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
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
	squat: {
		label: "Squat",
		color: "var(--chart-1)",
	},
	bench: {
		label: "Bench Press",
		color: "var(--chart-2)",
	},
	deadlift: {
		label: "Deadlift",
		color: "var(--chart-3)",
	},
	ohp: {
		label: "OHP",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

interface StrengthChartProps {
	data?: StrengthTrendDataPoint[];
	loading?: boolean;
}

export function StrengthChart({
	data = [],
	loading = false,
}: StrengthChartProps) {
	const { activeLifts, toggleLift, hasData } = useStrengthChart(data);

	// 1. Loading State
	if (loading) {
  return <ChartCardSkeleton height="h-55 lg:h-70" hasToggleRow toggleCount={4} titleWidth="w-24" />;
	}

	// 2. Empty Data State
	if (!hasData) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[300px] w-full"
			>
				<Empty className="p-8 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<TrendUpIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Strength Data Yet
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
							Log workouts with Squat, Bench Press, Deadlift, or
							Overhead Press to see your estimated 1RM progression
							over time.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<div className="flex flex-wrap gap-2 mt-1">
							<Button
								nativeButton={false}
								variant="outline"
								size="sm"
								className="text-xs rounded-none"
								render={
									<Link href="/workouts/new">
										Log Your First Workout
									</Link>
								}
							/>
						</div>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	// 3. Render Strength Chart
	return (
		<Card
			size="sm"
			className="w-full border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="p-4 lg:p-5 flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
				<div className="flex items-center gap-2">
					<NumberSquareOneIcon
						size={16}
						weight="bold"
						className="text-primary shrink-0"
					/>
					<CardDescription className="text-[11px] sm:text-xs text-foreground font-medium">
						Estimated 1RM.
					</CardDescription>
				</div>

				<div className="flex flex-wrap gap-1 w-full lg:w-auto">
					{Object.entries(chartConfig).map(([key, config]) => {
						const isActive =
							activeLifts[key as keyof typeof activeLifts];
						return (
							<Button
								key={key}
								variant="ghost"
								size="sm"
								onClick={() => toggleLift(key)}
								className={`h-6 lg:h-7 px-2 text-xs rounded-none transition-colors flex-1 lg:flex-initial ${
									isActive
										? "bg-accent text-accent-foreground font-medium"
										: "bg-transparent text-muted-foreground hover:text-foreground"
								}`}
							>
								<span
									className="mr-1.5 h-1.5 w-1.5 lg:h-2 lg:w-2 shrink-0 rounded-full"
									style={{ backgroundColor: config.color }}
								/>
								{config.label}
							</Button>
						);
					})}
				</div>
			</CardHeader>

			<CardContent className="px-2 pb-4 lg:px-5 lg:pb-5">
				<ChartContainer
					config={chartConfig}
					className="h-55 lg:h-70 w-full"
				>
					<LineChart
						accessibilityLayer
						data={data}
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
							unit="kg"
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
