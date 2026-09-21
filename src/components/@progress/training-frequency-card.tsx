"use client";

import { ActivityIcon, FlameIcon, TrophyIcon } from "@phosphor-icons/react";
import Link from "next/link";
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
} from "recharts";
import { CardsHeader } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
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
import { useTrainingFrequency } from "@/hooks";
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

	if (loading) return <TrainingFrequencyCardSkeleton />;

	if (!hasData) {
		return (
			<Card size="sm" className="fcard-flat min-h-70 card-ease">
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<ActivityIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Training Data
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
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
								<Link href="/workout-log">Log Workout</Link>
							}
						/>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	return (
		<Card size="sm" className="fcard-flat overflow-hidden card-ease">
			<CardsHeader icon={ActivityIcon} title="Training Distribution" />

			<CardContent className="p-4 pt-1 fcol3">
				<div className="grid grid-cols-2 gap-2 text-xs">
					<div className="fcy gap-2 bg-secondary/30 border border-secondary/60 p-2 rounded-md">
						<FlameIcon
							className="size-4 text-primary sh0"
							weight="fill"
						/>
						<div className="fcol leading-tight">
							<span className="ftext-3xs fmuted fupper font-medium">
								12-Wk Total
							</span>
							<span className="font-bold text-foreground ">
								{totalSessions}{" "}
								<span className="ftext-2xs font-normal fmuted">
									sessions
								</span>
							</span>
						</div>
					</div>

					<div className="fcy gap-2 bg-secondary/30 border border-secondary/60 p-2 rounded-md">
						<TrophyIcon
							className="size-4 text-popover-foreground sh0"
							weight="duotone"
						/>
						<div className="fcol leading-tight">
							<span className="ftext-3xs fmuted fupper font-medium">
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

				<div className="fcb ftext-2xs fmuted pt-2 border-t border-border/40">
					<div className="fcy gap-1.5">
						<span className="size-2 rounded-full bg-chart-1 inline-block" />
						<span className="font-medium text-foreground">
							Logged Sessions
						</span>
					</div>
					<div className="fcy gap-1.5">
						<span className="size-2 rounded-full border border-dashed border-chart-4 inline-block" />
						<span>12-Wk Target</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
