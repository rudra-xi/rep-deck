"use client";

import type { Icon } from "@phosphor-icons/react";
import { ChartLineUpIcon, TrendUpIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { getMetricsData } from "@/actions/metrics";
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
import { cn } from "@/lib/utils";
import { ChartCardSkeleton } from "@/skeletons";
import type { MeasurementPoint } from "@/types/progress";

const UPPER_METRICS = ["arms", "forearms", "chest"] as const;

export function UpperBodyTrend() {
	const { data, loading, hasData } = useAllMeasurements();

	const chartConfig = useMemo<ChartConfig>(
		() => ({
			arms: { label: "Arms", color: "var(--chart-1)" },
			forearms: { label: "Forearms", color: "var(--chart-2)" },
			chest: { label: "Chest", color: "var(--chart-3)" },
		}),
		[],
	);

	const normalizedData = useNormalizedData(data, UPPER_METRICS);

	if (loading) {
		return (
			<ChartCardSkeleton
				height="h-[240px] sm:h-[280px]"
				titleWidth="w-40"
			/>
		);
	}

	if (!hasData(UPPER_METRICS)) {
		return (
			<MeasurementsEmptyState subtitle="Log arms, forearms, and chest measurements to see this trend." />
		);
	}

	return (
		<MeasurementsChartCard
			icon={ChartLineUpIcon}
			title="Upper Body"
			subtitle="% change from baseline"
			config={chartConfig}
			data={normalizedData}
			rawData={data}
		/>
	);
}

const LOWER_METRICS = ["waist", "hips", "thighs"] as const;

export function LowerBodyTrend() {
	const { data, loading, hasData } = useAllMeasurements();

	const chartConfig = useMemo<ChartConfig>(
		() => ({
			waist: { label: "Waist", color: "var(--chart-1)" },
			hips: { label: "Hips", color: "var(--chart-2)" },
			thighs: { label: "Thighs", color: "var(--chart-3)" },
		}),
		[],
	);

	const normalizedData = useNormalizedData(data, LOWER_METRICS);

	if (loading) {
		return (
			<ChartCardSkeleton
				height="h-[240px] sm:h-[280px]"
				titleWidth="w-40"
			/>
		);
	}

	if (!hasData(LOWER_METRICS)) {
		return (
			<MeasurementsEmptyState subtitle="Log waist, hips, and thighs measurements to see this trend." />
		);
	}

	return (
		<MeasurementsChartCard
			icon={ChartLineUpIcon}
			title="Lower Body"
			subtitle="% change from baseline"
			config={chartConfig}
			data={normalizedData}
			rawData={data}
		/>
	);
}

function useAllMeasurements() {
	const [data, setData] = useState<MeasurementPoint[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setLoading(true);
			try {
				const res = await getMetricsData("3M");
				if (!isMounted) return;

				const chartData = res?.chartData ?? res?.measurements ?? [];
				setData(chartData);
			} catch (err) {
				console.error("Failed to load measurements:", err);
			} finally {
				if (isMounted) setLoading(false);
			}
		}

		fetchData();
		return () => {
			isMounted = false;
		};
	}, []);

	const hasData = (metrics: readonly string[]) => {
		if (!data.length) return false;
		return data.some((d) =>
			metrics.some(
				(key) =>
					d[key as keyof MeasurementPoint] != null &&
					d[key as keyof MeasurementPoint] !== 0,
			),
		);
	};

	return { data, loading, hasData };
}

function useNormalizedData(
	data: MeasurementPoint[],
	metrics: readonly string[],
) {
	return useMemo(() => {
		if (!data.length) return [];

		const baselines: Record<string, number> = {};
		metrics.forEach((metric) => {
			const firstValue = data.find(
				(d) => d[metric as keyof MeasurementPoint] != null,
			);
			if (firstValue) {
				const v = firstValue[metric as keyof MeasurementPoint];
				if (v != null) baselines[metric] = Number(v);
			}
		});

		return data.map((d) => {
			const result: Record<string, number | string | null> = {
				date: d.date,
			};
			metrics.forEach((metric) => {
				const value = d[metric as keyof MeasurementPoint];
				const baseline = baselines[metric];
				if (value != null && baseline != null && baseline !== 0) {
					result[metric] =
						((Number(value) - baseline) / baseline) * 100;
				} else {
					result[metric] = null;
				}
			});
			return result;
		});
	}, [data, metrics]);
}

function useLatestGrowth(
	normalizedData: Array<Record<string, number | string | null>>,
	rawData: MeasurementPoint[],
	config: ChartConfig,
) {
	return useMemo(() => {
		if (!normalizedData.length || !rawData.length) return [];

		const metricKeys = Object.keys(config);

		return metricKeys
			.map((key) => {
				let value: number | null = null;
				for (let i = normalizedData.length - 1; i >= 0; i--) {
					const v = normalizedData[i][key];
					if (v != null && typeof v === "number") {
						value = v;
						break;
					}
				}

				const keyTyped = key as keyof MeasurementPoint;
				let rawLatest: number | null = null;
				for (let i = rawData.length - 1; i >= 0; i--) {
					const v = rawData[i][keyTyped];
					if (v != null) {
						rawLatest = Number(v);
						break;
					}
				}

				const first = rawData.find((d) => d[keyTyped] != null);
				const rawStart =
					first && first[keyTyped] != null
						? Number(first[keyTyped])
						: null;

				const rawDelta =
					rawLatest != null && rawStart != null
						? rawLatest - rawStart
						: null;

				const cfg = config[key];
				return {
					key,
					label: cfg?.label ?? key,
					color: cfg?.color ?? "var(--muted)",
					value,
					rawLatest,
					rawDelta,
				};
			})
			.filter((d) => d.value != null || d.rawLatest != null)
			.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
	}, [normalizedData, rawData, config]);
}

interface MeasurementsChartCardProps {
	icon: Icon;
	title: string;
	subtitle: string;
	config: ChartConfig;
	data: Array<Record<string, number | string | null>>;
	rawData: MeasurementPoint[];
}

function MeasurementsChartCard({
	icon,
	title,
	subtitle,
	config,
	data,
	rawData,
}: MeasurementsChartCardProps) {
	const latest = useLatestGrowth(data, rawData, config);
	const { measurementUnit, fmtMeasurement } = useUnits();

	const lineDurations: Record<string, number> = {
		arms: 800,
		forearms: 1000,
		chest: 1200,
		waist: 800,
		hips: 1000,
		thighs: 1200,
	};

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={icon}
				title={title}
				trailing={
					<span className="text-[10px] text-muted-foreground font-medium normal-case tracking-normal">
						{subtitle}
					</span>
				}
			/>

			<CardContent className="p-4 pt-1 fcol3">
				<div className="fwrap gap-1.5">
					{latest.map((entry) => {
						const isUp = (entry.rawDelta ?? 0) > 0;
						const isDown = (entry.rawDelta ?? 0) < 0;
						const isFlat = (entry.rawDelta ?? 0) === 0;

						return (
							<div
								key={entry.key}
								className="fcy gap-1.5 px-2 py-1 border bg-background/50 h-6"
								style={{
									borderColor: `color-mix(in oklch, ${entry.color} 40%, transparent)`,
									backgroundColor: `color-mix(in oklch, ${entry.color} 8%, transparent)`,
								}}
							>
								<span
									className="size-1.5 rounded-full sh0"
									style={{
										backgroundColor: entry.color,
									}}
								/>
								<span
									className="ftext-3xs fupper font-bold"
									style={{ color: entry.color }}
								>
									{entry.label}
								</span>

								<span className="ftext-3xs  tabular-nums font-bold text-foreground">
									{entry.rawLatest != null
										? `${fmtMeasurement(entry.rawLatest)}${measurementUnit}`
										: "—"}
								</span>

								{entry.rawDelta != null && !isFlat && (
									<span
										className={cn(
											"ftext-3xs  tabular-nums font-bold fcy gap-0.5",
											isUp && "text-primary",
											isDown && "text-destructive",
										)}
									>
										<TrendUpIcon
											className="size-2.5"
											weight="bold"
											style={{
												transform: isDown
													? "rotate(180deg)"
													: undefined,
											}}
										/>
										{entry.rawDelta > 0 ? "+" : ""}
										{entry.rawDelta.toFixed(1)}
										{measurementUnit}
									</span>
								)}
							</div>
						);
					})}
				</div>

				<ChartContainer config={config} className="h-60 sm:h-70 w-full">
					<LineChart
						accessibilityLayer
						data={data}
						margin={{ left: -10, right: 0, top: 8, bottom: 4 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />

						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							fontSize={10}
							tickMargin={6}
						/>

						<YAxis
							tickLine={false}
							axisLine={false}
							unit="%"
							domain={["auto", "auto"]}
							fontSize={10}
							width={40}
						/>

						<ReferenceLine
							y={0}
							stroke="var(--muted-foreground)"
							strokeDasharray="4 4"
							strokeOpacity={0.5}
						/>

						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									indicator="dot"
									formatter={(value, name, item) => {
										const key = String(
											item?.dataKey ?? name,
										);
										const cfg = config[key];
										const dotColor =
											cfg?.color ?? item?.color;

										const numeric = Number(value);
										const formatted = `${numeric > 0 ? "+" : ""}${numeric.toFixed(1)}%`;

										return (
											<div className="fcy gap-2 w-full justify-between">
												<div className="fcy gap-1.5">
													<span
														className="size-2.5 rounded-[2px] sh0"
														style={{
															backgroundColor:
																dotColor,
														}}
													/>
													<span className="text-muted-foreground">
														{cfg?.label ?? name}
													</span>
												</div>
												<span className=" font-medium text-foreground tabular-nums">
													{formatted}
												</span>
											</div>
										);
									}}
								/>
							}
						/>

						<ChartLegend content={<ChartLegendContent />} />

						{Object.entries(config).map(([key, cfg]) => (
							<Line
								key={key}
								type="monotone"
								dataKey={key}
								stroke={cfg.color}
								strokeWidth={3}
								dot={{ r: 3, fill: cfg.color, strokeWidth: 0 }}
								activeDot={{ r: 5 }}
								connectNulls
								isAnimationActive={true}
								animationDuration={lineDurations[key] ?? 1000}
							/>
						))}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function MeasurementsEmptyState({ subtitle }: { subtitle: string }) {
	return (
		<Card size="sm" className="fcard-flat min-h-[240px]">
			<Empty className="p-6 text-center w-full">
				<EmptyHeader>
					<EmptyMedia className="ficon-box-lg">
						<ChartLineUpIcon
							className="size-6 text-primary"
							weight="bold"
						/>
					</EmptyMedia>
					<EmptyTitle className="text-sm font-medium text-foreground">
						No Measurements Data
					</EmptyTitle>
					<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
						{subtitle}
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button
						nativeButton={false}
						variant="outline"
						size="sm"
						className="text-xs mt-1"
						render={<Link href="/metrics">Add Measurements</Link>}
					/>
				</EmptyContent>
			</Empty>
		</Card>
	);
}
