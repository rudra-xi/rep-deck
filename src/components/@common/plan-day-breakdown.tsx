"use client";

import {
	BarbellIcon,
	CaretRightIcon,
	LightningIcon,
	TrophyIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import type { PlanDayBreakdown } from "@/actions/progress";
import { CardsHeader, useUnits } from "@/common";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { deriveWeekdayShort } from "@/lib/weekday-anchor";
import { PlanDayBreakdownSkeleton } from "@/skeletons";

interface PlanDayBreakdownCardProps {
	data: PlanDayBreakdown[];
	anchorWeekday?: number | null;
	programName?: string;
	loading?: boolean;
}

export function PlanDayBreakdownCard({
	data,
	anchorWeekday,
	programName,
	loading = false,
}: PlanDayBreakdownCardProps) {
	const { fmtWeight, weightUnit } = useUnits();

	if (loading) return <PlanDayBreakdownSkeleton rows={4} />;

	const trainingDays = data.filter((d) => !d.isRestDay);

	if (trainingDays.length === 0) {
		return (
			<Card size="sm" className="fcard-flat card-ease">
				<CardsHeader icon={LightningIcon} title="Session Breakdown" />
				<Empty className="p-6 text-center w-full">
					<EmptyHeader>
						<EmptyMedia className="ficon-box-lg">
							<LightningIcon
								className="size-6 text-primary"
								weight="duotone"
							/>
						</EmptyMedia>
						<EmptyTitle className="text-sm font-medium text-foreground">
							No active plan
						</EmptyTitle>
						<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
							Activate a plan to see a per-day breakdown of your
							sessions, volume, and best lifts.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Link
							href="/plans"
							className="text-xs font-semibold text-primary hover:underline"
						>
							Manage plans
						</Link>
					</EmptyContent>
				</Empty>
			</Card>
		);
	}

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={LightningIcon}
				title={
					<span>
						Session Breakdown
						{programName && (
							<span className="ftext-2xs fmuted ml-2 normal-case tracking-normal font-normal">
								· {programName}
							</span>
						)}
					</span>
				}
			/>

			<CardContent className="p-4 pt-1 fcol3">
				{trainingDays.map((day) => {
					const derived = deriveWeekdayShort(
						anchorWeekday ?? null,
						day.dayIndex,
					);

					return (
						<div
							key={day.dayIndex}
							className={cn(
								"fcol gap-2 border border-border/40 bg-background/50 p-3",
								day.sessionCount === 0 && "opacity-70",
							)}
						>
							{/* Day header */}
							<div className="fcb gap-2">
								<div className="fcy gap-2 min-w-0">
									<h3 className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
										{day.label}
									</h3>
									{derived && (
										<span className="ftext-2xs fmuted sh0">
											· {derived}
										</span>
									)}
								</div>
								<div className="fcy gap-1.5 sh0">
									<Badge
										variant="outline"
										className="ftext-3xs font-semibold rounded-none"
									>
										{day.sessionCount} session
										{day.sessionCount === 1 ? "" : "s"}
									</Badge>
									{day.lastTrainedDaysAgo != null && (
										<span className="ftext-2xs fmuted">
											{day.lastTrainedDaysAgo === 0
												? "today"
												: day.lastTrainedDaysAgo === 1
													? "yesterday"
													: `${day.lastTrainedDaysAgo}d ago`}
										</span>
									)}
								</div>
							</div>

							{/* Summary row */}
							{day.sessionCount > 0 && (
								<div className="grid grid-cols-3 gap-2">
									<div className="p-2 bg-background/50 border border-border/40">
										<span className="ftext-3xs fmuted fupper font-medium block">
											Best
										</span>
										<span className="text-xs font-bold text-foreground">
											{day.bestLift
												? `${fmtWeight(day.bestLift.weightKg)} ${weightUnit} × ${day.bestLift.reps}`
												: "—"}
										</span>
										{day.bestLift && (
											<p className="ftext-3xs fmuted truncate">
												{day.bestLift.exerciseName}
											</p>
										)}
									</div>
									<div className="p-2 bg-background/50 border border-border/40">
										<span className="ftext-3xs fmuted fupper font-medium block">
											Avg Vol
										</span>
										<span className="text-xs font-bold text-foreground tabular-nums">
											{fmtWeight(
												day.averageVolumeKg,
											).toLocaleString()}
											<span className="ftext-3xs fmuted ml-0.5 font-normal">
												{weightUnit}
											</span>
										</span>
									</div>
									<div className="p-2 bg-background/50 border border-border/40">
										<span className="ftext-3xs fmuted fupper font-medium block">
											Last
										</span>
										<span className="text-xs font-bold text-foreground">
											{day.lastTrainedAt ?? "—"}
										</span>
									</div>
								</div>
							)}

							{/* Recent sessions */}
							{day.recentSessions.length > 0 ? (
								<div className="fcol gap-1">
									{day.recentSessions.map((session) => (
										<Link
											key={session.id}
											href={`/workout-log/${session.id}`}
											className="fcy justify-between gap-2 px-2 py-1.5 border border-border/30 bg-card/30 hover:border-primary/40 hover:bg-card/60 transition-colors text-xs"
										>
											<div className="fcy gap-2 min-w-0">
												<span className="font-medium text-foreground sh0">
													{session.date}
												</span>
												{session.topSet && (
													<span className="fcy gap-1 fmuted truncate">
														<BarbellIcon
															className="size-3 text-primary sh0"
															weight="bold"
														/>
														<span className="truncate">
															{
																session.topSet
																	.exerciseName
															}
														</span>
														<span className="tabular-nums sh0">
															{fmtWeight(
																session.topSet
																	.weightKg,
															)}{" "}
															{weightUnit} ×{" "}
															{
																session.topSet
																	.reps
															}
														</span>
													</span>
												)}
											</div>
											<div className="fcy gap-2 sh0">
												{session.prCount > 0 && (
													<Badge
														variant="outline"
														className="h-4 px-1 ftext-3xs font-bold fupper text-primary border-primary/40"
													>
														<TrophyIcon
															className="size-2"
															weight="duotone"
														/>
														{session.prCount}
													</Badge>
												)}
												{session.totalVolumeKg > 0 && (
													<span className="text-[10px] fmuted tabular-nums">
														{fmtWeight(
															session.totalVolumeKg,
														).toLocaleString()}{" "}
														{weightUnit}
													</span>
												)}
												<CaretRightIcon className="size-3 fmuted" />
											</div>
										</Link>
									))}
								</div>
							) : (
								<p className="text-xs fmuted italic">
									No sessions logged yet. Train this day to
									start tracking.
								</p>
							)}
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
