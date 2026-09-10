"use client";

import Link from "next/link";
import { HeartbeatIcon, PersonIcon } from "@phosphor-icons/react";
import {
	Area,
	CartesianGrid,
	ComposedChart,
	Line,
	XAxis,
	YAxis,
} from "recharts";
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
import { Spinner } from "@/components/ui/spinner";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useBodyMetrics } from "@/hooks";
import { ChartCardSkeleton } from "@/skeletons";

const bodyMetricsChartConfig = {
	weight: { label: "Weight (kg)", color: "var(--chart-1)" },
	bodyFat: { label: "Body Fat (%)", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface BodyMetricsCardProps {
	initialData?: Array<{
		date: string;
		weight: number | null;
		bodyFat: number | null;
	}>;
	loading?: boolean;
}

export function BodyMetricsCard({
	initialData = [],
	loading: propLoading = false,
}: BodyMetricsCardProps) {
	const { data, loading, weightDiff, fatDiff, hasData } = useBodyMetrics(
		initialData,
		propLoading,
	);

	// Loading State
	if (loading) {
  return <ChartCardSkeleton height="h-[200px] sm:h-[220px]" titleWidth="w-40" />;
	}

	// Empty State
	if (!hasData) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[220px]"
			>
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<PersonIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Body Measurements
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
							Track your weight and body fat percentage over time
							by logging your measurements.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							nativeButton={false}
							variant="outline"
							size="sm"
							className="text-xs mt-1"
							render={
								<Link href="/metrics">Add Measurements</Link>
							}
						/>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	// Data State
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

			<CardContent className="space-y-3 pt-0">
				<div className="p-2 border border-primary/30 bg-primary/5 text-xs flex items-center justify-between">
					<span className="text-muted-foreground text-[11px] font-medium">
						Total Progress:
					</span>
					<span className="font-bold text-foreground text-xs">
						{weightDiff} kg ({fatDiff}% fat)
					</span>
				</div>

				<ChartContainer
					config={bodyMetricsChartConfig}
					className="h-[200px] sm:h-[220px] w-full"
				>
					<ComposedChart
						accessibilityLayer
						data={data}
						margin={{ left: 0, right: 0, top: 8, bottom: 4 }}
					>
						<defs>
							<linearGradient
								id="weightGrad"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor="var(--chart-1)"
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor="var(--chart-1)"
									stopOpacity={0.0}
								/>
							</linearGradient>
						</defs>

						<CartesianGrid vertical={false} strokeDasharray="3 3" />

						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							fontSize={10}
							tickMargin={6}
						/>

						<YAxis
							yAxisId="weight"
							orientation="left"
							tickLine={false}
							axisLine={false}
							domain={["auto", "auto"]}
							fontSize={10}
							width={32}
						/>

						<YAxis
							yAxisId="bodyFat"
							orientation="right"
							tickLine={false}
							axisLine={false}
							domain={["auto", "auto"]}
							fontSize={10}
							width={32}
						/>

						<ChartTooltip
							content={<ChartTooltipContent indicator="dot" />}
						/>
						<ChartLegend content={<ChartLegendContent />} />

						<Area
							yAxisId="weight"
							type="monotone"
							dataKey="weight"
							stroke="var(--color-weight)"
							fill="url(#weightGrad)"
							strokeWidth={2}
							connectNulls
						/>

						<Line
							yAxisId="bodyFat"
							type="monotone"
							dataKey="bodyFat"
							stroke="var(--color-bodyFat)"
							strokeWidth={2}
							dot={{ r: 3 }}
							connectNulls
						/>
					</ComposedChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
