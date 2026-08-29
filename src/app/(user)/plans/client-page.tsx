"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { setActivePlan } from "@/actions/plans";
import { PageTitleCard, SectionTitleCard } from "@/common";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	DayExercisesList,
	PlanDetailsCard,
	PlanSettingsCard,
	PlansOverviewCards,
} from "@/plans";
import { CreatePlanDialog } from "@/plan-dialogs";
import type { PlanWithStructure } from "@/types/plans";

interface PlansClientViewProps {
	initialPlans: PlanWithStructure[];
}

export default function PlansClientView({
	initialPlans,
}: PlansClientViewProps) {
	const [plans, setPlans] = useState<PlanWithStructure[]>(initialPlans);
	const [selectedPlanId, setSelectedPlanId] = useState<string>(
		initialPlans[0]?.id || "",
	);
	const [selectedDayId, setSelectedDayId] = useState<string>(
		initialPlans[0]?.days[0]?.id || "",
	);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Sync local state whenever server props (initialPlans) change via revalidation
	useEffect(() => {
		setPlans(initialPlans);

		// Fallback for selected plan if current selection was deleted or if first plan was just created
		const currentPlanExists = initialPlans.some(
			(p) => p.id === selectedPlanId,
		);
		const targetPlanId = currentPlanExists
			? selectedPlanId
			: initialPlans[0]?.id || "";

		setSelectedPlanId(targetPlanId);

		// Fallback for selected day
		const active = initialPlans.find((p) => p.id === targetPlanId);
		const currentDayExists = active?.days.some(
			(d) => d.id === selectedDayId,
		);

		if (!currentDayExists && active?.days.length) {
			setSelectedDayId(active.days[0].id);
		}
	}, [initialPlans, selectedPlanId, selectedDayId]);

	const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
	const selectedDay =
		activePlan?.days.find((d) => d.id === selectedDayId) ||
		activePlan?.days[0];

	const handleSetActivePlan = async (id: string) => {
		// Optimistic UI update
		setPlans((prev) =>
			prev.map((plan) => ({
				...plan,
				active: plan.id === id,
			})),
		);

		// Persist to Database
		const res = await setActivePlan(id);
		if (!res?.success) {
			// Revert state if backend call fails
			setPlans(initialPlans);
		}
	};

	// --- EMPTY STATE FOR NEW USERS ---
	if (!activePlan) {
		return (
			<section className="space-y-6 py-12 text-center max-w-md mx-auto">
				<PageTitleCard
					title="Plans"
					subTitle="Manage your training blocks and switch between plan versions"
				/>
				<div className="p-8 border border-dashed border-border/80 bg-card/30 space-y-4">
					<p className="text-sm text-muted-foreground">
						You don't have any training plans yet. Create your first
						plan to start building your workout structure!
					</p>

					<CreatePlanDialog
						open={isCreateModalOpen}
						onOpenChange={setIsCreateModalOpen}
					/>
				</div>
			</section>
		);
	}

	return (
		<section className="space-y-6 sm:space-y-8">
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
						const plan = plans.find((p) => p.id === id);
						if (plan?.days.length) {
							setSelectedDayId(plan.days[0].id);
						}
					}}
					onSetActivePlan={handleSetActivePlan}
				/>
			</div>

			<Separator />

			{/* Section 2 & 3 Grid: Plan Structure vs Day Exercises */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
				{/* Plan Details (1 Col) */}
				<div className="lg:col-span-1 space-y-3 w-full">
					<SectionTitleCard title="Plan Structure" />
					<PlanDetailsCard
						plan={activePlan}
						selectedDayId={selectedDayId}
						onSelectDay={setSelectedDayId}
					/>
				</div>

				<Separator className="block lg:hidden" />

				{/* Day Exercises (2 Cols) */}
				<div className="lg:col-span-2 space-y-3 w-full">
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
