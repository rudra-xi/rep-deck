"use client";

import { useState } from "react";
import { PageTitleCard, SectionTitleCard, WeightBodyFatTrend } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	IndividualLiftDetailsCard,
	LowerBodyTrend,
	SessionHistoryList,
	StrengthOverviewCard,
	TrainingFrequencyCard,
	UpperBodyTrend,
} from "@/progress";

export default function ProgressClientPage() {
	const [timeRange, setTimeRange] = useState<"2M" | "3M" | "6M" | "1Y">("3M");

	return (
		<section className="lg:space-y-6 space-y-8">
			<PageTitleCard
				title="Progress"
				subTitle="Track strength, size, and body composition over time"
			/>

			{/* Section 1: Body Composition */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Body Composition" />
				<WeightBodyFatTrend />
			</div>

			<Separator />

			{/* Section 2: Measurements (2 charts side-by-side) */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Measurements Progress" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
					<UpperBodyTrend />
					<LowerBodyTrend />
				</div>
			</div>

			<Separator />

			{/* Section 3: Strength Performance */}
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

			<Separator />

			{/* Section 4: Activity & Consistency (combined) */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Activity & Consistency" />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
					<div className="lg:col-span-2 order-2 lg:order-1">
						<SessionHistoryList />
					</div>
					<div className="lg:col-span-1 order-1 lg:order-2">
						<TrainingFrequencyCard />
					</div>
				</div>
			</div>
		</section>
	);
}
