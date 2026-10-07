"use client";

import dynamic from "next/dynamic";
import type { DayWithExercises } from "@/db/schema";
import { DayExercisesListSkeleton } from "@/skeletons";

interface DayExercisesListProps {
	day?: DayWithExercises;
	anchorWeekday?: number | null;
	loading?: boolean;
}

const DayExercisesListInner = dynamic(
	() =>
		import("./day-exercises-list-inner").then(
			(m) => m.DayExercisesListInner,
		),
	{
		ssr: false,
		loading: () => <DayExercisesListSkeleton rows={4} />,
	},
);

export function DayExercisesList(props: DayExercisesListProps) {
	return <DayExercisesListInner {...props} />;
}
