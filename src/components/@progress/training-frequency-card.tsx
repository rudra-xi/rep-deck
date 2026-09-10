"use client";

import Link from "next/link";
import {
	ActivityIcon,
	CalendarCheckIcon,
	FlameIcon,
	TrophyIcon,
} from "@phosphor-icons/react";
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
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
import { Button } from "@/components/ui/button";
import { useTrainingFrequency } from "@/hooks";
import { Skeleton } from "../ui/skeleton";
import { TrainingFrequencyCardSkeleton } from "@/skeletons";

const chartConfig = {
	sessions: {
		label: "Logged Sessions",
		color: "var(--chart-1)",
	},
	target: {
		label: "12-Wk Target",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

interface TrainingFrequencyCardProps {
	initialData?: Array<{ day: string; sessions: number }>;
	loading?: boolean;
}

export function TrainingFrequencyCard({
	initialData = [],
	loading: propLoading = false,
}: TrainingFrequencyCardProps) {
	const {
		combinedData,
		maxDomainValue,
		totalSessions,
		peakDay,
		loading,
		hasData,
	} = useTrainingFrequency(initialData, propLoading);

	// Loading State
	if (loading) return <TrainingFrequencyCardSkeleton />;

	// Empty State
	if (!hasData) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[280px]"
			>
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<ActivityIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Training Data
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
							Complete your first workout to see your training
							frequency distribution.
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

	// Data State
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 overflow-hidden"
		>
			<CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
					<ActivityIcon
						className="size-4 text-primary"
						weight="bold"
					/>
					Training Distribution
				</CardTitle>

				<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
					<CalendarCheckIcon className="size-3.5" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="p-4 pt-0 space-y-3">
				<div className="grid grid-cols-2 gap-2 text-xs pt-1">
					<div className="flex items-center gap-2 bg-secondary/30 border border-secondary/60 p-2 rounded-md">
						<FlameIcon
							className="size-4 text-primary shrink-0"
							weight="fill"
						/>
						<div className="flex flex-col leading-tight">
							<span className="text-[9px] text-muted-foreground uppercase font-medium">
								12-Wk Total
							</span>
							<span className="font-bold text-foreground font-mono">
								{totalSessions}{" "}
								<span className="text-[10px] font-normal text-muted-foreground">
									sessions
								</span>
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2 bg-secondary/30 border border-secondary/60 p-2 rounded-md">
						<TrophyIcon
							className="size-4 text-primary-foreground shrink-0"
							weight="duotone"
						/>
						<div className="flex flex-col leading-tight">
							<span className="text-[9px] text-muted-foreground uppercase font-medium">
								Peak Day
							</span>
							<span className="font-bold text-foreground">
								{peakDay
									? `${peakDay.day} (${peakDay.sessions})`
									: "N/A"}
							</span>
						</div>
					</div>
				</div>

				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[200px] w-full"
				>
					<RadarChart
						data={combinedData}
						margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
					>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<PolarGrid
							stroke="var(--border)"
							strokeDasharray="3 3"
							opacity={0.5}
						/>
						<PolarAngleAxis
							dataKey="day"
							tick={{
								fontSize: 10,
								fill: "var(--muted-foreground)",
								fontWeight: 600,
							}}
						/>
						<PolarRadiusAxis
							angle={16}
							domain={[0, maxDomainValue]}
							hide
						/>

						<Radar
							name="Target Split"
							dataKey="target"
							fill="var(--color-target)"
							fillOpacity={0.05}
							stroke="var(--color-target)"
							strokeDasharray="3 3"
							strokeWidth={1}
						/>

						<Radar
							name="Your Sessions"
							dataKey="sessions"
							fill="var(--color-sessions)"
							fillOpacity={0.5}
							stroke="var(--color-sessions)"
							strokeWidth={1}
							dot={{ r: 3, fill: "var(--color-sessions)" }}
						/>
					</RadarChart>
				</ChartContainer>

				<div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/40">
					<div className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-chart-1 inline-block" />
						<span className="font-medium text-foreground">
							Logged Sessions
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="size-2 rounded-full border border-dashed border-chart-4 inline-block" />
						<span>12-Wk Target</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
