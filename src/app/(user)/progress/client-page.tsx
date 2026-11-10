"use client";

import { useState } from "react";
import type { ScheduleHeatmapDay } from "@/actions/progress";
import {
	PageTitleCard,
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
}

export default function ProgressClientPage({
	scheduleData = [],
}: ProgressClientPageProps) {
	const [timeRange, setTimeRange] = useState<"2M" | "3M" | "6M" | "1Y">("3M");

	return (
		<section className="lg:space-y-6 space-y-8">
			<PageTitleCard
				title="Progress"
				subTitle="Track strength, size, and body composition over time"
			/>

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Activity & Consistency" />
				<div className="space-y-6 w-full">
					<ScheduleHeatmapCard
						data={scheduleData}
						weeks={52}
						title="Last 52 weeks"
					/>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
						<div className="lg:col-span-2 order-2 lg:order-1">
							<SessionHistoryList />
						</div>
						<div className="lg:col-span-1 order-1 lg:order-2">
							<TrainingFrequencyCard />
						</div>
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Body Composition" />
				<WeightBodyFatTrend />
			</div>

			<Separator />

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Measurements Progress" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
					<UpperBodyTrend />
					<LowerBodyTrend />
				</div>
			</div>

			<Separator />

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
