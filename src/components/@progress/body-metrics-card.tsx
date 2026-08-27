"use client";

import { HeartbeatIcon, PersonIcon } from "@phosphor-icons/react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { BODY_METRICS_DATA } from "@/constants/mock-data";

const weightConfig = {
	weight: { label: "Weight (kg)", color: "var(--chart-1)" },
} satisfies ChartConfig;

const fatConfig = {
	bodyFat: { label: "Body Fat (%)", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function BodyMetricsCard() {
	const initial = BODY_METRICS_DATA[0];
	const latest = BODY_METRICS_DATA[BODY_METRICS_DATA.length - 1];

	const weightDiff = (latest.weight - initial.weight).toFixed(1);
	const fatDiff = (latest.bodyFat - initial.bodyFat).toFixed(1);

	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<PersonIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					Body Composition
				</CardTitle>

				<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
					<HeartbeatIcon className="size-3.5" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-4 pt-0">
				<div className="p-2 border border-primary/30 bg-primary/5 text-xs flex items-center justify-between">
					<span className="text-muted-foreground text-[11px] font-medium">
						12-Wk Progress:
					</span>
					<span className="font-bold text-foreground text-xs">
						{weightDiff} kg ({fatDiff}% fat)
					</span>
				</div>

				{/* Single column container stacked vertically */}
				<div className="space-y-3">
					<div className="space-y-1">
						<span className="text-[10px] font-bold uppercase text-muted-foreground">
							Weight
						</span>
						<ChartContainer
							config={weightConfig}
							className="h-[120px] w-full"
						>
							<LineChart
								accessibilityLayer
								data={BODY_METRICS_DATA}
								margin={{
									left: 10,
									right: 10,
									top: 4,
									bottom: 4,
								}}
							>
								<CartesianGrid
									vertical={false}
									strokeDasharray="3 3"
								/>
								<XAxis
									dataKey="date"
									tickLine={false}
									axisLine={false}
									fontSize={10}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									domain={["auto", "auto"]}
									fontSize={10}
									width={28}
								/>
								<ChartTooltip
									content={
										<ChartTooltipContent indicator="dot" />
									}
								/>
								<Line
									dataKey="weight"
									stroke="var(--color-weight)"
									strokeWidth={2}
									dot={{ r: 2 }}
								/>
							</LineChart>
						</ChartContainer>
					</div>

					<div className="space-y-1">
						<span className="text-[10px] font-bold uppercase text-muted-foreground">
							Body Fat %
						</span>
						<ChartContainer
							config={fatConfig}
							className="h-[120px] w-full"
						>
							<LineChart
								accessibilityLayer
								data={BODY_METRICS_DATA}
								margin={{
									left: 10,
									right: 10,
									top: 4,
									bottom: 4,
								}}
							>
								<CartesianGrid
									vertical={false}
									strokeDasharray="3 3"
								/>
								<XAxis
									dataKey="date"
									tickLine={false}
									axisLine={false}
									fontSize={10}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									domain={["auto", "auto"]}
									fontSize={10}
									width={28}
								/>
								<ChartTooltip
									content={
										<ChartTooltipContent indicator="dot" />
									}
								/>
								<Line
									dataKey="bodyFat"
									stroke="var(--color-bodyFat)"
									strokeWidth={2}
									dot={{ r: 2 }}
								/>
							</LineChart>
						</ChartContainer>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
