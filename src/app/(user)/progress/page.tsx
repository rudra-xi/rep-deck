"use client";

import { useState } from "react";
import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	BodyMetricsCard,
	IndividualLiftDetailsCard,
	SessionHistoryList,
	StrengthOverviewCard,
	TrainingFrequencyCard,
} from "@/progress";

export default function ProgressPage() {
	const [timeRange, setTimeRange] = useState<"2M" | "3M" | "6M" | "1Y">("3M");

	return (
		<section className="space-y-6 sm:space-y-8 pb-12">
			{/* Page Header */}
			<PageTitleCard
				title="Progress"
				subTitle="Deep dive into your strength, size, and body composition over time."
			/>

			{/* Section 1: Big 4 Strength Overview */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Big 4 Trend" />
				<StrengthOverviewCard
					timeRange={timeRange}
					onTimeRangeChange={setTimeRange}
				/>
			</div>

			<Separator />

			{/* Section 2: Individual Lift Details */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Lift Details" />
				<IndividualLiftDetailsCard />
			</div>

			<Separator />

			{/* Section 3: Body Metrics */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Body Composition" />
				<BodyMetricsCard />
			</div>

			<Separator />

			{/* Section 4 & 5 Grid: Session History & Training Frequency */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
				<div className="lg:col-span-1 space-y-3">
					<SectionTitleCard title="Training Frequency" />
					<TrainingFrequencyCard />
				</div>

				<Separator className="block lg:hidden" />

				<div className="lg:col-span-2 space-y-3">
					<SectionTitleCard title="Session History" />
					<SessionHistoryList />
				</div>
			</div>
		</section>
	);
}
