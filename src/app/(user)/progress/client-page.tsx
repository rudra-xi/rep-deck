// progress/client-page.tsx
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

interface ProgressClientPageProps {
	initialStrengthOverview: any[];
	initialLiftDetails: any[];
	initialSessions: any[];
	initialFrequency: any[];
	initialBodyMetrics?: any[];
}

export default function ProgressClientPage({
	initialStrengthOverview,
	initialLiftDetails,
	initialSessions,
	initialFrequency,
	initialBodyMetrics = [],
}: ProgressClientPageProps) {
	const [timeRange, setTimeRange] = useState<"2M" | "3M" | "6M" | "1Y">("3M");

	return (
		<section className="space-y-6 sm:space-y-8 pb-12">
			{/* Page Header */}
			<PageTitleCard
				title="Progress"
				subTitle="Deep dive into your strength, size, and body composition over time"
			/>

			{/* Section 1: Body Metrics */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Body Composition" />
				<BodyMetricsCard initialData={initialBodyMetrics} />
			</div>

			<Separator />

			{/* Section 2: Strength Performance Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
				<div className="space-y-3 w-full">
					<SectionTitleCard title="Big 4 Trend" />
					<StrengthOverviewCard
						timeRange={timeRange}
						onTimeRangeChange={setTimeRange}
						initialData={initialStrengthOverview}
					/>
				</div>

				<div className="space-y-3 w-full">
					<SectionTitleCard title="Lift Details" />
					<IndividualLiftDetailsCard
						initialData={initialLiftDetails}
					/>
				</div>
			</div>

			<Separator />

			{/* Section 3: Activity & Consistency Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
				<div className="lg:col-span-2 space-y-3 order-3 lg:order-1">
					<SectionTitleCard title="Session History" />
					<SessionHistoryList initialData={initialSessions} />
				</div>

				<Separator className="block lg:hidden order-2" />

				<div className="lg:col-span-1 space-y-3 order-1 lg:order-3">
					<SectionTitleCard title="Training Frequency" />
					<TrainingFrequencyCard initialData={initialFrequency} />
				</div>
			</div>
		</section>
	);
}
