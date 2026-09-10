// actions/progress.ts
"use server";

import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { workoutSessions, workoutSets, bodyMeasurements } from "@/db/schema";
import { getCurrentUser } from "@/actions/auth";
import { subDays, format } from "date-fns";
import { toCapitalized } from "@/lib/to-capitalized";

// Reference current date aligned to Sep 10, 2026
const CURRENT_DATE = new Date(2026, 8, 10);

// Helper to estimate 1RM using the Epley formula
const calculateEpley1RM = (weight: number, reps: number) => {
	if (reps === 1) return weight;
	return Math.round(weight * (1 + reps / 30));
};

// 1. Get Big 4 Combined Trend Data
export async function getStrengthOverview(
	timeRange: "2M" | "3M" | "6M" | "1Y",
) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return [];

		const daysMap = { "2M": 60, "3M": 90, "6M": 180, "1Y": 365 };
		const startDate = subDays(CURRENT_DATE, daysMap[timeRange] || 90);

		const sets = await db
			.select({
				date: workoutSessions.date,
				exerciseName: workoutSets.exerciseName,
				weight: workoutSets.weight,
				reps: workoutSets.reps,
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

		const aggregated: Record<string, Record<string, number>> = {};

		sets.forEach((set) => {
			const dateStr = format(new Date(set.date), "MMM d");
			const name = set.exerciseName.toLowerCase();

			let liftKey: string | null = null;
			if (name.includes("bench")) liftKey = "bench";
			else if (name.includes("squat")) liftKey = "squat";
			else if (name.includes("deadlift")) liftKey = "deadlift";
			else if (name.includes("ohp") || name.includes("overhead press"))
				liftKey = "ohp";

			if (liftKey) {
				const e1rm = calculateEpley1RM(Number(set.weight), set.reps);
				if (!aggregated[dateStr]) aggregated[dateStr] = {};
				aggregated[dateStr][liftKey] = Math.max(
					aggregated[dateStr][liftKey] || 0,
					e1rm,
				);
			}
		});

		return Object.entries(aggregated).map(([date, lifts]) => ({
			date,
			...lifts,
		}));
	} catch (error) {
		console.error("Error fetching strength overview:", error);
		return [];
	}
}

// 2. Get Individual Lift Progression Data
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

		const filteredSets = sets.filter((s) => {
			const name = s.exerciseName.toLowerCase();
			if (liftType === "ohp") {
				return name.includes("ohp") || name.includes("overhead press");
			}
			return name.includes(liftType);
		});

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
			const dateStr = format(new Date(s.date), "MMM d");
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

		return Object.values(grouped);
	} catch (error) {
		console.error("Error fetching lift details:", error);
		return [];
	}
}

// 3. Get Recent Past Sessions (Optimized batch query to avoid N+1)
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

			const totalVol = sets.reduce(
				(acc, curr) => acc + Number(curr.weight) * curr.reps,
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
				totalVolume: `${totalVol.toLocaleString()} kg`,
			};
		});
	} catch (error) {
		console.error("Error fetching recent sessions:", error);
		return [];
	}
}

// 4. Get Training Frequency
export async function getTrainingFrequency() {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return [];

		const twelveWeeksAgo = subDays(CURRENT_DATE, 84);

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

// 5. Get Body Metrics
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
			date: format(new Date(m.date), "MMM d"),
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
