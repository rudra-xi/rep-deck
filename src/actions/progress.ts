"use server";

import { format, subDays } from "date-fns";
import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { getCurrentUser } from "@/actions/auth";
import { db } from "@/db";
import { bodyMeasurements, workoutSessions, workoutSets } from "@/db/schema";
import { type Big4Key, resolveBig4Key } from "@/lib/big4-mapping";
import { toCapitalized } from "@/lib/to-capitalized";
import type { StrengthOverviewPoint } from "@/types";

const calculateEpley1RM = (weight: number, reps: number) => {
	if (reps === 1) return weight;
	return Math.round(weight * (1 + reps / 30));
};

export async function getStrengthOverview(
	timeRange: "2M" | "3M" | "6M" | "1Y",
): Promise<StrengthOverviewPoint[]> {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return [];

		const daysMap = { "2M": 60, "3M": 90, "6M": 180, "1Y": 365 };
		const startDate = subDays(new Date(), daysMap[timeRange] || 90);

		const sets = await db
			.select({
				date: workoutSessions.date,
				exerciseName: workoutSets.exerciseName,
				weight: workoutSets.weight,
				reps: workoutSets.reps,
				rpe: workoutSets.rpe,
			})
			.from(workoutSets)
			.innerJoin(
				workoutSessions,
				eq(workoutSets.sessionId, workoutSessions.id),
			)
			.where(
				and(
					eq(workoutSessions.userId, dbUser.id),
					gte(workoutSessions.date, startDate),
				),
			)
			.orderBy(asc(workoutSessions.date));

		const aggregated: Record<
			string,
			Partial<
				Record<
					Big4Key,
					{ weight: number; reps: number; rpe: number | null }
				>
			>
		> = {};

		sets.forEach((set) => {
			const liftKey = resolveBig4Key(set.exerciseName);
			if (!liftKey) return;

			const dateStr = format(new Date(set.date), "MMM d, yyyy");
			const weight = Number(set.weight);
			const reps = set.reps;
			const rpe = set.rpe != null ? Number(set.rpe) : null;

			if (!aggregated[dateStr]) {
				aggregated[dateStr] = {};
			}

			const existing = aggregated[dateStr][liftKey];
			if (
				!existing ||
				weight > existing.weight ||
				(weight === existing.weight && reps > existing.reps)
			) {
				aggregated[dateStr][liftKey] = { weight, reps, rpe };
			}
		});

		return Object.entries(aggregated)
			.map(([date, lifts]): StrengthOverviewPoint => {
				const point: StrengthOverviewPoint = { date };
				(Object.keys(lifts) as Big4Key[]).forEach((liftKey) => {
					const entry = lifts[liftKey];
					if (!entry) return;
					point[liftKey] = entry.weight;
					point[`${liftKey}Reps`] = entry.reps;
					point[`${liftKey}Rpe`] = entry.rpe;
				});
				return point;
			})
			.sort(
				(a, b) =>
					new Date(a.date).getTime() - new Date(b.date).getTime(),
			);
	} catch (error) {
		console.error("Error fetching strength overview:", error);
		return [];
	}
}

export async function getLiftDetails(
	liftType: "bench" | "squat" | "deadlift" | "ohp",
) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return [];

		const sets = await db
			.select({
				date: workoutSessions.date,
				weight: workoutSets.weight,
				reps: workoutSets.reps,
				isPR: workoutSets.isPR,
				exerciseName: workoutSets.exerciseName,
			})
			.from(workoutSets)
			.innerJoin(
				workoutSessions,
				eq(workoutSets.sessionId, workoutSessions.id),
			)
			.where(eq(workoutSessions.userId, dbUser.id))
			.orderBy(asc(workoutSessions.date));

		const filteredSets = sets.filter(
			(s) => resolveBig4Key(s.exerciseName) === liftType,
		);

		const grouped: Record<
			string,
			{
				weight: number;
				estimated1RM: number;
				isPR: boolean;
				date: string;
			}
		> = {};

		filteredSets.forEach((s) => {
			const dateStr = format(new Date(s.date), "MMM d, yyyy");
			const weight = Number(s.weight);
			const e1rm = calculateEpley1RM(weight, s.reps);

			if (!grouped[dateStr]) {
				grouped[dateStr] = {
					date: dateStr,
					weight,
					estimated1RM: e1rm,
					isPR: Boolean(s.isPR),
				};
			} else {
				grouped[dateStr].weight = Math.max(
					grouped[dateStr].weight,
					weight,
				);
				grouped[dateStr].estimated1RM = Math.max(
					grouped[dateStr].estimated1RM,
					e1rm,
				);
				if (s.isPR) grouped[dateStr].isPR = true;
			}
		});

		return Object.values(grouped).sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	} catch (error) {
		console.error("Error fetching lift details:", error);
		return [];
	}
}

export async function getRecentSessions(limit = 5) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return [];

		const sessions = await db
			.select({
				id: workoutSessions.id,
				date: workoutSessions.date,
				dayIndex: workoutSessions.dayIndex,
			})
			.from(workoutSessions)
			.where(eq(workoutSessions.userId, dbUser.id))
			.orderBy(desc(workoutSessions.date))
			.limit(limit);

		if (sessions.length === 0) return [];

		const sessionIds = sessions.map((s) => s.id);

		const allSets = await db
			.select()
			.from(workoutSets)
			.where(inArray(workoutSets.sessionId, sessionIds));

		return sessions.map((s) => {
			const sets = allSets.filter((set) => set.sessionId === s.id);

			const totalVol: number = sets.reduce<number>(
				(acc, curr) =>
					acc + Number(curr.weight ?? 0) * (curr.reps ?? 0),
				0,
			);

			const uniqueExercises = Array.from(
				new Set(sets.map((set) => toCapitalized(set.exerciseName))),
			).slice(0, 3);

			return {
				id: s.id,
				date: format(new Date(s.date), "MMM d, yyyy"),
				programName: "Workout Session",
				dayLabel:
					s.dayIndex !== null ? `Day ${s.dayIndex + 1}` : "Custom",
				keyLiftsSummary:
					uniqueExercises.join(", ") || "No exercises logged",
				totalVolumeKg: Number(totalVol),
			};
		});
	} catch (error) {
		console.error("Error fetching recent sessions:", error);
		return [];
	}
}

export async function getTrainingFrequency() {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return [];

		const twelveWeeksAgo = subDays(new Date(), 84);

		const queryResult = await db
			.select({
				dayNum: sql<number>`EXTRACT(DOW FROM ${workoutSessions.date})::int`,
				count: sql<number>`COUNT(*)::int`,
			})
			.from(workoutSessions)
			.where(
				and(
					eq(workoutSessions.userId, dbUser.id),
					gte(workoutSessions.date, twelveWeeksAgo),
				),
			)
			.groupBy(sql`EXTRACT(DOW FROM ${workoutSessions.date})`);

		const daysMap = [
			{ day: "Mon", dow: 1 },
			{ day: "Tue", dow: 2 },
			{ day: "Wed", dow: 3 },
			{ day: "Thu", dow: 4 },
			{ day: "Fri", dow: 5 },
			{ day: "Sat", dow: 6 },
			{ day: "Sun", dow: 0 },
		];

		return daysMap.map(({ day, dow }) => {
			const match = queryResult.find((row) => row.dayNum === dow);
			return {
				day,
				sessions: match ? match.count : 0,
			};
		});
	} catch (error) {
		console.error("Error fetching training frequency:", error);
		return [];
	}
}

export async function getBodyMetrics() {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return [];

		const measurements = await db
			.select({
				date: bodyMeasurements.date,
				weight: bodyMeasurements.weightKg,
				bodyFat: bodyMeasurements.bodyFatPercent,
			})
			.from(bodyMeasurements)
			.where(eq(bodyMeasurements.userId, dbUser.id))
			.orderBy(asc(bodyMeasurements.date));

		return measurements.map((m) => ({
			date: format(new Date(m.date), "MMM d, yyyy"),
			weight: m.weight ? Number(m.weight) : null,
			bodyFat: m.bodyFat ? Number(m.bodyFat) : null,
		}));
	} catch (error) {
		console.error("Error fetching body metrics:", error);
		return [];
	}
}

export interface WeeklyRadarData {
	weekLabel: string;
	sessions: number;
	target: number;
}
