"use client";

import { CalendarDotsIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { ScheduleHeatmapDay } from "@/actions/progress";
import { CardsHeader } from "@/common";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "../ui/empty";
import { ScheduleHeatmap } from "./schedule-heatmap";

interface ScheduleHeatmapCardProps {
	data: ScheduleHeatmapDay[];
	weeks?: number;
	loading?: boolean;
	title?: string;
}

export function ScheduleHeatmapCard({
	data,
	weeks = 26,
	loading = false,
	title = "Training Consistency",
}: ScheduleHeatmapCardProps) {
	const trainedCount = data.filter((d) => d.status === "trained").length;
	const scheduledCount = data.filter(
		(d) => d.status === "trained" || d.status === "skipped",
	).length;

	const adherence =
		scheduledCount > 0
			? Math.round((trainedCount / scheduledCount) * 100)
			: 0;

	// In ScheduleHeatmapCard, before rendering
	if (data.every((d) => d.status === "skipped" || d.status === "future")) {
		return (
			<Card size="sm" className="fcard-flat card-ease">
				<CardsHeader icon={CalendarDotsIcon} title={title} />
				<CardContent className="p-4 pt-1">
					<Empty className="p-6 text-center w-full">
						<EmptyHeader>
							<EmptyTitle className="text-sm font-medium text-foreground">
								No schedule to compare against
							</EmptyTitle>
							<EmptyDescription className="text-xs fmuted max-w-sm mx-auto">
								Activate a plan and anchor it to a weekday to
								see how consistently you train.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								nativeButton={false}
								variant="outline"
								size="sm"
								className="text-xs mt-1"
								render={<Link href="/plans">Manage Plans</Link>}
							/>
						</EmptyContent>
					</Empty>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeader
				icon={CalendarDotsIcon}
				title={title}
				trailing={
					scheduledCount > 0 && (
						<span className="ftext-2xs fmuted">
							<span className="text-foreground font-semibold tabular-nums">
								{adherence}%
							</span>{" "}
							adherence
						</span>
					)
				}
			/>
			<CardContent className="p-4 pt-1 overflow-hidden">
				<ScheduleHeatmap data={data} weeks={weeks} />
			</CardContent>
		</Card>
	);
}
