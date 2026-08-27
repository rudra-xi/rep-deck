"use client";

import { useState } from "react";
import { BarbellIcon, GaugeIcon, TrophyIcon } from "@phosphor-icons/react";
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
import { LIFT_DETAILS_DATA } from "@/constants/mock-data";

const liftChartConfig = {
	weight: { label: "Working Wt", color: "var(--chart-1)" },
	estimated1RM: { label: "Est. 1RM", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function IndividualLiftDetailsCard() {
	const [selectedLift, setSelectedLift] = useState<
		"bench" | "squat" | "deadlift" | "ohp"
	>("bench");
	const data = LIFT_DETAILS_DATA[selectedLift];

	const liftLabels = {
		bench: "Bench",
		squat: "Squat",
		deadlift: "Deadlift",
		ohp: "OHP",
	};

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
					{liftLabels[selectedLift]} Performance
				</CardTitle>

				<div className="flex items-center gap-2">
					<div className="flex border border-border/50 p-0.5 bg-background">
						{(
							Object.keys(liftLabels) as Array<
								keyof typeof liftLabels
							>
						).map((key) => (
							<Button
								key={key}
								size="sm"
								variant={
									selectedLift === key ? "default" : "ghost"
								}
								onClick={() => setSelectedLift(key)}
								className="h-5 px-1.5 text-[10px] rounded-none capitalize"
							>
								{key}
							</Button>
						))}
					</div>
					<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<BarbellIcon className="size-3.5" weight="bold" />
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3 pt-0">
				<div className="grid grid-cols-3 gap-2">
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="text-[9px] uppercase font-medium text-muted-foreground block">
							Current
						</span>
						<span className="text-xs sm:text-sm font-bold text-foreground">
							{data[data.length - 1].weight} kg
						</span>
					</div>
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="text-[9px] uppercase font-medium text-muted-foreground block">
							Est. 1RM
						</span>
						<span className="text-xs sm:text-sm font-bold">
							{data[data.length - 1].estimated1RM} kg
						</span>
					</div>
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="text-[9px] uppercase font-medium text-muted-foreground block">
							Last PR
						</span>
						<span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1">
							<TrophyIcon
								className="size-3 text-primary shrink-0"
								weight="fill"
							/>
							<span className="truncate">
								{data.filter((d) => d.isPR).pop()?.date ||
									"N/A"}
							</span>
						</span>
					</div>
				</div>

				<ChartContainer
					config={liftChartConfig}
					className="h-[160px] sm:h-[180px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={data}
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
							content={<ChartTooltipContent indicator="line" />}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Line
							dataKey="weight"
							stroke="var(--color-weight)"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
						<Line
							dataKey="estimated1RM"
							stroke="var(--color-estimated1RM)"
							strokeWidth={2}
							strokeDasharray="4 4"
							dot={{ r: 3 }}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
