"use client";

import Link from "next/link";
import {
	ArrowRightIcon,
	CalendarDotsIcon,
	SparkleIcon,
	StarFourIcon,
	TrophyIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useLastWorkout } from "@/hooks";
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

	// 1. Loading State
	if (loading || data === undefined) {
    return <WorkoutTableSkeleton rows={4} />;
  }

	// 2. Empty Data State with shadcn Empty
	if (data === null || data.topLifts.length === 0) {
		return (
			<Card
				size="sm"
				className="relative border border-secondary/40 bg-card/30 rounded-none shadow-none min-h-[220px] w-full"
			>
				<Empty className="p-6 sm:p-8 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="flex border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
							<CalendarDotsIcon
								className="size-6 text-primary"
								weight="bold"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No sessions recorded
						</EmptyTitle>
						<EmptyDescription className="text-xs text-muted-foreground max-w-[200px] sm:max-w-sm mx-auto">
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

	// 3. Render Workout Snapshot Data
	return (
		<Card
			size="sm"
			className="w-full border-secondary/50 bg-card/50 text-foreground"
		>
			{/* Card Header */}
			<CardHeader className="p-4 sm:p-6 pb-3 space-y-2">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<CalendarDotsIcon
								size={16}
								className="text-primary shrink-0"
							/>
							{data.date}
						</span>
						{prCount > 0 && (
							<Popover>
								<PopoverTrigger
									nativeButton={false}
									render={
										<Badge
											variant="outline"
											className="h-5 px-1.5 text-[9px] font-bold uppercase tracking-wider active:bg-primary/30 hover:bg-accent cursor-pointer"
										>
											<TrophyIcon
												className="size-3 mr-0.5"
												weight="duotone"
											/>
											{prCount} PR{prCount > 1 ? "s" : ""}
										</Badge>
									}
								/>
								<PopoverContent className="w-auto p-2 text-xs">
									<div className="space-y-1">
										<p className="font-semibold">
											Personal Records
										</p>
										<ul className="list-disc list-inside text-muted-foreground">
											{prs.map((lift) => (
												<li key={lift.id}>
													<strong className="text-foreground">
														{lift.exercise}:
													</strong>{" "}
													{lift.weightKg}kg ×{" "}
													{lift.reps} reps
												</li>
											))}
										</ul>
									</div>
								</PopoverContent>
							</Popover>
						)}
					</div>
					<Button
						nativeButton={false}
						variant="ghost"
						size="sm"
						className="h-8 justify-between border border-border/60 bg-muted/30 px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground gap-1.5"
						render={
							<Link href={`/workout-log/${data.id}`}>
								<span>Open Session</span>
								<ArrowRightIcon size={14} />
							</Link>
						}
					/>
				</div>

				<div className="flex flex-wrap items-center gap-2 pt-0.5">
					<Badge variant="secondary" className="text-xs">
						{data.programName}
					</Badge>
					<p className="text-xs sm:text-sm font-medium text-foreground truncate max-w-full">
						{data.dayName}
					</p>
				</div>
			</CardHeader>

			{/* Workout Table Section */}
			<CardContent className="p-0 sm:px-6 sm:pb-4 overflow-x-auto">
				<Table className="w-full table-fixed min-w-[280px]">
					<TableHeader>
						<TableRow className="border-border/60 hover:bg-transparent">
							<TableHead className="w-[50%] h-9 px-4 sm:px-3 text-xs font-semibold text-muted-foreground">
								Exercise
							</TableHead>
							<TableHead className="w-[25%] h-9 px-2 sm:px-3 text-right text-xs font-semibold text-muted-foreground">
								Weight
							</TableHead>
							<TableHead className="w-[25%] h-9 px-4 sm:px-3 text-right text-xs font-semibold text-muted-foreground">
								Reps
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.topLifts.map((lift) => {
							const isPR = lift.isPR || false;
							return (
								<TableRow
									key={lift.id}
									className={`border-border/60 ${
										isPR ? "bg-primary/5" : ""
									}`}
								>
									{/* Exercise Column */}
									<TableCell className="px-4 py-3 sm:px-3 text-xs sm:text-sm font-medium text-foreground">
										<div className="flex items-center gap-2 min-w-0">
											<div className="flex shrink-0 border p-1.5 rounded-md bg-primary/10 border-primary/30 text-primary">
												{isPR ? (
													<SparkleIcon
														className="size-3.5"
														weight="bold"
													/>
												) : (
													<StarFourIcon
														className="size-3.5"
														weight="bold"
													/>
												)}
											</div>
											<span className="truncate">
												{lift.exercise}
											</span>

											{isPR && (
												<Badge
													variant="outline"
													className="border-primary/40 text-primary sh0"
												>
													<TrophyIcon
														size={10}
														weight="duotone"
													/>
												</Badge>
											)}
										</div>
									</TableCell>

									{/* Weight Column */}
									<TableCell
										className={`px-2 py-3 sm:px-3 text-right text-xs sm:text-sm font-semibold whitespace-nowrap ${
											isPR
												? "text-primary underline underline-offset-2"
												: "text-foreground"
										}`}
									>
										{lift.weightKg} kg
									</TableCell>

									{/* Reps Column */}
									<TableCell
										className={`px-4 py-3 sm:px-3 text-right text-xs sm:text-sm font-semibold whitespace-nowrap ${
											isPR
												? "text-primary"
												: "text-foreground"
										}`}
									>
										{lift.reps}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
