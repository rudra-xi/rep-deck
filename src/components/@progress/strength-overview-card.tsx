"use client";

import { NumberSquareOneIcon, TrendUpIcon } from "@phosphor-icons/react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
import { STRENGTH_TREND_DATA } from "@/constants/mock-data";

interface StrengthOverviewCardProps {
	timeRange: "2M" | "3M" | "6M" | "1Y";
	onTimeRangeChange: (range: "2M" | "3M" | "6M" | "1Y") => void;
}

const strengthChartConfig = {
	bench: { label: "Bench", color: "var(--chart-1)" },
	squat: { label: "Squat", color: "var(--chart-2)" },
	deadlift: { label: "Deadlift", color: "var(--chart-3)" },
	ohp: { label: "OHP", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function StrengthOverviewCard({
	timeRange,
	onTimeRangeChange,
}: StrengthOverviewCardProps) {
	const ranges: Array<"2M" | "3M" | "6M" | "1Y"> = ["2M", "3M", "6M", "1Y"];

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<NumberSquareOneIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					Combined 1RM Progression (kg)
				</CardTitle>

				<div className="flex items-center gap-2">
					<div className="flex border border-border/50 p-0.5 bg-background">
						{ranges.map((r) => (
							<Button
								key={r}
								size="sm"
								variant={timeRange === r ? "default" : "ghost"}
								onClick={() => onTimeRangeChange(r)}
								className="h-5 px-1.5 text-[10px] rounded-none"
							>
								{r}
							</Button>
						))}
					</div>
					<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<TrendUpIcon className="size-3.5" weight="bold" />
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-2 pt-0">
				<ChartContainer
					config={strengthChartConfig}
					className="h-[180px] sm:h-[210px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={STRENGTH_TREND_DATA}
						margin={{ left: 0, right: 8, top: 4, bottom: 4 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={4}
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
							content={<ChartTooltipContent indicator="dot" />}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Line
							dataKey="bench"
							stroke="var(--color-bench)"
							strokeWidth={2}
							dot={{ r: 2 }}
						/>
						<Line
							dataKey="squat"
							stroke="var(--color-squat)"
							strokeWidth={2}
							dot={{ r: 2 }}
						/>
						<Line
							dataKey="deadlift"
							stroke="var(--color-deadlift)"
							strokeWidth={2}
							dot={{ r: 2 }}
						/>
						<Line
							dataKey="ohp"
							stroke="var(--color-ohp)"
							strokeWidth={2}
							dot={{ r: 2 }}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
