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
	const { data, loading, refresh } = useDashboardData();

	return (
		<section className="space-y-6 sm:space-y-8">
			{/* Page Header */}
			<PageTitleCard
				title="Dashboard"
				subTitle="See your progress, consistency, and current program in one place"
			/>

			{/* KPI / Quick Stats Section */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Quick Stats" />
				<KpiCards data={data?.kpis} loading={loading} />
			</div>

			<Separator />

			{/* Daily Challenge */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Daily Challenge" />
				<ChallengeCard />
			</div>

			<Separator />

			{/* Main Grid Section: Trend vs Last Session */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
				{/* Strength Chart */}
				<div className="lg:col-span-2 space-y-3 w-full">
					<SectionTitleCard title="Strength Trend" />
					<StrengthChart
						data={data?.strengthTrend || []}
						loading={loading}
					/>
				</div>

				<Separator className="block lg:hidden" />

				{/* Last Session Snapshot */}
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
