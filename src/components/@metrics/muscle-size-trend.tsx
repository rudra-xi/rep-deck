"use client";

import { BarbellIcon, HeartbeatIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
import { useMuscleSizeTrend } from "@/hooks";
import { ChartCardSkeleton } from "@/skeletons";

interface MuscleSizeTrendProps {
	initialData?: Array<{
		date: string;
		arms: number | null;
		forearms: number | null;
		thighs: number | null;
		chest: number | null;
	}>;
	loading?: boolean;
}

export function MuscleSizeTrend({
	initialData = [],
	loading: propLoading = false,
}: MuscleSizeTrendProps) {
	const { measurementUnit, fmtMeasurement } = useUnits();

	const muscleSizeChartConfig = useMemo<ChartConfig>(
		() => ({
			arms: {
				label: `Arms (${measurementUnit})`,
				color: "var(--chart-1)",
			},
			forearms: {
				label: `Forearms (${measurementUnit})`,
				color: "var(--chart-2)",
			},
			thighs: {
				label: `Thighs (${measurementUnit})`,
				color: "var(--chart-3)",
			},
			chest: {
				label: `Chest (${measurementUnit})`,
				color: "var(--chart-4)",
			},
		}),
		[measurementUnit],
	);

	const { data, hasData } = useMuscleSizeTrend(initialData);

	const convertedData = useMemo(
		() =>
			data.map((d) => ({
				...d,
				arms: d.arms != null ? fmtMeasurement(d.arms) : null,
				forearms:
					d.forearms != null ? fmtMeasurement(d.forearms) : null,
				thighs: d.thighs != null ? fmtMeasurement(d.thighs) : null,
				chest: d.chest != null ? fmtMeasurement(d.chest) : null,
			})),
		[data, fmtMeasurement],
	);

	const growth = useMemo(() => {
		if (convertedData.length < 2) return null;
		const first = convertedData[0];
		const last = convertedData[convertedData.length - 1];

		const diff = (a: number | null, b: number | null) =>
			a != null && b != null ? Number(b) - Number(a) : null;

		return {
			arms: diff(first.arms, last.arms),
			forearms: diff(first.forearms, last.forearms),
			thighs: diff(first.thighs, last.thighs),
			chest: diff(first.chest, last.chest),
		} as Record<keyof typeof muscleSizeChartConfig, number | null>;
	}, [convertedData]);

	if (propLoading) {
		return (
			<ChartCardSkeleton
				height="h-[200px] sm:h-[220px]"
				titleWidth="w-40"
			/>
		);
	}

	if (!hasData) {
		return (
			<Card size="sm" className="fcard-flat min-h-55">
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<BarbellIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Muscle Size Data
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
							Track your arms, forearms, thighs, and chest
							measurements over time by logging your measurements.
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
		<Card size="sm" className="relative fcard-flat card-ease">
			<CardsHeader
				icon={HeartbeatIcon}
				title="Muscle Size"
				trailing={
					growth && (
						<div>
							{(
								Object.entries(growth) as Array<
									[
										keyof typeof muscleSizeChartConfig,
										number | null,
									]
								>
							)
								.filter(([, v]) => v != null)
								.map(([key, value]) => {
									const cfg = muscleSizeChartConfig[key];
									if (!cfg || value == null) return null;

									return (
										<div
											key={key}
											className="fcy gap-1 px-1.5 py-0.5 border bg-background/50 h-5"
											style={{
												borderColor: `color-mix(in oklch, ${cfg.color} 40%, transparent)`,
												backgroundColor: `color-mix(in oklch, ${cfg.color} 10%, transparent)`,
											}}
										>
											<span
												className="size-1.5 rounded-full sh0"
												style={{
													backgroundColor: cfg.color,
												}}
											/>
											<span
												className="ftext-3xs font-mono fupper font-bold"
												style={{ color: cfg.color }}
											>
												{String(key).slice(0, 3)}
											</span>
											<span
												className="ftext-3xs font-mono tabular-nums font-bold"
												style={{ color: cfg.color }}
											>
												{value > 0 ? "+" : ""}
												{value.toFixed(1)}
												{measurementUnit}
											</span>
										</div>
									);
								})}
						</div>
					)
				}
			/>

			<CardContent className="p-4 pt-1 fcol3">
				<ChartContainer
					config={muscleSizeChartConfig}
					className="h-[200px] sm:h-[220px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={convertedData}
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
							unit={measurementUnit}
							domain={["auto", "auto"]}
							fontSize={10}
							width={32}
						/>

						<ChartTooltip
							content={<ChartTooltipContent indicator="dot" />}
						/>
						<ChartLegend content={<ChartLegendContent />} />

						{Object.entries(muscleSizeChartConfig).map(
							([key, cfg]) => (
								<Line
									key={key}
									type="monotone"
									dataKey={key}
									stroke={cfg.color}
									strokeWidth={2}
									dot={{
										r: 3,
										fill: cfg.color,
										strokeWidth: 0,
									}}
									activeDot={{ r: 5 }}
									connectNulls
								/>
							),
						)}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
