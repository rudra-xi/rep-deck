"use client";

import { CaretUpDownIcon, TrendUpIcon } from "@phosphor-icons/react";
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
import { CardsHeader, useUnits, type ViewMode, ViewToggle } from "@/common";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useStrengthChart } from "@/hooks";
import { cn } from "@/lib/utils";
import { ChartCardSkeleton } from "@/skeletons";

export interface StrengthTrendDataPoint {
	date: string;
	squat?: number;
	bench?: number;
	deadlift?: number;
	ohp?: number;
	squatWeight?: number;
	benchWeight?: number;
	deadliftWeight?: number;
	ohpWeight?: number;
	squatReps?: number;
	benchReps?: number;
	deadliftReps?: number;
	ohpReps?: number;
	prs?: {
		squat?: boolean;
		bench?: boolean;
		deadlift?: boolean;
		ohp?: boolean;
	};
}

type LiftKey = "squat" | "bench" | "deadlift" | "ohp";

const LIFT_META: Record<LiftKey, { label: string; color: string }> = {
	squat: { label: "Squat", color: "var(--chart-1)" },
	bench: { label: "Bench", color: "var(--chart-2)" },
	deadlift: { label: "Deadlift", color: "var(--chart-3)" },
	ohp: { label: "OHP", color: "var(--chart-4)" },
};

const LIFT_ORDER: LiftKey[] = ["squat", "bench", "deadlift", "ohp"];

interface StrengthChartProps {
	data?: StrengthTrendDataPoint[];
	loading?: boolean;
}

export function StrengthChart({
	data = [],
	loading = false,
}: StrengthChartProps) {
	const { weightUnit, fmtWeight } = useUnits();
	const { hasData } = useStrengthChart(data);

	const [selectedLift, setSelectedLift] = useState<LiftKey>("bench");
	const [view, setView] = useState<ViewMode>("chart"); // ← ViewMode type

	const filteredData = useMemo(() => {
		const currentKey =
			`${selectedLift}Weight` as keyof StrengthTrendDataPoint;
		const estKey = selectedLift as keyof StrengthTrendDataPoint;
		const repsKey = `${selectedLift}Reps` as keyof StrengthTrendDataPoint;

		return data
			.filter(
				(d) =>
					typeof d[currentKey] === "number" ||
					typeof d[estKey] === "number",
			)
			.map((d) => {
				const current = d[currentKey];
				const est = d[estKey];
				const reps = d[repsKey];
				return {
					date: d.date,
					current:
						typeof current === "number"
							? fmtWeight(current)
							: undefined,
					estimated:
						typeof est === "number" ? fmtWeight(est) : undefined,
					reps: typeof reps === "number" ? reps : undefined,
				};
			});
	}, [data, selectedLift, fmtWeight]);

	const chartConfig = useMemo<ChartConfig>(
		() => ({
			current: {
				label: `Current (${weightUnit})`,
				color: LIFT_META[selectedLift].color,
			},
			estimated: {
				label: `Est. 1RM (${weightUnit})`,
				color: "var(--chart-5)",
			},
		}),
		[selectedLift, weightUnit],
	);

	if (loading) {
		return (
			<ChartCardSkeleton
				height="h-55 lg:h-70"
				hasToggleRow
				toggleCount={2}
				titleWidth="w-32"
			/>
		);
	}

	if (!hasData) {
		return (
			<Card size="sm" className="fcard-flat relative min-h-75 w-full">
				<Empty className="p-8 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<TrendUpIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Strength Data Yet
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
							Log workouts with Squat, Bench Press, Deadlift, or
							Overhead Press to see current vs estimated 1RM
							progression.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							nativeButton={false}
							variant="outline"
							size="sm"
							className="text-xs mt-1 rounded-none"
							render={
								<Link href="/workout-log">
									Log Your First Workout
								</Link>
							}
						/>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	const tableRows = filteredData
		.map((row, idx) => {
			const prev = idx > 0 ? filteredData[idx - 1] : null;
			const change =
				row.estimated != null && prev?.estimated != null
					? Number(row.estimated) - Number(prev.estimated)
					: null;
			return { ...row, change };
		})
		.slice()
		.reverse();

	const liftSelector = (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="sm"
						className="h-7 px-2 text-xs rounded-none border border-border/60 gap-1.5"
					>
						<span
							className="size-2 rounded-full"
							style={{
								backgroundColor: LIFT_META[selectedLift].color,
							}}
						/>
						{LIFT_META[selectedLift].label}
						<CaretUpDownIcon
							className="size-3 opacity-60"
							weight="bold"
						/>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="rounded-none">
				{LIFT_ORDER.map((key) => (
					<DropdownMenuItem
						key={key}
						onClick={() => setSelectedLift(key)}
						className="text-xs rounded-none gap-2"
					>
						<span
							className="size-2 rounded-full"
							style={{ backgroundColor: LIFT_META[key].color }}
						/>
						{LIFT_META[key].label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<Card size="sm" className="fcard-flat w-full card-ease">
			<CardsHeader
				icon={TrendUpIcon}
				title="Current vs Est. 1RM"
				trailing={
					<div className="fcy gap-2">
						{liftSelector}
						<ViewToggle view={view} onChange={setView} />
					</div>
				}
			/>

			<CardContent className="p-4 pt-1 fcol3">
				{view === "chart" ? (
					<ChartContainer
						config={chartConfig}
						className="h-55 lg:h-70 w-full"
					>
						<ComposedChart
							accessibilityLayer
							data={filteredData}
							margin={{
								top: 10,
								right: 10,
								left: 10,
								bottom: 0,
							}}
						>
							<CartesianGrid
								vertical={false}
								strokeDasharray="3 3"
								opacity={0.4}
							/>
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								fontSize={10}
								interval="preserveStartEnd"
								tickFormatter={(value: string) =>
									new Date(value).toLocaleDateString(
										"en-US",
										{ month: "short", day: "numeric" },
									)
								}
							/>
							<YAxis
								fontSize={10}
								tickLine={false}
								axisLine={false}
								unit={weightUnit}
								width={38}
								tickMargin={4}
								domain={["auto", "auto"]}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										indicator="line"
										labelFormatter={(value) =>
											new Date(
												value as string,
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})
										}
									/>
								}
							/>
							<ChartLegend content={<ChartLegendContent />} />

							<Bar
								dataKey="current"
								fill="var(--color-current)"
								fillOpacity={0.4}
								radius={[2, 2, 0, 0]}
								maxBarSize={28}
							/>
							<Line
								type="monotone"
								dataKey="estimated"
								stroke="var(--color-estimated)"
								strokeWidth={2}
								dot={{ r: 3 }}
								connectNulls
							/>
						</ComposedChart>
					</ChartContainer>
				) : (
					<div className="max-h-70 overflow-y-auto border border-border/40">
						<Table>
							<TableHeader className="sticky top-0 bg-card z-10">
								<TableRow className="border-border/60 hover:bg-transparent">
									<TableHead className="ftext-2xs fupper fmuted font-semibold">
										Date
									</TableHead>
									<TableHead className="ftext-2xs fupper fmuted font-semibold text-right">
										Current
									</TableHead>
									<TableHead className="ftext-2xs fupper fmuted font-semibold text-right">
										Est. 1RM
									</TableHead>
									<TableHead className="ftext-2xs fupper fmuted font-semibold text-right">
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
										<TableCell className="text-xs text-foreground tabular-nums">
											{new Date(
												row.date,
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums text-foreground">
											{row.current ?? "—"}
											{row.reps != null && (
												<span className="ftext-2xs fmuted ml-1">
													× {row.reps}
												</span>
											)}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums text-foreground">
											{row.estimated ?? "—"}
										</TableCell>
										<TableCell
											className={cn(
												"text-right text-xs tabular-nums font-semibold",
												row.change == null && "fmuted",
												row.change != null &&
													row.change > 0 &&
													"text-primary",
												row.change != null &&
													row.change < 0 &&
													"text-destructive",
											)}
										>
											{row.change == null
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
