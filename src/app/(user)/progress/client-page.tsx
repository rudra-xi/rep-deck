"use client";

import { useState } from "react";
import type { PlanDayBreakdown, ScheduleHeatmapDay } from "@/actions/progress";
import {
	PageTitleCard,
	PlanDayBreakdownCard,
	ScheduleHeatmapCard,
	SectionTitleCard,
	WeightBodyFatTrend,
} from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	IndividualLiftDetailsCard,
	LowerBodyTrend,
	SessionHistoryList,
	StrengthOverviewCard,
	TrainingFrequencyCard,
	UpperBodyTrend,
} from "@/progress";

interface ProgressClientPageProps {
	scheduleData?: ScheduleHeatmapDay[];
	initialBreakdown?: PlanDayBreakdown[];
	anchorWeekday?: number | null;
	programName?: string;
}

export default function ProgressClientPage({
	scheduleData = [],
	initialBreakdown = [],
	anchorWeekday = null,
	programName,
}: ProgressClientPageProps) {
	const [timeRange, setTimeRange] = useState<"2M" | "3M" | "6M" | "1Y">("3M");

	return (
		<section className="lg:space-y-6 space-y-8">
			<PageTitleCard
				title="Progress"
				subTitle="Track strength, size, and body composition over time"
			/>

			{/* ── Activity & Consistency ─────────────────────────── */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Activity & Consistency" />

				<div className="space-y-6 w-full">
					{/* Row 1: Breakdown (2 cols) + Right column (Heatmap + Frequency) */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
						<div className="lg:col-span-2">
							<PlanDayBreakdownCard
								data={initialBreakdown}
								anchorWeekday={anchorWeekday}
								programName={programName}
							/>
						</div>
						<div className="lg:col-span-1 min-w-0 flex flex-col gap-6">
							<ScheduleHeatmapCard
								data={scheduleData}
								weeks={52}
								title="Last 52 weeks"
							/>
							<TrainingFrequencyCard />
						</div>
					</div>

					{/* Row 2: Session History full width */}
					<SessionHistoryList />
				</div>
			</div>

			<Separator />

			{/* ── Body Composition ───────────────────────────────── */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Body Composition" />
				<WeightBodyFatTrend />
			</div>

			<Separator />

			{/* ── Measurements Progress ──────────────────────────── */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Measurements Progress" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
					<UpperBodyTrend />
					<LowerBodyTrend />
				</div>
			</div>

			<Separator />

			{/* ── Strength Performance ───────────────────────────── */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Strength Performance" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
					<StrengthOverviewCard
						timeRange={timeRange}
						onTimeRangeChange={setTimeRange}
					/>
					<IndividualLiftDetailsCard />
				</div>
			</div>
		</section>
	);
}
