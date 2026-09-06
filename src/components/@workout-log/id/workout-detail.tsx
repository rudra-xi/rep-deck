// app/components/workout-log/id/workout-detail.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	CalendarDotsIcon,
	TrophyIcon,
	CaretLeftIcon,
	CaretRightIcon,
	BarbellIcon,
	LightningIcon,
	HashIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { BackButton } from "@/common";
import { format, isSameDay } from "date-fns";

interface WorkoutDetailProps {
	session: {
		id: string;
		rawDate: string;
		date: string;
		programName: string;
		dayName: string;
		sets: Array<{
			id: string;
			exercise: string;
			weightKg: number;
			reps: number;
			rpe?: number;
			isPR: boolean;
		}>;
	};
	/**
	 * Array of all sessions available for navigation.
	 * Expected to be sorted chronologically (oldest at index 0, newest at last index).
	 */
	sessions?: Array<{ id: string; date: string }>;
}

export function WorkoutDetail({ session, sessions = [] }: WorkoutDetailProps) {
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState<Date>(
		new Date(session.rawDate),
	);

	const { totalVolume, prCount, uniqueExercisesCount, exerciseGroups } =
		useMemo(() => {
			const volume = session.sets.reduce(
				(sum, set) => sum + set.weightKg * set.reps,
				0,
			);
			const prs = session.sets.filter((set) => set.isPR).length;

			const groups = session.sets.reduce(
				(acc, set) => {
					if (!acc[set.exercise]) acc[set.exercise] = [];
					acc[set.exercise].push(set);
					return acc;
				},
				{} as Record<string, typeof session.sets>,
			);

			return {
				totalVolume: volume,
				prCount: prs,
				uniqueExercisesCount: Object.keys(groups).length,
				exerciseGroups: groups,
			};
		}, [session.sets]);

	// Sort sessions chronologically (Oldest -> Newest) to guarantee direction consistency
	const sortedSessions = useMemo(() => {
		return [...sessions].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	}, [sessions]);

	const currentIndex = sortedSessions.findIndex((s) => s.id === session.id);

	// Navigation targets:
	// Left Arrow (<)  = Older Session (currentIndex - 1)
	// Right Arrow (>) = Newer Session (currentIndex + 1)
	const olderSession =
		currentIndex > 0 ? sortedSessions[currentIndex - 1] : null;
	const newerSession =
		currentIndex >= 0 && currentIndex < sortedSessions.length - 1
			? sortedSessions[currentIndex + 1]
			: null;

	const handleNavigate = (targetId: string) => {
		router.push(`/workout-log/${targetId}`);
	};

	const handleDateSelect = (date: Date | undefined) => {
		if (!date) return;
		setSelectedDate(date);

		const matchedSession = sortedSessions.find((s) =>
			isSameDay(new Date(s.date), date),
		);

		if (matchedSession) {
			handleNavigate(matchedSession.id);
		}
	};

	return (
		<div className="container max-w-7xl mx-auto py-6 px-4 space-y-6">
			{/* Top Bar with BackButton & Fixed Chronological Pagination */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<BackButton text="Dashboard" />

				{sortedSessions.length > 1 && (
					<div className="flex items-center gap-1.5 border border-secondary/50 bg-card/50 p-1 rounded-md shadow-sm">
						{/* LEFT ARROW: Go to OLDER date */}
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 text-muted-foreground hover:text-foreground"
							onClick={() =>
								olderSession && handleNavigate(olderSession.id)
							}
							disabled={!olderSession}
							title="Previous / Older Session"
						>
							<CaretLeftIcon size={14} weight="bold" />
						</Button>

						<Popover>
							<PopoverTrigger
								render={
									<Button
										variant="ghost"
										size="sm"
										className="h-7 px-2 text-xs font-medium gap-1.5 hover:bg-accent hover:text-accent-foreground"
									>
										<CalendarDotsIcon
											size={14}
											className="text-primary"
										/>
										<span>
											{format(
												new Date(session.rawDate),
												"MMM d, yyyy",
											)}
										</span>
									</Button>
								}
							/>

							<PopoverContent
								className="w-auto p-0 border border-secondary/50 bg-card transition-colors hover:border-primary/50"
								align="end"
							>
								<Calendar
									mode="single"
									selected={selectedDate}
									onSelect={handleDateSelect}
									showOutsideDays={false}
									modifiers={{
										hasSession: (date) =>
											sortedSessions.some((s) =>
												isSameDay(
													new Date(s.date),
													date,
												),
											),
									}}
									modifiersClassNames={{
										hasSession:
											"bg-primary/50 text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground",
									}}
									disabled={(date) =>
										!sortedSessions.some((s) =>
											isSameDay(new Date(s.date), date),
										)
									}
									className="p-3"
								/>
								<Separator />
								<div className="p-2 text-[11px] text-muted-foreground text-center bg-muted">
									<span className="inline-block size-2 rounded-full bg-primary mr-1.5 align-middle" />
									Completed Sessions
								</div>
							</PopoverContent>
						</Popover>

						{/* RIGHT ARROW: Go to NEWER date */}
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 text-muted-foreground hover:text-foreground"
							onClick={() =>
								newerSession && handleNavigate(newerSession.id)
							}
							disabled={!newerSession}
							title="Next / Newer Session"
						>
							<CaretRightIcon size={14} weight="bold" />
						</Button>

						<Separator
							orientation="vertical"
							className="h-4 mx-1"
						/>

						<span className="px-1.5 text-[11px] font-medium text-muted-foreground">
							{currentIndex + 1} / {sortedSessions.length}
						</span>
					</div>
				)}
			</div>

			{/* Session Overview Header */}
			<Card
				size="sm"
				className="border border-secondary/50 bg-card/50 transition-colors hover:border-primary/50"
			>
				<CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
					<div className="space-y-1.5">
						<div className="flex items-center gap-2">
							<Badge
								variant="secondary"
								className="bg-secondary text-secondary-foreground font-medium text-[10px] uppercase tracking-wider px-2 py-0.5"
							>
								{session.dayName}
							</Badge>
							{prCount > 0 && (
								<Badge
									variant="outline"
									className="h-5 px-1.5 text-[9px] font-bold uppercase tracking-wider"
								>
									<TrophyIcon
										className="size-3 mr-0.5"
										weight="duotone"
									/>
									{prCount} PR{prCount > 1 ? "s" : ""}
								</Badge>
							)}
						</div>

						<CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
							{session.programName}
						</CardTitle>

						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<CalendarDotsIcon className="size-3.5 text-primary" />
							{session.date}
						</p>
					</div>

					{/* Summary KPIs Row */}
					<div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
						<div className="space-y-0.5">
							<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
								<BarbellIcon
									className="size-3.5 text-primary"
									weight="bold"
								/>
								Total Volume
							</span>
							<p className="text-lg font-bold text-foreground">
								{totalVolume.toLocaleString()}{" "}
								<span className="text-xs font-normal text-muted-foreground">
									kg
								</span>
							</p>
						</div>

						<Separator orientation="vertical" className="h-8" />

						<div className="space-y-0.5">
							<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
								<HashIcon
									className="size-3.5 text-primary"
									weight="bold"
								/>
								Sets
							</span>
							<p className="text-lg font-bold text-foreground">
								{session.sets.length}
							</p>
						</div>

						<Separator orientation="vertical" className="h-8" />

						<div className="space-y-0.5">
							<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
								<LightningIcon
									className="size-3.5 text-primary"
									weight="bold"
								/>
								Exercises
							</span>
							<p className="text-lg font-bold text-foreground">
								{uniqueExercisesCount}
							</p>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Exercise Breakdown Cards Grid */}
			<div className="space-y-3">
				<h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-0.5">
					Exercise Breakdown
				</h2>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
					{Object.entries(exerciseGroups).map(
						([exerciseName, sets], groupIdx) => (
							<Card
								key={exerciseName}
								size="sm"
								className="border border-secondary/50 bg-card/50 transition-colors hover:border-primary/50 h-full"
							>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
									<div className="flex items-center gap-2 min-w-0 pr-2">
										<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
											<BarbellIcon
												className="size-3.5"
												weight="bold"
											/>
										</div>
										<CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground truncate">
											{groupIdx + 1}. {exerciseName}
										</CardTitle>
									</div>

									<Badge
										variant="outline"
										className="text-[10px] sh0 pt-1"
									>
								  Best: {Math.max(...sets.map(s => s.weightKg))}kg
									</Badge>
								</CardHeader>

								<Separator />

								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow className="border-border hover:bg-transparent">
												<TableHead className="w-8 text-[11px] font-medium text-muted-foreground pl-3">
													#
												</TableHead>
												<TableHead className="text-[11px] font-medium text-muted-foreground text-right px-1">
													Weight
												</TableHead>
												<TableHead className="text-[11px] font-medium text-muted-foreground text-right px-1">
													Reps
												</TableHead>
												<TableHead className="text-[11px] font-medium text-muted-foreground text-right px-1">
													RPE
												</TableHead>
												<TableHead className="text-[11px] font-medium text-muted-foreground text-right pr-3">
													Vol
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{sets.map((set, idx) => (
												<TableRow
													key={set.id}
													className={`border-border transition-colors ${
														set.isPR
															? "bg-primary/10"
															: "hover:bg-muted/50"
													}`}
												>
													<TableCell className="pl-3 font-mono text-xs text-muted-foreground">
														{idx + 1}
													</TableCell>
													<TableCell className="text-right text-xs font-medium text-foreground px-1">
														{set.weightKg}{" "}
														<span className="text-[10px] text-muted-foreground font-normal">
															kg
														</span>
													</TableCell>
													<TableCell className="text-right text-xs font-medium text-foreground px-1">
														{set.reps}
													</TableCell>
													<TableCell className="text-right text-xs text-muted-foreground px-1">
														{set.rpe ? (
															<span>
																{set.rpe}
															</span>
														) : (
															"—"
														)}
													</TableCell>
													<TableCell className="text-right pr-3 text-xs font-semibold text-foreground">
														<div className="flex items-center justify-end">
															{set.isPR && (
																<Badge
																	variant="ghost"
																	className="h-5 px-1.5 text-[9px] font-bold uppercase tracking-wider"
																>
																	<TrophyIcon
																		className="size-2"
																		weight="duotone"
																	/>
																</Badge>
															)}
															<span>
																{(
																	set.weightKg *
																	set.reps
																).toLocaleString()}
															</span>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						),
					)}
				</div>
			</div>
		</div>
	);
}
