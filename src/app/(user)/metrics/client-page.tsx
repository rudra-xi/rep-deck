"use client";

import { useEffect, useState } from "react";
import { getMetricsData } from "@/actions/metrics";
import { PageTitleCard, SectionTitleCard, WeightBodyFatTrend } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	DataQualityCard,
	MeasurementGuide,
	MeasurementReminders,
	MuscleSizeTrend,
	QuickAddMeasurementForm,
	QuickStats,
} from "@/metrics";

type MetricsData = Awaited<ReturnType<typeof getMetricsData>>;

export function MetricsClientPage() {
	const [initialData, setInitialData] = useState<MetricsData>(null);
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
		<section className="lg:space-y-6 space-y-8">
			<PageTitleCard
				title="Metrics"
				subTitle="Log body measurements and follow the trend"
			/>

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Quick Stats" />
				<QuickStats stats={initialData?.stats} loading={loading} />
			</div>

			<Separator />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
				<div className="space-y-3 w-full">
					<SectionTitleCard title="New Measurement" />
					<QuickAddMeasurementForm />
				</div>

				<Separator className="block lg:hidden" />

				<div className="space-y-3 w-full">
					<SectionTitleCard title="How to Measure" />
					<MeasurementGuide />
				</div>
			</div>

			<Separator />

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Tracking Health" />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
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
					<MeasurementReminders />
				</div>
			</div>

			<Separator />

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Body Trends" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
					<WeightBodyFatTrend
						initialData={initialData?.chartData || []}
						loading={loading}
					/>
					<MuscleSizeTrend
						initialData={initialData?.chartData || []}
						loading={loading}
					/>
				</div>
			</div>
		</section>
	);
}
