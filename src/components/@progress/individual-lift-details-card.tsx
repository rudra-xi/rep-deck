"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BarbellIcon, GaugeIcon, TrophyIcon } from "@phosphor-icons/react";
import {
	Bar,
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
import { Spinner } from "@/components/ui/spinner";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useLiftDetails } from "@/hooks";
import { ChartCardSkeleton } from "@/skeletons";
import { CardsHeader, useUnits } from "@/common";
import { cn } from "@/lib/utils";

interface IndividualLiftDetailsCardProps {
	initialData?: any[];
	loading?: boolean;
}

export function IndividualLiftDetailsCard({
	initialData = [],
	loading: propLoading = false,
}: IndividualLiftDetailsCardProps) {
	const { weightUnit, fmtWeight } = useUnits();

	const liftChartConfig = useMemo<ChartConfig>(
		() => ({
			weight: {
				label: `Working Wt (${weightUnit})`,
				color: "var(--chart-1)",
			},
			estimated1RM: {
				label: `Est. 1RM (${weightUnit})`,
				color: "var(--chart-2)",
			},
		}),
		[weightUnit],
	);

	const {
		selectedLift,
		setSelectedLift,
		data,
		latest,
		lastPR,
		loading,
		isFetching,
		hasData,
		liftLabels,
		liftTypes,
	} = useLiftDetails(initialData, propLoading);

	const convertedData = useMemo(
		() =>
			data.map((d) => ({
				...d,
				weight:
					typeof d.weight === "number"
						? fmtWeight(d.weight)
						: d.weight,
				estimated1RM:
					typeof d.estimated1RM === "number"
						? fmtWeight(d.estimated1RM)
						: d.estimated1RM,
			})),
		[data, fmtWeight],
	);

	if (loading) {
		return (
			<ChartCardSkeleton
				height="h-[200px] sm:h-[220px]"
				hasToggleRow
				toggleCount={4}
				titleWidth="w-40"
			/>
		);
	}

	// Toggle bar for lift type selection
	const liftToggle = (
		<div className="flex border border-border/50 p-0.5 bg-background">
			{liftTypes.map((key) => (
				<Button
					key={key}
					size="sm"
					variant={selectedLift === key ? "default" : "ghost"}
					onClick={() => setSelectedLift(key)}
					className="h-5 px-1.5 text-[10px] rounded-none capitalize"
				>
					{key}
				</Button>
			))}
		</div>
	);

	if (!hasData && !isFetching) {
		return (
			<Card size="sm" className="fcard-flat min-h-[280px]">
				<CardsHeader
					icon={GaugeIcon}
					title={`${liftLabels[selectedLift]} Performance`}
					trailing={liftToggle}
				/>
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<BarbellIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Lift Data
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
							Log your first {liftLabels[selectedLift]} workout to
							see your performance tracking.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							nativeButton={false}
							variant="outline"
							size="sm"
							className="text-xs mt-1"
							render={
								<Link href="/workouts/new">Log Workout</Link>
							}
						/>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={GaugeIcon}
				title={
					<span>
						{liftLabels[selectedLift]} Performance
						{isFetching}
					</span>
				}
				trailing={<span>{liftToggle}</span>}
			/>

			<CardContent className="p-4 pt-1 fcol3">
				<div className="grid grid-cols-3 gap-2">
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="ftext-3xs fupper font-medium fmuted block">
							Current
						</span>
						<span className="text-xs sm:text-sm font-bold text-foreground">
							{latest
								? `${fmtWeight(latest.weight)} ${weightUnit}`
								: "—"}
						</span>
					</div>
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="ftext-3xs fupper font-medium fmuted block">
							Est. 1RM
						</span>
						<span className="text-xs sm:text-sm font-bold">
							{latest
								? `${fmtWeight(latest.estimated1RM)} ${weightUnit}`
								: "—"}
						</span>
					</div>
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="ftext-3xs fupper font-medium fmuted block">
							Last PR
						</span>
						<span className="text-xs sm:text-sm font-bold text-foreground fcy gap-1">
							<TrophyIcon
								className="size-3 text-primary sh0"
								weight="duotone"
							/>
							<span className="truncate">{lastPR}</span>
						</span>
					</div>
				</div>

				<ChartContainer
					config={liftChartConfig}
					className="h-[160px] sm:h-[180px] w-full"
				>
					<ComposedChart
						accessibilityLayer
						data={convertedData}
						margin={{ left: 12, right: 8, top: 4, bottom: 4 }}
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
							unit={weightUnit}
							domain={["auto", "auto"]}
							fontSize={10}
							width={28}
						/>
						<ChartTooltip
							content={<ChartTooltipContent indicator="line" />}
						/>
						<ChartLegend content={<ChartLegendContent />} />

						<Bar
							dataKey="weight"
							fill="var(--color-weight)"
							radius={[2, 2, 0, 0]}
							maxBarSize={24}
							isAnimationActive={true}
							animationDuration={1000}
						/>

						<Line
							type="monotone"
							dataKey="estimated1RM"
							stroke="var(--color-estimated1RM)"
							strokeWidth={2}
							dot={{ r: 3 }}
							isAnimationActive={true}
							animationDuration={1500}
						/>
					</ComposedChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
