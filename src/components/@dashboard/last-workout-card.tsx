"use client";

import {
	ArrowRightIcon,
	CalendarDotsIcon,
	ClockCounterClockwiseIcon,
	SparkleIcon,
	TrophyIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { CardsHeader, useUnits } from "@/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useLastWorkout } from "@/hooks";
import { cn } from "@/lib/utils";
import { WorkoutTableSkeleton } from "@/skeletons";

export interface TopLift {
	id: string | number;
	exercise: string;
	weightKg: number;
	reps: number;
	isPR?: boolean;
}

export interface LastWorkoutSession {
	id: string;
	date: string;
	programName: string;
	dayName: string;
	topLifts: TopLift[];
}

interface LastWorkoutCardProps {
	data?: LastWorkoutSession | null;
	loading?: boolean;
}

export function LastWorkoutCard({
	data,
	loading = false,
}: LastWorkoutCardProps) {
	const { prCount, prs } = useLastWorkout(data);
	const { fmtWeight, weightUnit } = useUnits();

	if (loading || data === undefined) {
		return <WorkoutTableSkeleton rows={4} />;
	}

	if (data === null || data.topLifts.length === 0) {
		return (
			<Card size="sm" className="fcard-flat min-h-55 w-full">
				<Empty className="p-6 sm:p-8 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<CalendarDotsIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No sessions recorded
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-[200px] sm:max-w-sm mx-auto">
							Complete your first workout to view top performance
							snapshots here.
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
		<Card size="sm" className="fcard-flat w-full text-foreground card-ease">
			<CardsHeader
				icon={ClockCounterClockwiseIcon}
				title="Last Workout"
				trailing={
					<div className="fg1_5 fwrap">
						{prCount > 0 && (
							<Popover>
								<PopoverTrigger
									nativeButton={false}
									render={
										<Badge
											variant="outline"
											className="h-5 px-1.5 ftext-3xs font-bold fupper cursor-pointer rounded-none border-primary/40 text-primary"
										>
											<TrophyIcon
												className="size-3 mr-0.5"
												weight="duotone"
											/>
											{prCount} PR{prCount > 1 ? "s" : ""}
										</Badge>
									}
								/>
								<PopoverContent className="w-auto p-2 text-xs rounded-none border-secondary/50">
									<div className="fcol1">
										<p className="font-bold fupper fmuted ftext-2xs">
											Personal Records
										</p>
										<ul className="list-disc list-inside fmuted">
											{prs.map((lift) => (
												<li key={lift.id}>
													<strong className="text-foreground">
														{lift.exercise}:
													</strong>{" "}
													{fmtWeight(lift.weightKg)}
													{weightUnit} × {lift.reps}{" "}
													reps
												</li>
											))}
										</ul>
									</div>
								</PopoverContent>
							</Popover>
						)}
						<Button
							nativeButton={false}
							variant="ghost"
							size="sm"
							className="h-6 justify-between border border-border/60 bg-muted/30 px-2 text-xs fmuted hover:bg-muted hover:text-foreground gap-1 rounded-none"
							render={
								<Link href={`/workout-log/${data.id}`}>
									<span>Open</span>
									<ArrowRightIcon
										size={12}
										className="text-primary"
									/>
								</Link>
							}
						/>
					</div>
				}
			/>

			<CardContent className="p-4 pt-1 fcol4">
				{/* Meta row */}
				<div className="fwrap gap-3 fcb p-3 border border-border/40 bg-background/50 rounded-none">
					<div className="fcy gap-1.5 text-xs fmuted">
						<CalendarDotsIcon
							size={14}
							className="text-primary sh0"
							weight="bold"
						/>
						<span className="font-medium text-foreground">
							{data.date}
						</span>
					</div>
					<div className="fwrap gap-2 fcy">
						<Badge
							variant="secondary"
							className="ftext-2xs fupper font-semibold rounded-none"
						>
							{data.programName}
						</Badge>
						<p className="text-xs font-medium text-foreground truncate">
							{data.dayName}
						</p>
					</div>
				</div>

				{/* Table */}
				<div className="border border-border/40 overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="border-border/60 hover:bg-transparent">
								<TableHead className="w-[50%] h-8 px-3 ftext-3xs fupper fmuted font-semibold">
									Exercise
								</TableHead>
								<TableHead className="w-[25%] h-8 px-3 text-right ftext-3xs fupper fmuted font-semibold">
									Weight
								</TableHead>
								<TableHead className="w-[25%] h-8 px-3 text-right ftext-3xs fupper fmuted font-semibold">
									Reps
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.topLifts.map((lift) => {
								const isPR = lift.isPR ?? false;
								return (
									<TableRow
										key={lift.id}
										className={cn(
											"border-border/40 transition-colors",
											isPR
												? "bg-primary/10"
												: "hover:bg-muted/40",
										)}
									>
										<TableCell className="px-3 py-2.5">
											<div className="fg2 min-w-0">
												{isPR ? (
													<SparkleIcon
														className="size-3.5 text-primary sh0"
														weight="fill"
													/>
												) : (
													<div className="size-1.5 rounded-full bg-muted-foreground/40 sh0" />
												)}
												<span className="text-xs sm:text-sm font-medium text-foreground truncate">
													{lift.exercise}
												</span>
												{isPR && (
													<TrophyIcon
														className="size-3 text-primary sh0"
														weight="duotone"
													/>
												)}
											</div>
										</TableCell>
										<TableCell
											className={cn(
												"px-3 py-2.5 text-right text-xs sm:text-sm font-semibold tabular-nums whitespace-nowrap",
												isPR
													? "text-primary"
													: "text-foreground",
											)}
										>
											{fmtWeight(lift.weightKg)}
											<span className="ftext-3xs fmuted font-normal ml-0.5">
												{weightUnit}
											</span>
										</TableCell>
										<TableCell
											className={cn(
												"px-3 py-2.5 text-right text-xs sm:text-sm font-semibold tabular-nums whitespace-nowrap",
												isPR
													? "text-primary"
													: "text-foreground",
											)}
										>
											{lift.reps}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
