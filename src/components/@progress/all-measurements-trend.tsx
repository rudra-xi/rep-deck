"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { ChartLineUpIcon } from "@phosphor-icons/react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
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
import { ChartCardSkeleton } from "@/skeletons";
import { getMetricsData } from "@/actions/metrics";

interface MeasurementPoint {
	date: string;
	arms: number | null;
	forearms: number | null;
	thighs: number | null;
	chest: number | null;
	waist: number | null;
	hips: number | null;
}

const UPPER_METRICS = ["arms", "forearms"] as const;

export function UpperBodyTrend() {
	const { measurementLabel } = useUnits();
	const { data, loading, hasData } = useAllMeasurements();

	const chartConfig = useMemo<ChartConfig>(
		() => ({
			arms: { label: "Arms", color: "var(--chart-1)" },
			forearms: { label: "Forearms", color: "var(--chart-2)" },
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
			<MeasurementsEmptyState subtitle="Log arms and forearms measurements to see this trend." />
		);
	}

	return (
		<MeasurementsChartCard
			icon={ChartLineUpIcon}
			title="Upper Body"
			subtitle={`% change from baseline (${measurementLabel})`}
			config={chartConfig}
			data={normalizedData}
		/>
	);
}

const TORSO_METRICS = ["chest", "waist", "hips", "thighs"] as const;

export function TorsoTrend() {
	const { measurementLabel } = useUnits();
	const { data, loading, hasData } = useAllMeasurements();

	const chartConfig = useMemo<ChartConfig>(
		() => ({
			chest: { label: "Chest", color: "var(--chart-1)" },
			waist: { label: "Waist", color: "var(--chart-2)" },
			hips: { label: "Hips", color: "var(--chart-3)" },
			thighs: { label: "Thighs", color: "var(--chart-4)" },
		}),
		[],
	);

	const normalizedData = useNormalizedData(data, TORSO_METRICS);

	if (loading) {
		return (
			<ChartCardSkeleton
				height="h-[240px] sm:h-[280px]"
				titleWidth="w-40"
			/>
		);
	}

	if (!hasData(TORSO_METRICS)) {
		return (
			<MeasurementsEmptyState subtitle="Log chest, waist, hips, and thighs measurements to see this trend." />
		);
	}

	return (
		<MeasurementsChartCard
			icon={ChartLineUpIcon}
			title="Torso"
			subtitle={`% change from baseline (${measurementLabel})`}
			config={chartConfig}
			data={normalizedData}
		/>
	);
}

// ─────────────────────────────────────────────────────────────────
// Shared hooks & helpers
// ─────────────────────────────────────────────────────────────────

function useAllMeasurements() {
	const [data, setData] = useState<MeasurementPoint[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setLoading(true);
			try {
				const res = await getMetricsData("1Y");
				if (!isMounted) return;
				setData(res?.chartData ?? res?.measurements ?? []);
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

// ─────────────────────────────────────────────────────────────────
// Shared UI
// ─────────────────────────────────────────────────────────────────

interface MeasurementsChartCardProps {
	icon: any;
	title: string;
	subtitle: string;
	config: ChartConfig;
	data: Array<Record<string, number | string | null>>;
}

function MeasurementsChartCard({
	icon,
	title,
	subtitle,
	config,
	data,
}: MeasurementsChartCardProps) {
	return (
		<Card size="sm" className="fcard-flat">
			<CardsHeader
				icon={icon}
				title={title}
				trailing={
					<span className="text-[10px] text-muted-foreground font-medium normal-case tracking-normal">
						{subtitle}
					</span>
				}
			/>

			<CardContent className="p-4 pt-1">
				<ChartContainer
					config={config}
					className="h-[240px] sm:h-[280px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={data}
						margin={{ left: 10, right: 2, top: 8, bottom: 4 }}
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
							content={<ChartTooltipContent indicator="dot" />}
						/>
						<ChartLegend content={<ChartLegendContent />} />

						{Object.entries(config).map(([key, cfg]) => (
							<Line
								key={key}
								type="monotone"
								dataKey={key}
								stroke={cfg.color}
								strokeWidth={2}
								dot={{ r: 2, fill: cfg.color, strokeWidth: 0 }}
								activeDot={{ r: 4 }}
								connectNulls
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
