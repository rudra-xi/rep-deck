"use client";

import { useState } from "react";
import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import { PLANS_MOCK_DATA, type Plan } from "@/constants/mock-data";
import {
	DayExercisesList,
	PlanDetailsCard,
	PlanSettingsCard,
	PlansOverviewCards,
} from "@/plans";

export default function PlansPage() {
	const [plans, setPlans] = useState<Plan[]>(PLANS_MOCK_DATA);
	const [selectedPlanId, setSelectedPlanId] = useState<string>("v3");
	const [selectedDayId, setSelectedDayId] = useState<number>(1);

	const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
	const selectedDay =
		activePlan.days.find((d) => d.id === selectedDayId) ||
		activePlan.days[0];

	const handleSetActivePlan = (id: string) => {
		setPlans((prev) =>
			prev.map((plan) => ({
				...plan,
				isActive: plan.id === id,
			})),
		);
	};

	return (
		<section className="space-y-6 sm:space-y-8 pb-12">
			{/* Page Header */}
			<PageTitleCard
				title="Plans"
				subTitle="Manage your training blocks and switch between plan versions"
			/>

			{/* Section 1: Plans Overview */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Your Plans" />
				<PlansOverviewCards
					plans={plans}
					selectedPlanId={selectedPlanId}
					onSelectPlan={(id) => {
						setSelectedPlanId(id);
						setSelectedDayId(1);
					}}
					onSetActivePlan={handleSetActivePlan}
				/>
			</div>

			<Separator />

			{/* Section 2 & 3 Grid: Plan Structure vs Day Exercises */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
				{/* Plan Details (1 Col) */}
				<div className="lg:col-span-1 space-y-3">
					<SectionTitleCard title="Plan Structure" />
					<PlanDetailsCard
						plan={activePlan}
						selectedDayId={selectedDayId}
						onSelectDay={setSelectedDayId}
					/>
				</div>
				
			<Separator className="block lg:hidden"/>

				{/* Day Exercises (2 Cols) */}
				<div className="lg:col-span-2 space-y-3">
					<SectionTitleCard title="Day Exercises" />
					<DayExercisesList day={selectedDay} />
				</div>
			</div>

			<Separator />

			{/* Section 4: Settings */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Plan Settings" />
				<PlanSettingsCard plan={activePlan} />
			</div>
		</section>
	);
}
