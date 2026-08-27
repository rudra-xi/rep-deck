"use client";

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
import type { LastWorkoutSession } from "@/constants/mock-data";

interface LastWorkoutCardProps {
	data: LastWorkoutSession;
	onViewSession?: () => void;
}

export function LastWorkoutCard({ data, onViewSession }: LastWorkoutCardProps) {
	return (
		<Card
			size="sm"
			className="w-full border-secondary/50 bg-card/50 text-foreground"
		>
			{/* Card Header */}
			<CardHeader className="p-4 sm:p-6 pb-3 space-y-2">
				<div className="fwb gap-2">
					<span className="fcy gap-1.5 text-xs text-muted-foreground">
						<CalendarDotsIcon
							size={16}
							className="text-primary-foreground shrink-0"
						/>
						{data.date}
					</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={onViewSession}
						className="h-9 sm:h-10 justify-between border border-border/60 bg-muted/30 px-3.5 text-xs sm:text-sm text-muted-foreground hover:bg-muted hover:text-foreground gap-2"
					>
						<span>Open Session</span>
						<ArrowRightIcon
							size={15}
							className="text-muted-foreground"
						/>
					</Button>
				</div>

				<div className="fwrap items-center gap-2 pt-0.5">
					<Badge variant="default" className="text-xs">
						{data.programName}
					</Badge>
					<p className="text-xs sm:text-sm font-medium text-foreground truncate max-w-full">
						{data.dayName}
					</p>
				</div>
			</CardHeader>

			{/* Workout Table Section */}
			<CardContent className="p-0 sm:px-6 sm:pb-4">
				<Table className="w-full table-fixed">
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
						{data.topLifts.map((lift) => (
							<TableRow
								key={lift.id}
								className="border-border/60"
							>
								{/* Exercise Column */}
								<TableCell className="px-4 py-3 sm:px-3 text-xs sm:text-sm font-medium text-foreground">
									<div className="fcy gap-2 min-w-0">
										<div
											className={`fc sh0 border p-2 bg-primary/10 border-primary/30 ${
												lift.isPR
													? "text-muted-foreground"
													: "text-primary"
											}`}
										>
											{lift.isPR ? (
												<SparkleIcon
													className="size-4"
													weight="bold"
												/>
											) : (
												<StarFourIcon
													className="size-4"
													weight="bold"
												/>
											)}
										</div>
										<span className="truncate">
											{lift.exercise}
										</span>
										{lift.isPR && (
											<Badge
												variant="outline"
												className="sh0 gap-1 px-1.5 py-0 text-[10px] font-semibold"
											>
												<TrophyIcon
													size={10}
													weight="fill"
												/>
												<span className="mt-1">PR</span>
											</Badge>
										)}
									</div>
								</TableCell>

								{/* Weight Column */}
								<TableCell className="px-2 py-3 sm:px-3 text-right text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
									{lift.weightKg} kg
								</TableCell>

								{/* Reps Column */}
								<TableCell className="px-4 py-3 sm:px-3 text-right text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
									{lift.reps}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
