"use client";

import { useEffect, useState } from "react";
import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	DataQualityCard,
	MeasurementGuide,
	MeasurementReminders,
	MuscleSizeTrend,
	QuickAddMeasurementForm,
	QuickStats,
	WeightBodyFatTrend,
} from "@/metrics";
import { getMetricsData } from "@/actions/metrics";

export function MetricsClientPage() {
	const [initialData, setInitialData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setLoading(true);
			try {
				const data = await getMetricsData("3M");
				if (isMounted) setInitialData(data);
			} finally {
				if (isMounted) setLoading(false);
			}
		}

		fetchData();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<section className="space-y-6 sm:space-y-8">
			<PageTitleCard
				title="Metrics"
				subTitle="Log your body measurements and track changes over time"
			/>

			{/* Section 1: Quick Stats */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Quick Stats" />
				<QuickStats stats={initialData?.stats} loading={loading} />
			</div>

			<Separator />

			{/* Section 2: Quick Add & Guide */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
				<div className="space-y-3 w-full">
					<SectionTitleCard title="New Measurement" />
					<QuickAddMeasurementForm />
				</div>

				<div className="space-y-3 w-full">
					<SectionTitleCard title="How to Measure" />
					<MeasurementGuide/>
				</div>
			</div>

			<Separator />

			{/* Section 3: Data Quality & Reminders */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
				<div className="space-y-3 w-full">
					<SectionTitleCard title="Data Quality" />
					<DataQualityCard
						daysSinceLastMeasurement={
							initialData?.qualityMetrics
								?.daysSinceLastMeasurement
						}
						averageGapDays={
							initialData?.qualityMetrics?.averageGapDays
						}
						loading={loading}
					/>
				</div>

				<div className="space-y-3 w-full">
					<SectionTitleCard title="Reminders" />
					<MeasurementReminders/>
				</div>
			</div>

			<Separator />

			{/* Section 4: Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
				<div className="space-y-3 w-full">
					<SectionTitleCard title="Weight & Body Fat" />
					<WeightBodyFatTrend
						initialData={initialData?.chartData || []}
						loading={loading}
					/>
				</div>

				<div className="space-y-3 w-full">
					<SectionTitleCard title="Muscle Size" />
					<MuscleSizeTrend
						initialData={initialData?.chartData || []}
						loading={loading}
					/>
				</div>
			</div>
		</section>
	);
}
