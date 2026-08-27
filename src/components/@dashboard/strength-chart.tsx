"use client";

import { NumberSquareOneIcon } from "@phosphor-icons/react";
import { useState } from "react";
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
import type { StrengthTrendDataPoint } from "@/constants/mock-data";

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
	data: StrengthTrendDataPoint[];
}

export function StrengthChart({ data }: StrengthChartProps) {
	const [activeLifts, setActiveLifts] = useState<Record<string, boolean>>({
		squat: true,
		bench: true,
		deadlift: true,
		ohp: true,
	});

	const toggleLift = (key: string) => {
		setActiveLifts((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<Card
			size="sm"
			className="border-secondary/50 bg-card/50 lg:col-span-2"
		>
			<CardHeader className="p-4 lg:p-6 flex fct justify-between gap-3 lg:flex-row lg:items-center">
				<div className="fc gap-2">
					<NumberSquareOneIcon
						size={16}
						weight="bold"
						className="text-primary-foreground shrink-0"
					/>
					<CardDescription className="text-[11px] sm:text-xs text-neutral-400">
						Estimated 1RM [60d].
					</CardDescription>
				</div>

				<div className="fwrap gap-1 w-full lg:w-auto">
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
									className="mr-1.5 h-1.5 w-1.5 lg:h-2 lg:w-2 sh0"
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
								dot={{ r: 2 }}
								activeDot={{ r: 4 }}
							/>
						)}
						{activeLifts.bench && (
							<Line
								dataKey="bench"
								type="monotone"
								stroke="var(--color-bench)"
								strokeWidth={2}
								dot={{ r: 3 }}
								activeDot={{ r: 4 }}
							/>
						)}
						{activeLifts.deadlift && (
							<Line
								dataKey="deadlift"
								type="monotone"
								stroke="var(--color-deadlift)"
								strokeWidth={2}
								dot={{ r: 2 }}
								activeDot={{ r: 4 }}
							/>
						)}
						{activeLifts.ohp && (
							<Line
								dataKey="ohp"
								type="monotone"
								stroke="var(--color-ohp)"
								strokeWidth={2}
								dot={{ r: 2 }}
								activeDot={{ r: 4 }}
							/>
						)}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
