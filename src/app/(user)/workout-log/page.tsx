"use client";

import { useState } from "react";
import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	ActiveSessionSummary,
	DaySelector,
	PlannedExercises,
	QuickAddExtra,
} from "@/workout-log";
import type { LoggedSet } from "@/types";

export default function WorkoutLog() {
	const [selectedDay, setSelectedDay] = useState<number>(1);
	const [loggedSets, setLoggedSets] = useState<LoggedSet[]>([]);

	const handleAddSet = (newSet: Omit<LoggedSet, "id">) => {
		setLoggedSets((prev) => [
			...prev,
			{ ...newSet, id: crypto.randomUUID() },
		]);
	};

	return (
		<section className="space-y-6 sm:space-y-8">
			{/* Page Header */}
			<PageTitleCard
				title="Workout"
				subTitle="Log today’s session with your current plan and last lifts"
			/>

			{/* Section 1: Program & Day Selector */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Current Plan" />
				<DaySelector
					selectedDay={selectedDay}
					onSelectDay={setSelectedDay}
				/>
			</div>

			<Separator />

			{/* Section 2: Planned Exercises */}
			<div className="space-y-3">
				<SectionTitleCard title="Session Workflow" />
				<PlannedExercises
					selectedDay={selectedDay}
					onAddSet={handleAddSet}
				/>
			</div>

			<Separator />

			{/* Grid Section: Live Log vs Quick Add Extras */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
				{/* Active Session Summary (Takes up 2 columns on desktop) */}
				<div className="lg:col-span-2 space-y-3">
					<SectionTitleCard title="Live Log" />
					<ActiveSessionSummary loggedSets={loggedSets} />
				</div>
				
				<Separator className="block lg:hidden"/>

				{/* Quick Add Extras (Takes up 1 column on desktop) */}
				<div className="lg:col-span-1 space-y-3">
					<SectionTitleCard title="Ad-hoc Work" />
					<QuickAddExtra onAddSet={handleAddSet} />
				</div>
			</div>
		</section>
	);
}
