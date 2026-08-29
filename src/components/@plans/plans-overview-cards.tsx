"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deletePlan } from "@/actions/plans";
import {
	CreatePlanDialog,
	DeletePlanDialog,
	DuplicatePlanDialog,
} from "@/plan-dialogs";
import {
	CaretLeftIcon,
	CaretRightIcon,
	FolderStarIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanWithStructure } from "@/types/plans";

interface PlansOverviewCardsProps {
	plans: PlanWithStructure[];
	selectedPlanId: string;
	onSelectPlan: (id: string) => void;
	onSetActivePlan: (id: string) => void;
}

interface PlanCardItemProps {
	plan: PlanWithStructure;
	isSelected: boolean;
	onSelectPlan: (id: string) => void;
	onSetActivePlan: (id: string) => void;
}

function PlanCardItem({
	plan,
	isSelected,
	onSelectPlan,
	onSetActivePlan,
}: PlanCardItemProps) {
	const router = useRouter();

	const handleDelete = async () => {
		await deletePlan(plan.id);
		router.refresh();
	};

	const formattedStartDate = plan.startDate
		? new Date(plan.startDate).toLocaleDateString("en-IN", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: "N/A";

	return (
		<Card
			size="sm"
			onClick={() => onSelectPlan(plan.id)}
			className={`relative cursor-pointer border bg-card/50 base-ease rounded-none shadow-none transition-all ${
				isSelected
					? "border-primary ring-1 ring-primary/40"
					: "border-secondary/50 hover:border-primary/50"
			}`}
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<div className="flex items-center gap-1.5">
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
						{plan.name}
					</CardTitle>
					<span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-none bg-primary/10 text-primary border border-primary/20">
						v{plan.version}
					</span>
				</div>

				<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
					<FolderStarIcon className="size-3.5" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-3 pt-1">
				<div className="flex items-center justify-between text-[11px] text-muted-foreground">
					<span>Started:</span>
					<span className="font-semibold text-foreground">
						{formattedStartDate}
					</span>
				</div>

				<div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
					<span
						className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-none border base-ease ${
							plan.active
								? "bg-primary/10 text-primary-foreground border-primary"
								: "bg-muted text-muted-foreground border-border/50"
						}`}
					>
						{plan.active ? "Active" : "Archived"}
					</span>

					{!plan.active && (
						<Button
							key={`set-active-${plan.id}-${plan.active}`}
							size="sm"
							variant="ghost"
							onClick={(e) => {
								e.stopPropagation();
								onSetActivePlan(plan.id);
							}}
							className="h-6 px-2 text-[10px] rounded-none hover:bg-primary/10 hover:text-primary"
						>
							Set Active
						</Button>
					)}
				</div>

				<div className="flex items-end justify-end gap-2">
					{/* Modularized Delete Dialog */}
					<DuplicatePlanDialog plan={plan} />
					<DeletePlanDialog
						planName={plan.name}
						onDelete={handleDelete}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export function PlansOverviewCards({
	plans,
	selectedPlanId,
	onSelectPlan,
	onSetActivePlan,
}: PlansOverviewCardsProps) {
	const activeIndex = useMemo(() => {
		const idx = plans.findIndex((p) => p.active);
		return idx !== -1 ? idx : 0;
	}, [plans]);

	const totalItems = plans.length + 1;
	const [mobileIndex, setMobileIndex] = useState<number>(0);

	const currentMobilePlan = mobileIndex > 0 ? plans[mobileIndex - 1] : null;

	return (
		<div className="space-y-3">
			{/* Mobile View */}
			<div className="block md:hidden space-y-2">
				<div className="fcb px-1">
					<span />
					<div className="fcx gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={mobileIndex === 0}
							onClick={() =>
								setMobileIndex((prev) => Math.max(0, prev - 1))
							}
						>
							<CaretLeftIcon size={14} />
						</Button>
						<span className="text-[11px] font-medium text-foreground min-w-16 text-center mt-1.5">
							{mobileIndex + 1} of {totalItems}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={mobileIndex === totalItems - 1}
							onClick={() =>
								setMobileIndex((prev) =>
									Math.min(totalItems - 1, prev + 1),
								)
							}
						>
							<CaretRightIcon size={14} />
						</Button>
					</div>
				</div>

				{mobileIndex === 0 ? (
					<CreatePlanDialog />
				) : (
					currentMobilePlan && (
						<PlanCardItem
							plan={currentMobilePlan}
							isSelected={currentMobilePlan.id === selectedPlanId}
							onSelectPlan={onSelectPlan}
							onSetActivePlan={onSetActivePlan}
						/>
					)
				)}
			</div>

			{/* Desktop View */}
			<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
				<CreatePlanDialog />

				{plans.map((plan) => (
					<PlanCardItem
						key={plan.id}
						plan={plan}
						isSelected={plan.id === selectedPlanId}
						onSelectPlan={onSelectPlan}
						onSetActivePlan={onSetActivePlan}
					/>
				))}
			</div>
		</div>
	);
}
