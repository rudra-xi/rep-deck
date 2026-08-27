"use client";

import { CalendarCheckIcon, FireIcon } from "@phosphor-icons/react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { FREQUENCY_DATA } from "@/constants/mock-data";

const frequencyConfig = {
	sessionsCount: { label: "Sessions", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TrainingFrequencyCard() {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<CalendarCheckIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					Consistency
				</CardTitle>

				<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
					<FireIcon className="size-3.5" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-3 pt-0">
				<div className="p-2 border border-primary bg-primary/10 flex items-center justify-between">
					<span className="text-[11px] font-medium text-primary-foreground">
						Streak:
					</span>
					<span className="text-[11px] font-bold text-primary-foreground">
						6 Weeks Active
					</span>
				</div>

				<ChartContainer
					config={frequencyConfig}
					className="h-[130px] sm:h-[150px] w-full"
				>
					<BarChart
						accessibilityLayer
						data={FREQUENCY_DATA}
						margin={{ left: 0, right: 8, top: 4, bottom: 4 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="weekLabel"
							tickLine={false}
							axisLine={false}
							fontSize={10}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							allowDecimals={false}
							domain={[0, 6]}
							fontSize={10}
							width={20}
						/>
						<ChartTooltip
							content={<ChartTooltipContent hideIndicator />}
						/>
						<Bar
							dataKey="sessionsCount"
							fill="var(--color-sessionsCount)"
							radius={2}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
