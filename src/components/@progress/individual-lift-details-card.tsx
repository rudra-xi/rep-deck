"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const liftChartConfig = {
	weight: { label: "Working Wt (kg)", color: "var(--chart-1)" },
	estimated1RM: { label: "Est. 1RM (kg)", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface IndividualLiftDetailsCardProps {
	initialData?: any[];
	loading?: boolean;
}

export function IndividualLiftDetailsCard({
	initialData = [],
	loading: propLoading = false,
}: IndividualLiftDetailsCardProps) {
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

	// Loading State
	if (loading) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
			>
				<CardHeader className="space-y-0 pb-2 flex fcb">
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<GaugeIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						{liftLabels[selectedLift]} Performance
					</CardTitle>
					<div className="flex items-center gap-2">
						<div className="flex border border-border/50 p-0.5 bg-background">
							{liftTypes.map((key) => (
								<Button
									key={key}
									size="sm"
									variant={
										selectedLift === key
											? "default"
											: "ghost"
									}
									className="h-5 px-1.5 text-[10px] rounded-none capitalize"
									disabled
								>
									{key}
								</Button>
							))}
						</div>
						<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
							<BarbellIcon className="size-3.5" weight="bold" />
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-3 pt-0">
					<div className="flex flex-col items-center justify-center py-6 space-y-2">
						<Spinner className="size-6" />
						<p className="text-xs text-muted-foreground">
							Loading lift data...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Empty State
	if (!hasData && !isFetching) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[280px]"
			>
				<CardHeader className="space-y-0 pb-2 flex fcb">
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<GaugeIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						{liftLabels[selectedLift]} Performance
					</CardTitle>
					<div className="flex items-center gap-2">
						<div className="flex border border-border/50 p-0.5 bg-background">
							{liftTypes.map((key) => (
								<Button
									key={key}
									size="sm"
									variant={
										selectedLift === key
											? "default"
											: "ghost"
									}
									onClick={() => setSelectedLift(key)}
									className="h-5 px-1.5 text-[10px] rounded-none capitalize"
								>
									{key}
								</Button>
							))}
						</div>
					</div>
				</CardHeader>
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<BarbellIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No Lift Data
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
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

	// Main Chart View
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<GaugeIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					{liftLabels[selectedLift]} Performance
					{isFetching && (
						<Spinner className="size-3 text-muted-foreground ml-1" />
					)}
				</CardTitle>

				<div className="flex items-center gap-2">
					<div className="flex border border-border/50 p-0.5 bg-background">
						{liftTypes.map((key) => (
							<Button
								key={key}
								size="sm"
								variant={
									selectedLift === key ? "default" : "ghost"
								}
								onClick={() => setSelectedLift(key)}
								className="h-5 px-1.5 text-[10px] rounded-none capitalize"
							>
								{key}
							</Button>
						))}
					</div>
					<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<BarbellIcon className="size-3.5" weight="bold" />
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3 pt-0">
				<div className="grid grid-cols-3 gap-2">
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="text-[9px] uppercase font-medium text-muted-foreground block">
							Current
						</span>
						<span className="text-xs sm:text-sm font-bold text-foreground">
							{latest ? `${latest.weight} kg` : "—"}
						</span>
					</div>
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="text-[9px] uppercase font-medium text-muted-foreground block">
							Est. 1RM
						</span>
						<span className="text-xs sm:text-sm font-bold">
							{latest ? `${latest.estimated1RM} kg` : "—"}
						</span>
					</div>
					<div className="p-2 bg-background/50 border border-border/40">
						<span className="text-[9px] uppercase font-medium text-muted-foreground block">
							Last PR
						</span>
						<span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1">
							<TrophyIcon
								className="size-3 text-primary shrink-0"
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
						data={data}
						margin={{ left: 0, right: 8, top: 4, bottom: 4 }}
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
