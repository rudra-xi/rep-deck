"use client";

import type { ScheduleHeatmapDay } from "@/actions/progress";
import { PageTitleCard, ScheduleHeatmapCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	KpiCards,
	LastWorkoutCard,
	StrengthChart,
} from "@/dashboard";
import { useDashboardData } from "@/hooks";

interface DashboardClientPageProps {
	initialData?: Awaited<
		ReturnType<typeof import("@/actions/dashboard").getDashboardData>
	>;
	scheduleData?: ScheduleHeatmapDay[];
}

export function DashboardClientPage({
	initialData,
	scheduleData,
}: DashboardClientPageProps) {
	const { data, loading } = useDashboardData();

	return (
		<section className="lg:space-y-6 space-y-8">
			<PageTitleCard
				title="Dashboard"
				subTitle="Your training at a glance — program, progress, and recent activity"
			/>

			{/* Quick Stats */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Quick Stats" />
				<KpiCards data={data?.kpis} loading={loading} />
			</div>

			<Separator />

			{/* Schedule Heatmap — full width, own row */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Training Consistency" />
				<ScheduleHeatmapCard
					data={scheduleData ?? []}
					weeks={24}
					title="Last 24 weeks"
				/>
			</div>

			<Separator />

			{/* Strength trend + Last workout */}
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
					<SectionTitleCard title="Last Session" />
					<LastWorkoutCard
						data={data?.lastWorkout}
						loading={loading}
					/>
				</div>
			</div>
		</section>
	);
}
