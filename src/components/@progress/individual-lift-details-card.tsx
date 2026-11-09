"use client";

import { BarbellIcon, GaugeIcon, TrophyIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	XAxis,
	YAxis,
} from "recharts";
import { CardsHeader, useUnits } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useLiftDetails } from "@/hooks";
import { cn } from "@/lib/utils";
import { ChartCardSkeleton } from "@/skeletons";
import type { LiftDetailPoint } from "@/types/progress";
import { type ViewMode, ViewToggle } from "../@common/view-toggle";

interface IndividualLiftDetailsCardProps {
	initialData?: LiftDetailPoint[];
	loading?: boolean;
}

export function IndividualLiftDetailsCard({
	initialData = [],
	loading: propLoading = false,
}: IndividualLiftDetailsCardProps) {
	const { weightUnit, fmtWeight } = useUnits();
	const [view, setView] = useState<ViewMode>("chart");

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

	// Rows in reverse (newest first) with a computed change column.
	const tableRows = useMemo(() => {
		const reversed = [...convertedData].reverse();
		return reversed.map((row, i) => {
			const prev = reversed[i + 1];
			const change =
				prev &&
				typeof row.estimated1RM === "number" &&
				typeof prev.estimated1RM === "number"
					? row.estimated1RM - prev.estimated1RM
					: null;
			return { ...row, change };
		});
	}, [convertedData]);

	if (loading) {
		return (
			<ChartCardSkeleton
				height="h-[200px] sm:h-[220px]"
				hasToggleRow
				hasViewToggle
				toggleCount={4}
				titleWidth="w-40"
			/>
		);
	}

	const controls = (
		<div className="fri gap-2">
			<ViewToggle view={view} onChange={setView} />
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
		</div>
	);

	if (!hasData && !isFetching) {
		return (
			<Card size="sm" className="fcard-flat min-h-70 card-ease">
				<CardsHeader
					icon={GaugeIcon}
					title={`${liftLabels[selectedLift]} Performance`}
				/>
				<CardContent className="p-4 pt-1 fcol3">
					{controls}

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
								Log your first {liftLabels[selectedLift]}{" "}
								workout to see your performance tracking.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								nativeButton={false}
								variant="outline"
								size="sm"
								className="text-xs mt-1"
								render={
									<Link href="/workout-log">Log Workout</Link>
								}
							/>
						</EmptyContent>
					</Empty>
				</CardContent>
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
						{isFetching && (
							<span className="inline-block size-3 rounded-full border-2 border-current border-t-transparent animate-spin ml-1 align-middle opacity-60" />
						)}
					</span>
				}
			/>

			<CardContent className="p-4 pt-1 fcol3">
				{controls}
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
							<span>{lastPR}</span>
						</span>
					</div>
				</div>

				{view === "chart" ? (
					<ChartContainer
						config={liftChartConfig}
						className="h-40 sm:h-45 w-full"
					>
						<ComposedChart
							accessibilityLayer
							data={convertedData}
							margin={{ left: 12, right: 8, top: 4, bottom: 4 }}
						>
							<CartesianGrid
								vertical={false}
								strokeDasharray="3 3"
							/>
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
								content={
									<ChartTooltipContent indicator="line" />
								}
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
				) : (
					<div className="max-h-55 overflow-y-auto border border-border/40">
						<Table>
							<TableHeader>
								<TableRow className="border-border/60 hover:bg-transparent">
									<TableHead className="ftext-3xs fupper fmuted font-semibold">
										Date
									</TableHead>
									<TableHead className="ftext-3xs fupper fmuted font-semibold text-right">
										Top Set
									</TableHead>
									<TableHead className="ftext-3xs fupper fmuted font-semibold text-right">
										Est. 1RM
									</TableHead>
									<TableHead className="ftext-3xs fupper fmuted font-semibold text-right">
										Δ
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{tableRows.map((row) => (
									<TableRow
										key={row.date}
										className="border-border/40 hover:bg-muted/40"
									>
										<TableCell className="text-xs font-medium text-foreground">
											{row.date}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums font-semibold text-foreground">
											{typeof row.weight === "number"
												? `${row.weight}`
												: "—"}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums font-semibold text-foreground">
											{typeof row.estimated1RM ===
											"number"
												? `${row.estimated1RM}`
												: "—"}
										</TableCell>
										<TableCell
											className={cn(
												"text-right text-xs tabular-nums font-semibold",
												row.change === null && "fmuted",
												row.change !== null &&
													row.change > 0 &&
													"text-primary",
												row.change !== null &&
													row.change < 0 &&
													"text-destructive",
											)}
										>
											{row.change === null
												? "—"
												: `${row.change > 0 ? "+" : ""}${row.change.toFixed(1)}`}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
