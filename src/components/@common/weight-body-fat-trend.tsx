"use client";

import { useMemo } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { CardsHeader, useUnits } from "@/common";
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

interface WeightBodyFatTrendProps {
	initialData?: Array<{
		date: string;
		weight: number | null;
		bodyFat: number | null;
	}>;
	loading?: boolean;
}

export function WeightBodyFatTrend({
	initialData = [],
	loading: propLoading = false,
}: WeightBodyFatTrendProps) {
	const { weightUnit, fmtWeight } = useUnits();

	const bodyMetricsChartConfig = useMemo<ChartConfig>(
		() => ({
			weight: {
				label: `Weight (${weightUnit})`,
				color: "var(--chart-1)",
			},
			bodyFat: { label: "Body Fat (%)", color: "var(--chart-2)" },
		}),
		[weightUnit],
	);

	const { data, loading, weightDiff, fatDiff, hasData } = useBodyMetrics(
		initialData,
		propLoading,
	);

	const convertedData = useMemo(
		() =>
			data.map((d) => ({
				...d,
				weight: d.weight != null ? fmtWeight(d.weight) : null,
			})),
		[data, fmtWeight],
	);

	if (loading) {
		return (
			<ChartCardSkeleton
				height="h-[200px] sm:h-[220px]"
				titleWidth="w-40"
				hasKpiRow
			/>
		);
	}

	if (!hasData) {
		return (
			<Card size="sm" className="fcard-flat min-h-55">
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<PersonIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Body Measurements
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
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

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader icon={HeartbeatIcon} title="Body Composition" />

			<CardContent className="p-4 pt-1 fcol3">
				<div className="p-2 border border-primary/30 bg-primary/5 text-xs fcb">
					<span className="ftext-xs2 fmuted font-medium">
						Total Progress:
					</span>
					<span className="font-bold text-foreground text-xs">
						{weightDiff} {weightUnit} ({fatDiff}% fat)
					</span>
				</div>

				<ChartContainer
					config={bodyMetricsChartConfig}
					className="h-[200px] sm:h-[220px] w-full"
				>
					<ComposedChart
						accessibilityLayer
						data={convertedData}
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
							unit={weightUnit}
							domain={["auto", "auto"]}
							fontSize={10}
							width={32}
						/>

						<YAxis
							yAxisId="bodyFat"
							orientation="right"
							tickLine={false}
							axisLine={false}
							unit={"%"}
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
