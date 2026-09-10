"use client";

import { useEffect } from "react";
import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	ActiveSessionSummary,
	DaySelector,
	PlannedExercises,
	QuickAddExtra,
} from "@/workout-log";
import { useWorkoutDraft, useExerciseInputs } from "@/hooks";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { FilePlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { LoggedSet } from "@/types";

interface WorkoutLogClientViewProps {
	initialPlan: any;
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

	// Get clearInputs from useExerciseInputs
	const { clearInputs } = useExerciseInputs();

	const currentDay = initialPlan?.days?.find(
		(d: any) => d.dayIndex === selectedDayIndex,
	);

	// Update plan if it changes
	useEffect(() => {
		const dayExists = initialPlan?.days?.some(
			(d: any) => d.dayIndex === selectedDayIndex,
		);
		if (!dayExists && initialPlan?.days?.length) {
			setSelectedDayIndex(initialPlan.days[0].dayIndex);
		}
	}, [initialPlan, selectedDayIndex, setSelectedDayIndex]);

	// Batch add handler when "Done" is clicked on an exercise
	const handleAddExerciseSets = (
		newSets: Array<Omit<LoggedSet, "id"> & { templateId?: string }>,
	) => {
		if (!newSets.length) return;

		const targetTemplateId = newSets[0].templateId;
		const exerciseName = newSets[0].exerciseName;

		setLoggedSets((prevSets) => {
			// Remove previous sets for this template/exercise to avoid duplicates
			const filtered = prevSets.filter((s) => {
				if (targetTemplateId && s.templateId) {
					return s.templateId !== targetTemplateId;
				}
				return (
					s.exerciseName.trim().toLowerCase() !==
					exerciseName.trim().toLowerCase()
				);
			});

			// Assign unique IDs to the new sets
			const formattedSets: LoggedSet[] = newSets.map((s, index) => ({
				...s,
				id: `${s.templateId || s.exerciseName}-${s.setNumber || index + 1}-${Date.now()}`,
			}));

			return [...filtered, ...formattedSets];
		});
	};

	// Remove handler when an exercise is unmarked "Done"
	const handleRemoveExerciseSets = (templateId: string) => {
		setLoggedSets((prevSets) =>
			prevSets.filter((s) => s.templateId !== templateId),
		);
	};

	// Combined clear function - clears both draft and exercise inputs
	const handleClearDraft = () => {
		clearDraft(); // Clears workout draft state
		clearInputs(); // Explicitly clear exercise inputs
	};

	// Empty state
	if (!initialPlan) {
		return (
			<section className="space-y-6 py-12 text-center max-w-md mx-auto">
				<PageTitleCard
					title="Workout"
					subTitle="Log today's session with your current plan and last lifts"
				/>
				<Empty className="border border-dashed border-border/80 bg-card/30 p-8">
					<EmptyHeader>
						<EmptyMedia className="fc border border-primary/30 bg-primary/10 p-2 text-primary shrink-0">
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
		<section className="space-y-6 sm:space-y-8">
			<PageTitleCard
				title="Workout"
				subTitle="Log today's session with your current plan and last lifts"
			/>

			{/* Day Selector */}
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

			{/* Planned Exercises */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Session Workflow" />
				<PlannedExercises
					exercises={currentDay?.exercises || []}
					onAddExerciseSets={handleAddExerciseSets}
					onRemoveExerciseSets={handleRemoveExerciseSets}
				/>
			</div>

			<Separator />

			{/* Summary & Quick Add */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
				<div className="lg:col-span-2 space-y-3 w-full order-3 lg:order-1">
					<SectionTitleCard title="Live Log" />
					<ActiveSessionSummary
						loggedSets={loggedSets}
						notes={notes}
						setNotes={setNotes}
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
