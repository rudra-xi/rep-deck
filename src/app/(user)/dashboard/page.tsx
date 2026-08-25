import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import { DASHBOARD_MOCK_DATA, mockLastWorkout } from "@/constants/mock-data";
import {
	ChallengeCard,
	KpiCards,
	LastWorkoutCard,
	StrengthChart,
} from "@/dashboard";

export default function Dashboard() {
	return (
		<section className="space-y-6 sm:space-y-8">
			{/* Page Header */}
			<PageTitleCard
				title="Dashboard"
				subTitle="See your progress, consistency, and current program in one place"
			/>

			{/* KPI / Quick Stats Section */}
			<div className="space-y-3">
				<SectionTitleCard title="Quick Stats" />
				<KpiCards data={DASHBOARD_MOCK_DATA.kpis} />
			</div>
			<Separator />
			<div className="space-y-3">
				<SectionTitleCard title="Daily Challenge" />
				<ChallengeCard />
			</div>
			<Separator />
			{/* Main Grid Section: Trend vs Last Session */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
				{/* Chart (Takes up 2 columns on desktop) */}
				<div className="lg:col-span-2 space-y-3">
					<SectionTitleCard title="Strength Trend" />
					<StrengthChart data={DASHBOARD_MOCK_DATA.strengthTrend} />
				</div>

				{/* Last Session Snapshot (Takes up 1 column on desktop) */}
				<div className="lg:col-span-1 space-y-3">
					<SectionTitleCard title="Last Session Snapshot" />
					<LastWorkoutCard data={mockLastWorkout} />
				</div>
			</div>
		</section>
	);
}
