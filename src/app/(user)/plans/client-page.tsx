"use client";

import { NotePencilIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { setActivePlan } from "@/actions/plans";
import { PageTitleCard, SectionTitleCard } from "@/common";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import type { PlanWithStructure } from "@/db/schema";
import { CreatePlanDialog } from "@/plan-dialogs";
import {
	DayExercisesList,
	PlanDetailsCard,
	PlanSettingsCard,
	PlansOverviewCards,
} from "@/plans";

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

	useEffect(() => {
		setPlans(initialPlans);

		const currentPlanExists = initialPlans.some(
			(p) => p.id === selectedPlanId,
		);
		const targetPlanId = currentPlanExists
			? selectedPlanId
			: initialPlans[0]?.id || "";

		setSelectedPlanId(targetPlanId);

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
		setPlans((prev) =>
			prev.map((plan) => ({
				...plan,
				active: plan.id === id,
			})),
		);

		const res = await setActivePlan(id);
		if (!res?.success) {
			setPlans(initialPlans);
		}
	};

	if (!activePlan) {
		return (
			<section className="space-y-6 py-12 text-center max-w-md mx-auto">
				<PageTitleCard
					title="Plans"
					subTitle="Manage your training blocks and switch between plan versions"
				/>
				<Empty className="border border-dashed border-border/80 bg-card/30 p-8 items-stretch text-center">
					<EmptyHeader className="items-center">
						<EmptyMedia className="fc border border-primary/30 bg-primary/10 p-2 text-primary sh0">
							<NotePencilIcon
								className="size-6 text-primary"
								weight="light"
							/>
						</EmptyMedia>
						<EmptyTitle>No Training Plans</EmptyTitle>
						<EmptyDescription>
							You don't have any training plans yet. Create your
							first plan to start building your workout structure!
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent className="w-full items-stretch">
						<CreatePlanDialog />
					</EmptyContent>
				</Empty>
			</section>
		);
	}

	return (
		<section className="lg:space-y-6 space-y-8">
			<PageTitleCard
				title="Plans"
				subTitle="Build, version, and switch between training programs"
			/>

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

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Plan Structure" />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
					<div className="lg:col-span-1 space-y-3 w-full">
						<PlanDetailsCard
							plan={activePlan}
							selectedDayId={selectedDayId}
							onSelectDay={setSelectedDayId}
						/>
					</div>

					<div className="lg:col-span-2 space-y-3 w-full">
						<DayExercisesList
							day={selectedDay}
							anchorWeekday={activePlan.anchorWeekday}
						/>
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Plan Settings" />
				<PlanSettingsCard plan={activePlan} />
			</div>
		</section>
	);
}
