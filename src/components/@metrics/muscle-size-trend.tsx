"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Legend,
} from "recharts";
import { BarbellIcon } from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
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

interface MuscleSizeProps {
	initialData: Array<{
		date: string;
		arms: number | null;
		forearms: number | null;
		thighs: number | null;
		chest: number | null;
		waist: number | null;
	}>;
	loading?: boolean;
}

export function MuscleSizeTrend({
	initialData,
	loading = false,
}: MuscleSizeProps) {
	const { data, muscleColors, hasData } = useMuscleSizeTrend(initialData);

	// Loading State
	if (loading) {
  return <ChartCardSkeleton height="h-[240px]" titleWidth="w-48" />;
	}

	// Empty State — matches BodyMetricsCard
	if (!hasData) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[220px]"
			>
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<BarbellIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Muscle Size Data
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
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

	// Data State
	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]">
			<CardHeader className="p-5 pb-2">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
					<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<BarbellIcon className="size-4" weight="bold" />
					</div>
					Muscle Size Trends (in)
				</CardTitle>
			</CardHeader>
			<CardContent className="p-5 pt-2">
				<div className="h-[240px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={data}
							margin={{
								top: 10,
								right: 10,
								left: -20,
								bottom: 0,
							}}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="var(--border)"
								opacity={0.2}
							/>
							<XAxis
								dataKey="date"
								tick={{
									fontSize: 10,
									fill: "var(--muted-foreground)",
								}}
								axisLine={{
									stroke: "var(--border)",
									opacity: 0.3,
								}}
								tickLine={false}
							/>
							<YAxis
								domain={["dataMin - 2", "dataMax + 2"]}
								tick={{
									fontSize: 10,
									fill: "var(--muted-foreground)",
								}}
								axisLine={{
									stroke: "var(--border)",
									opacity: 0.3,
								}}
								tickLine={false}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--background)",
									borderColor: "var(--border)",
									borderRadius: 0,
									fontSize: "12px",
									boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
									borderWidth: 1,
								}}
								labelStyle={{
									fontWeight: 600,
									color: "var(--foreground)",
								}}
							/>
							<Legend
								verticalAlign="top"
								height={24}
								iconSize={8}
								iconType="circle"
								wrapperStyle={{
									fontSize: "10px",
									fontWeight: 500,
									color: "var(--muted-foreground)",
								}}
							/>
							{Object.entries(muscleColors).map(
								([key, color]) => (
									<Line
										key={key}
										type="monotone"
										dataKey={key}
										name={
											key.charAt(0).toUpperCase() +
											key.slice(1)
										}
										stroke={color}
										strokeWidth={2}
										dot={{
											r: 2.5,
											fill: color,
											strokeWidth: 0,
										}}
										activeDot={{ r: 4.5, strokeWidth: 0 }}
									/>
								),
							)}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
