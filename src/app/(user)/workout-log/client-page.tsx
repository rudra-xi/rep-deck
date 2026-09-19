"use client";

import { FilePlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect } from "react";
import { PageTitleCard, SectionTitleCard } from "@/common";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import {
	useExerciseInputs,
	useExercisePerformance,
	useWorkoutDraft,
} from "@/hooks";
import type { LoggedSet } from "@/types";
import type { PlanWithStructure } from "@/types/plans";
import {
	ActiveSessionSummary,
	DaySelector,
	PlannedExercises,
	QuickAddExtra,
} from "@/workout-log";

interface WorkoutLogClientViewProps {
	initialPlan: PlanWithStructure | null;
}

export default function WorkoutLogClientView({
	initialPlan,
}: WorkoutLogClientViewProps) {
	const {
		loggedSets,
		setLoggedSets,
		notes,
		setNotes,
		selectedDayIndex,
		setSelectedDayIndex,
		addSet,
		clearDraft,
	} = useWorkoutDraft(initialPlan?.days?.[0]?.dayIndex || 1);

	const { clearInputs } = useExerciseInputs();

	const currentDay = initialPlan?.days?.find(
		(d) => d.dayIndex === selectedDayIndex,
	);

	const { performanceMap, isLoading: isLoadingPerformance } =
		useExercisePerformance(currentDay?.exercises ?? []);

	useEffect(() => {
		const dayExists = initialPlan?.days?.some(
			(d) => d.dayIndex === selectedDayIndex,
		);
		if (!dayExists && initialPlan?.days?.length) {
			setSelectedDayIndex(initialPlan.days[0].dayIndex);
		}
	}, [initialPlan, selectedDayIndex, setSelectedDayIndex]);

	const handleAddExerciseSets = (
		newSets: Array<Omit<LoggedSet, "id"> & { templateId?: string }>,
	) => {
		if (!newSets.length) return;

		const targetTemplateId = newSets[0].templateId;
		const exerciseName = newSets[0].exerciseName;

		setLoggedSets((prevSets) => {
			const filtered = prevSets.filter((s) => {
				if (targetTemplateId && s.templateId) {
					return s.templateId !== targetTemplateId;
				}
				return (
					s.exerciseName.trim().toLowerCase() !==
					exerciseName.trim().toLowerCase()
				);
			});

			const formattedSets: LoggedSet[] = newSets.map((s, index) => ({
				...s,
				id: `${s.templateId || s.exerciseName}-${s.setNumber || index + 1}-${Date.now()}`,
			}));

			return [...filtered, ...formattedSets];
		});
	};

	const handleRemoveExerciseSets = (templateId: string) => {
		setLoggedSets((prevSets) =>
			prevSets.filter((s) => s.templateId !== templateId),
		);
	};

	const handleClearDraft = () => {
		clearDraft();
		clearInputs();
	};

	if (!initialPlan) {
		return (
			<section className="space-y-6 py-12 text-center max-w-md mx-auto">
				<PageTitleCard
					title="Workout"
					subTitle="Log today's session with your current plan and last lifts"
				/>
				<Empty className="border border-dashed border-border/80 bg-card/30 p-8">
					<EmptyHeader>
						<EmptyMedia className="fc border border-primary/30 bg-primary/10 p-2 text-primary sh0">
							<FilePlusIcon
								className="size-6 text-primary"
								weight="light"
							/>
						</EmptyMedia>
						<EmptyTitle>No Active Plan</EmptyTitle>
						<EmptyDescription>
							No active workout plan found. Please activate a
							training plan from your Plans tab to start logging!
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							nativeButton={false}
							variant="link"
							size="sm"
							className="rounded-none cursor-pointer"
							render={<Link href="/plans">Activate a Plan</Link>}
						/>
					</EmptyContent>
				</Empty>
			</section>
		);
	}

	return (
		<section className="lg:space-y-6 space-y-8">
			<PageTitleCard
				title="Workout Log"
				subTitle="Log today's session — sets, reps, and notes as you train"
			/>

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Current Plan" />
				<DaySelector
					programName={initialPlan.name}
					days={initialPlan.days || []}
					selectedDayIndex={selectedDayIndex}
					onSelectDay={setSelectedDayIndex}
				/>
			</div>

			<Separator />

			<div className="space-y-3 w-full">
				<SectionTitleCard title="Session Workflow" />
				<PlannedExercises
					exercises={currentDay?.exercises || []}
					performanceMap={performanceMap}
					isLoadingPerformance={isLoadingPerformance}
					onAddExerciseSets={handleAddExerciseSets}
					onRemoveExerciseSets={handleRemoveExerciseSets}
				/>
			</div>

			<Separator />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
				<div className="lg:col-span-2 space-y-3 w-full order-3 lg:order-1">
					<SectionTitleCard title="Live Log" />
					<ActiveSessionSummary
						loggedSets={loggedSets}
						notes={notes}
						setNotes={setNotes}
						performanceMap={performanceMap}
						programId={initialPlan.id}
						dayIndex={selectedDayIndex}
						onSuccess={handleClearDraft}
					/>
				</div>

				<Separator className="block lg:hidden order-2" />

				<div className="lg:col-span-1 space-y-3 w-full order-1 lg:order-2">
					<SectionTitleCard title="Ad-hoc Work" />
					<QuickAddExtra
						plannedExercises={currentDay?.exercises || []}
						onAddSet={addSet}
					/>
				</div>
			</div>
		</section>
	);
}
