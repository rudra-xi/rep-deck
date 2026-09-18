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
import { BackButton, useUnits } from "@/common";
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
	sessions?: Array<{ id: string; date: string }>;
}

export function WorkoutDetail({ session, sessions = [] }: WorkoutDetailProps) {
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState<Date>(
		new Date(session.rawDate),
	);

	const { fmtWeight, weightUnit } = useUnits();

	const { totalVolume, prCount, uniqueExercisesCount, exerciseGroups } =
		useMemo(() => {
			// ✅ Numeric accumulation — do NOT pass through fmtWeight
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

	const sortedSessions = useMemo(() => {
		return [...sessions].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	}, [sessions]);

	const currentIndex = sortedSessions.findIndex((s) => s.id === session.id);

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
		<div className="fcontainer py-6 px-4 fcol6">
			{/* ── Top bar: back + session navigator ── */}
			<div className="fwrap gap-4 fcb">
				<BackButton text="Dashboard" />

				{sortedSessions.length > 1 && (
					<div className="fg1_5 border border-secondary/50 bg-card/50 p-1 rounded-none shadow-sm">
						<Button
							variant="ghost"
							size="icon"
							className="size-7 rounded-none fmuted hover:text-foreground"
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
										className="h-7 px-2 text-xs font-medium gap-1.5 rounded-none hover:bg-accent hover:text-accent-foreground"
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
								className="w-auto p-0 rounded-none border border-secondary/50 bg-card"
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
											"bg-primary text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground",
									}}
									disabled={(date) =>
										!sortedSessions.some((s) =>
											isSameDay(new Date(s.date), date),
										)
									}
									className="p-3"
								/>
								<Separator />
								<div className="p-2 ftext-xs2 fmuted text-center bg-muted">
									<span className="inline-block size-2 rounded-full bg-primary mr-1.5 align-middle" />
									Completed Sessions
								</div>
							</PopoverContent>
						</Popover>

						<Button
							variant="ghost"
							size="icon"
							className="size-7 rounded-none fmuted hover:text-foreground"
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

						<span className="px-1.5 ftext-xs2 font-medium fmuted">
							{currentIndex + 1} / {sortedSessions.length}
						</span>
					</div>
				)}
			</div>

			{/* ── Session summary card ── */}
			<Card size="sm" className="fcard-flat card-ease">
				<CardHeader className="fcol md:flex-row md:items-center justify-between gap-4 pb-4">
					{/* Left: badges + program + date */}
					<div className="fcol1_5">
						<div className="fg2">
							<Badge
								variant="secondary"
								className="ftext-2xs fupper font-medium"
							>
								{session.dayName}
							</Badge>
							{prCount > 0 && (
								<Badge
									variant="outline"
									className="rounded-none font-bold fupper"
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

						<p className="text-xs fmuted fcy gap-1.5">
							<CalendarDotsIcon className="size-3.5 text-primary" />
							{session.date}
						</p>
					</div>

					{/* Right: KPI strip */}
					<div className="fg4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
						<div className="space-y-0.5">
							<span className="ftext-2xs font-medium fmuted fupper fcy gap-1">
								<BarbellIcon
									className="size-3.5 text-primary"
									weight="bold"
								/>
								Total Volume
							</span>
							<p className="text-lg font-bold text-foreground">
								{totalVolume.toLocaleString()}{" "}
								<span className="text-xs font-normal fmuted">
									{weightUnit}
								</span>
							</p>
						</div>

						<Separator orientation="vertical" className="h-8" />

						<div className="space-y-0.5">
							<span className="ftext-2xs font-medium fmuted fupper fcy gap-1">
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
							<span className="ftext-2xs font-medium fmuted fupper fcy gap-1">
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

			{/* ── Exercise breakdown ── */}
			<div className="fcol3">
				<h2 className="text-xs font-medium fupper fmuted px-0.5">
					Exercise Breakdown
				</h2>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
					{Object.entries(exerciseGroups).map(
						([exerciseName, sets], groupIdx) => (
							<Card
								key={exerciseName}
								size="sm"
								className="fcard-flat card-ease h-full"
							>
								<CardHeader className="fr items-center justify-between space-y-0 pb-3">
									<div className="fg2 min-w-0 pr-2">
										<div className="ficon-box-sm">
											<BarbellIcon
												className="size-3.5"
												weight="bold"
											/>
										</div>
										<CardTitle className="text-xs font-medium fupper fmuted truncate">
											{groupIdx + 1}. {exerciseName}
										</CardTitle>
									</div>

									<Badge
										variant="outline"
										className="ftext-2xs sh0 pt-1"
									>
										Best:{" "}
										{fmtWeight(
											Math.max(
												...sets.map((s) => s.weightKg),
											),
										)}
										{weightUnit}
									</Badge>
								</CardHeader>

								<Separator />

								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow className="border-border hover:bg-transparent">
												<TableHead className="w-8 ftext-xs2 font-medium fmuted pl-3">
													#
												</TableHead>
												<TableHead className="ftext-xs2 font-medium fmuted text-right px-1">
													Weight
												</TableHead>
												<TableHead className="ftext-xs2 font-medium fmuted text-right px-1">
													Reps
												</TableHead>
												<TableHead className="ftext-xs2 font-medium fmuted text-right px-1">
													RPE
												</TableHead>
												<TableHead className="ftext-xs2 font-medium fmuted text-right pr-3">
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
													<TableCell className="pl-3 font-mono text-xs fmuted">
														{idx + 1}
													</TableCell>
													<TableCell className="text-right text-xs font-medium text-foreground px-1">
														{fmtWeight(
															set.weightKg,
														)}{" "}
														<span className="ftext-2xs fmuted font-normal">
															{weightUnit}
														</span>
													</TableCell>
													<TableCell className="text-right text-xs font-medium text-foreground px-1">
														{set.reps}
													</TableCell>
													<TableCell className="text-right text-xs fmuted px-1">
														{set.rpe ?? "—"}
													</TableCell>
													<TableCell className="text-right pr-3 text-xs font-semibold text-foreground">
														<div className="fc justify-end">
															{set.isPR && (
																<Badge
																	variant="ghost"
																	className="h-5 px-1.5 ftext-3xs font-bold fupper"
																>
																	<TrophyIcon
																		className="size-2"
																		weight="duotone"
																	/>
																</Badge>
															)}
															<span>
																{(
																	fmtWeight(
																		set.weightKg,
																	) * set.reps
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
