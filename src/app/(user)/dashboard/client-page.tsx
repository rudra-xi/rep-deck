"use client";

import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	ChallengeCard,
	KpiCards,
	LastWorkoutCard,
	StrengthChart,
} from "@/dashboard";
import { useDashboardData } from "@/hooks";

export function DashboardClientPage() {
	const { data, loading } = useDashboardData();

	return (
		<section className="lg:space-y-6 space-y-8">
			<PageTitleCard
				title="Dashboard"
				subTitle="Your training at a glance — program, progress, and recent activity"
			/>

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Quick Stats" />
				<KpiCards data={data?.kpis} loading={loading} />
			</div>

			<Separator />

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Daily Challenge" />
				<ChallengeCard />
			</div>

			<Separator />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
				<div className="lg:col-span-2 space-y-3 w-full">
					<SectionTitleCard title="Strength Trend" />
					<StrengthChart
						data={data?.strengthTrend || []}
						loading={loading}
					/>
				</div>

				<Separator className="block lg:hidden" />

				<div className="lg:col-span-1 space-y-3 w-full">
					<SectionTitleCard title="Last Session Snapshot" />
					<LastWorkoutCard
						data={data?.lastWorkout}
						loading={loading}
					/>
				</div>
			</div>
		</section>
	);
}
