"use client";

import Link from "next/link";
import {
	NumberSquareOneIcon,
	TrendUpIcon,
	TrophyIcon,
	StarIcon,
	CircleIcon,
} from "@phosphor-icons/react";
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
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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

export interface StrengthTrendDataPoint {
	date: string;
	squat?: number;
	bench?: number;
	deadlift?: number;
	ohp?: number;
	prs?: {
		squat?: boolean;
		bench?: boolean;
		deadlift?: boolean;
		ohp?: boolean;
	};
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

// Custom dot renderer with Phosphor icons
const renderDot = (props: any, isPR: boolean, color: string) => {
	const { cx, cy } = props;

	if (isPR) {
		return (
			<StarIcon
				key={`star-${cx}-${cy}`}
				x={cx - 6}
				y={cy - 6}
				width={14}
				height={14}
				weight="fill"
				className="text-primary"
				style={{
					position: "absolute",
					filter: "drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))",
				}}
			/>
		);
	}

	return (
		<CircleIcon
			key={`circle-${cx}-${cy}`}
			x={cx - 4}
			y={cy - 4}
			width={8}
			height={8}
			weight="fill"
			style={{ color }}
		/>
	);
};

export function StrengthChart({
	data = [],
	loading = false,
}: StrengthChartProps) {
	const { activeLifts, toggleLift, prCount, prData, hasData } =
		useStrengthChart(data);

	// 1. Loading State
	if (loading) {
		return (
			<Card size="sm" className="w-full border-secondary/50 bg-card/50">
				<CardHeader className="p-4 lg:p-6 flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center w-full">
					<div className="flex items-center gap-2">
						<NumberSquareOneIcon
							size={16}
							weight="bold"
							className="text-primary sh0"
						/>
						<CardDescription className="text-[11px] sm:text-xs text-muted-foreground">
							Estimated 1RM.
						</CardDescription>
					</div>
					<div className="flex flex-wrap gap-1 w-full lg:w-auto">
						{Object.entries(chartConfig).map(([key, config]) => (
							<Button
								key={key}
								variant="ghost"
								size="sm"
								disabled
								className="h-6 lg:h-7 px-2 text-xs flex-1 lg:flex-initial bg-transparent"
							>
								<span
									className="mr-1.5 h-1.5 w-1.5 lg:h-2 lg:w-2 shrink-0"
									style={{ backgroundColor: config.color }}
								/>
								{config.label}
							</Button>
						))}
					</div>
				</CardHeader>
				<CardContent className="px-2 pb-4 lg:px-6 lg:pb-6 w-full">
					<div className="h-55 lg:h-70 w-full border border-dashed border-border/60 rounded-lg flex flex-col items-center justify-center p-6 text-center space-y-2">
						<Spinner className="size-8" />
						<p className="text-xs font-medium">
							Loading strength data...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// 2. Empty Data State with shadcn Empty
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
								className="text-xs"
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

	// 3. Render Chart Data with PRs
	return (
		<Card size="sm" className="w-full border-secondary/50 bg-card/50">
			<CardHeader className="p-4 lg:p-6 flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
				<div className="flex flex-wrap items-center gap-2">
					<NumberSquareOneIcon
						size={16}
						weight="bold"
						className="text-primary sh0"
					/>
					<CardDescription className="text-[11px] sm:text-xs text-neutral-400">
						Estimated 1RM.
					</CardDescription>
					{prCount > 0 && (
						<Popover>
							<PopoverTrigger
								nativeButton={false}
								render={
									<Badge
										variant="outline"
										className="h-5 px-1.5 text-[9px] font-bold uppercase tracking-wider active:bg-primary/30 hover:bg-accent cursor-pointer"
									>
										<TrophyIcon
											className="size-3 mr-0.5"
											weight="duotone"
										/>
										{prCount} PR{prCount > 1 ? "s" : ""}
									</Badge>
								}
							/>
							<PopoverContent className="w-auto p-2 text-xs max-h-48 overflow-y-auto">
								<div className="space-y-1">
									<p className="font-semibold">
										PR Achievements
									</p>
									{prData.length > 0 ? (
										<ul className="list-disc list-inside text-muted-foreground">
											{prData.map((point, idx) => (
												<li key={idx}>
													<strong className="text-foreground">
														{point.date}:
													</strong>{" "}
													{Object.entries(
														point.prs || {},
													)
														.filter(
															([, isPR]) => isPR,
														)
														.map(([lift]) => {
															const value =
																point[
																	lift as keyof StrengthTrendDataPoint
																];
															return `${chartConfig[lift as keyof typeof chartConfig]?.label || lift}: ${value}kg`;
														})
														.join(", ")}
												</li>
											))}
										</ul>
									) : (
										<p className="text-muted-foreground">
											No PRs recorded
										</p>
									)}
								</div>
							</PopoverContent>
						</Popover>
					)}
				</div>

				<div className="flex flex-wrap gap-1 w-full lg:w-auto">
					{Object.entries(chartConfig).map(([key, config]) => {
						const isActive = activeLifts[key];
						return (
							<Button
								key={key}
								variant="ghost"
								size="sm"
								onClick={() => toggleLift(key)}
								className={`h-6 lg:h-7 px-2 text-xs transition-colors flex-1 lg:flex-initial ${
									isActive
										? "bg-accent text-secondary-foreground"
										: "bg-transparent text-muted-foreground hover:text-secondary-foreground"
								}`}
							>
								<span
									className="mr-1.5 h-1.5 w-1.5 lg:h-2 lg:w-2 shrink-0"
									style={{ backgroundColor: config.color }}
								/>
								{config.label}
							</Button>
						);
					})}
					
				</div>
			</CardHeader>

			<CardContent className="px-2 pb-4 lg:px-6 lg:pb-6">
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
							stroke="#262626"
							strokeDasharray="3 3"
						/>
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							stroke="#a3a3a3"
							fontSize={10}
							interval="preserveStartEnd"
						/>
						<YAxis
							stroke="#a3a3a3"
							fontSize={10}
							tickLine={false}
							axisLine={false}
							unit="kg"
							width={38}
							tickMargin={4}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>

						{activeLifts.squat && (
							<Line
								dataKey="squat"
								type="monotone"
								stroke="var(--color-squat)"
								strokeWidth={2}
								connectNulls={true}
								dot={(props) => {
									const { payload } = props;
									const isPR = payload?.prs?.squat;
									const color = "var(--color-squat)";

									if (isPR) {
										return (
											<StarIcon
												key={`squat-${props.cx}-${props.cy}`}
												size={14}
												weight="duotone"
												className="text-primary"
												style={{
													position: "absolute",
													transform: `translate(${props.cx - 7}px, ${props.cy - 7}px)`,
													filter: "drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))",
												}}
											/>
										);
									}

									return (
										<CircleIcon
											key={`squat-${props.cx}-${props.cy}`}
											size={8}
											weight="fill"
											style={{
												position: "absolute",
												transform: `translate(${props.cx - 4}px, ${props.cy - 4}px)`,
												color: color,
											}}
										/>
									);
								}}
								activeDot={{ r: 4 }}
							/>
						)}
						{activeLifts.bench && (
							<Line
								dataKey="bench"
								type="monotone"
								stroke="var(--color-bench)"
								strokeWidth={2}
								connectNulls={true}
								dot={(props) => {
									const { payload } = props;
									const isPR = payload?.prs?.bench;
									const color = "var(--color-bench)";

									if (isPR) {
										return (
											<StarIcon
												key={`bench-${props.cx}-${props.cy}`}
												size={14}
												weight="duotone"
												className="text-primary"
												style={{
													position: "absolute",
													transform: `translate(${props.cx - 7}px, ${props.cy - 7}px)`,
													filter: "drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))",
												}}
											/>
										);
									}

									return (
										<CircleIcon
											key={`bench-${props.cx}-${props.cy}`}
											size={8}
											weight="fill"
											style={{
												position: "absolute",
												transform: `translate(${props.cx - 4}px, ${props.cy - 4}px)`,
												color: color,
											}}
										/>
									);
								}}
								activeDot={{ r: 4 }}
							/>
						)}
						{activeLifts.deadlift && (
							<Line
								dataKey="deadlift"
								type="monotone"
								stroke="var(--color-deadlift)"
								strokeWidth={2}
								connectNulls={true}
								dot={(props) => {
									const { payload } = props;
									const isPR = payload?.prs?.deadlift;
									const color = "var(--color-deadlift)";

									if (isPR) {
										return (
											<StarIcon
												key={`deadlift-${props.cx}-${props.cy}`}
												size={14}
												weight="duotone"
												className="text-primary"
												style={{
													position: "absolute",
													transform: `translate(${props.cx - 7}px, ${props.cy - 7}px)`,
													filter: "drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))",
												}}
											/>
										);
									}

									return (
										<CircleIcon
											key={`deadlift-${props.cx}-${props.cy}`}
											size={8}
											weight="fill"
											style={{
												position: "absolute",
												transform: `translate(${props.cx - 4}px, ${props.cy - 4}px)`,
												color: color,
											}}
										/>
									);
								}}
								activeDot={{ r: 4 }}
							/>
						)}
						{activeLifts.ohp && (
							<Line
								dataKey="ohp"
								type="monotone"
								stroke="var(--color-ohp)"
								strokeWidth={2}
								connectNulls={true}
								dot={(props) => {
									const { payload } = props;
									const isPR = payload?.prs?.ohp;
									const color = "var(--color-ohp)";

									if (isPR) {
										return (
											<StarIcon
												key={`ohp-${props.cx}-${props.cy}`}
												size={14}
												weight="duotone"
												className="text-primary"
												style={{
													position: "absolute",
													transform: `translate(${props.cx - 7}px, ${props.cy - 7}px)`,
													filter: "drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))",
												}}
											/>
										);
									}

									return (
										<CircleIcon
											key={`ohp-${props.cx}-${props.cy}`}
											size={8}
											weight="fill"
											style={{
												position: "absolute",
												transform: `translate(${props.cx - 4}px, ${props.cy - 4}px)`,
												color: color,
											}}
										/>
									);
								}}
								activeDot={{ r: 4 }}
							/>
						)}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
