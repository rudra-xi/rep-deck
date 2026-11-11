"use server";

import { format, isAfter, startOfDay, subDays } from "date-fns";
import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { getCurrentUser } from "@/actions/auth";
import { db } from "@/db";
import {
	bodyMeasurements,
	programDayTemplates,
	programTemplates,
	workoutSessions,
	workoutSets,
} from "@/db/schema";
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
				programId: workoutSessions.programId,
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

		const programIds = Array.from(
			new Set(
				sessions
					.map((s) => s.programId)
					.filter((id): id is string => id != null),
			),
		);

		const dayRows = programIds.length
			? await db
					.select({
						programId: programDayTemplates.programId,
						dayIndex: programDayTemplates.dayIndex,
						label: programDayTemplates.label,
					})
					.from(programDayTemplates)
					.where(inArray(programDayTemplates.programId, programIds))
			: [];

		const dayLabelMap = new Map<string, string>();
		for (const row of dayRows) {
			dayLabelMap.set(
				`${row.programId}:${row.dayIndex}`,
				toCapitalized(row.label),
			);
		}

		const programRows = programIds.length
			? await db
					.select({
						id: programTemplates.id,
						name: programTemplates.name,
					})
					.from(programTemplates)
					.where(inArray(programTemplates.id, programIds))
			: [];

		const programNameMap = new Map<string, string>();
		for (const row of programRows) {
			programNameMap.set(row.id, toCapitalized(row.name));
		}

		return sessions.map((s) => {
			const sets = allSets.filter((set) => set.sessionId === s.id);

			const weightedSets = sets.filter(
				(set) => Number(set.weight ?? 0) > 0,
			);
			const bodyweightSets = sets.filter(
				(set) => Number(set.weight ?? 0) <= 0,
			);

			const totalVolumeKg = weightedSets.reduce(
				(acc, curr) => acc + Number(curr.weight) * (curr.reps ?? 0),
				0,
			);

			const totalReps = bodyweightSets.reduce(
				(acc, curr) => acc + (curr.reps ?? 0),
				0,
			);

			const uniqueExercises = Array.from(
				new Set(sets.map((set) => toCapitalized(set.exerciseName))),
			).slice(0, 3);

			let dayLabel = "Custom";
			if (s.programId != null && s.dayIndex != null) {
				const found = dayLabelMap.get(`${s.programId}:${s.dayIndex}`);
				dayLabel = found ?? `Day ${s.dayIndex}`;
			}

			const programName =
				s.programId != null
					? (programNameMap.get(s.programId) ?? "Workout Session")
					: "Workout Session";

			return {
				id: s.id,
				date: format(new Date(s.date), "EEE, MMM d, yyyy"),
				programName,
				dayLabel,
				keyLiftsSummary:
					uniqueExercises.join(", ") || "No exercises logged",
				totalVolumeKg: Number(totalVolumeKg),
				totalReps,
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
			{ day: "Sun", dow: 0 },
			{ day: "Mon", dow: 1 },
			{ day: "Tue", dow: 2 },
			{ day: "Wed", dow: 3 },
			{ day: "Thu", dow: 4 },
			{ day: "Fri", dow: 5 },
			{ day: "Sat", dow: 6 },
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

export type HeatmapDayStatus = "trained" | "rest" | "skipped" | "future";

export interface ScheduleHeatmapDay {
	date: string;
	status: HeatmapDayStatus;
	sessionsCount: number;
	scheduledDayLabel?: string;
}

export async function getScheduleHeatmap(
	weeks = 26,
): Promise<ScheduleHeatmapDay[]> {
	const { dbUser } = await getCurrentUser();
	if (!dbUser) return [];

	const [activePlan] = await db
		.select({
			id: programTemplates.id,
			anchorWeekday: programTemplates.anchorWeekday,
		})
		.from(programTemplates)
		.where(
			and(
				eq(programTemplates.userId, dbUser.id),
				eq(programTemplates.active, true),
			),
		)
		.limit(1);

	let planDays: Array<{
		dayIndex: number;
		isRestDay: boolean;
		label: string;
	}> = [];

	if (activePlan) {
		planDays = await db
			.select({
				dayIndex: programDayTemplates.dayIndex,
				isRestDay: programDayTemplates.isRestDay,
				label: programDayTemplates.label,
			})
			.from(programDayTemplates)
			.where(eq(programDayTemplates.programId, activePlan.id));
	}

	const weekdayInfo = new Map<number, { isRest: boolean; label: string }>();

	if (activePlan && activePlan.anchorWeekday != null) {
		for (const d of planDays) {
			const weekday = (activePlan.anchorWeekday + d.dayIndex - 1) % 7;
			weekdayInfo.set(weekday, {
				isRest: d.isRestDay,
				label: d.label,
			});
		}
	}

	const startDate = subDays(new Date(), weeks * 7 + 7);

	const sessionRows = await db
		.select({ date: workoutSessions.date })
		.from(workoutSessions)
		.where(
			and(
				eq(workoutSessions.userId, dbUser.id),
				gte(workoutSessions.date, startDate),
			),
		);

	const sessionsByDate = new Map<string, number>();
	for (const row of sessionRows) {
		const iso = format(new Date(row.date), "yyyy-MM-dd");
		sessionsByDate.set(iso, (sessionsByDate.get(iso) ?? 0) + 1);
	}

	const today = startOfDay(new Date());
	const result: ScheduleHeatmapDay[] = [];

	for (let i = weeks * 7 + 6; i >= 0; i--) {
		const date = subDays(today, i);
		const iso = format(date, "yyyy-MM-dd");
		const weekday = date.getDay();

		if (isAfter(date, today)) {
			result.push({ date: iso, status: "future", sessionsCount: 0 });
			continue;
		}

		const count = sessionsByDate.get(iso) ?? 0;
		if (count > 0) {
			result.push({
				date: iso,
				status: "trained",
				sessionsCount: count,
				scheduledDayLabel: weekdayInfo.get(weekday)?.label,
			});
			continue;
		}

		if (activePlan && activePlan.anchorWeekday != null) {
			const info = weekdayInfo.get(weekday);
			if (info?.isRest) {
				result.push({
					date: iso,
					status: "rest",
					sessionsCount: 0,
					scheduledDayLabel: info.label,
				});
			} else if (info) {
				result.push({
					date: iso,
					status: "skipped",
					sessionsCount: 0,
					scheduledDayLabel: info.label,
				});
			} else {
				result.push({ date: iso, status: "rest", sessionsCount: 0 });
			}
			continue;
		}

		result.push({ date: iso, status: "skipped", sessionsCount: 0 });
	}

	return result;
}

export interface PlanDaySessionSummary {
	id: string;
	date: string; // formatted "MMM d, yyyy"
	rawDate: string; // ISO for sorting/clicking
	topSet: {
		exerciseName: string;
		weightKg: number;
		reps: number;
	} | null;
	totalVolumeKg: number;
	prCount: number;
	notes: string | null;
}

export interface PlanDayBreakdown {
	dayIndex: number;
	label: string;
	isRestDay: boolean;
	sessionCount: number;
	lastTrainedAt: string | null; // formatted
	lastTrainedDaysAgo: number | null;
	bestLift: {
		exerciseName: string;
		weightKg: number;
		reps: number;
	} | null;
	averageVolumeKg: number;
	recentSessions: PlanDaySessionSummary[];
}

export async function getPlanDayBreakdown(
	recentPerDay = 3,
): Promise<PlanDayBreakdown[]> {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return [];

		// 1. Active plan + its days.
		const [activePlan] = await db
			.select({
				id: programTemplates.id,
				name: programTemplates.name,
				anchorWeekday: programTemplates.anchorWeekday,
			})
			.from(programTemplates)
			.where(
				and(
					eq(programTemplates.userId, dbUser.id),
					eq(programTemplates.active, true),
				),
			)
			.limit(1);

		if (!activePlan) return [];

		const days = await db
			.select({
				dayIndex: programDayTemplates.dayIndex,
				label: programDayTemplates.label,
				isRestDay: programDayTemplates.isRestDay,
			})
			.from(programDayTemplates)
			.where(eq(programDayTemplates.programId, activePlan.id))
			.orderBy(programDayTemplates.dayIndex);

		if (days.length === 0) return [];

		// 2. All sessions under this plan.
		const sessions = await db
			.select({
				id: workoutSessions.id,
				date: workoutSessions.date,
				dayIndex: workoutSessions.dayIndex,
				notes: workoutSessions.notes,
			})
			.from(workoutSessions)
			.where(
				and(
					eq(workoutSessions.userId, dbUser.id),
					eq(workoutSessions.programId, activePlan.id),
				),
			)
			.orderBy(desc(workoutSessions.date));

		// 3. All sets for those sessions.
		const sessionIds = sessions.map((s) => s.id);
		const sets =
			sessionIds.length > 0
				? await db
						.select({
							sessionId: workoutSets.sessionId,
							exerciseName: workoutSets.exerciseName,
							weight: workoutSets.weight,
							reps: workoutSets.reps,
							isPR: workoutSets.isPR,
						})
						.from(workoutSets)
						.where(inArray(workoutSets.sessionId, sessionIds))
				: [];

		// 4. Bucket sets by session.
		const setsBySession = new Map<string, typeof sets>();
		for (const s of sets) {
			const bucket = setsBySession.get(s.sessionId);
			if (bucket) bucket.push(s);
			else setsBySession.set(s.sessionId, [s]);
		}

		// 5. Bucket sessions by dayIndex.
		const sessionsByDay = new Map<number, typeof sessions>();
		for (const s of sessions) {
			if (s.dayIndex == null) continue;
			const bucket = sessionsByDay.get(s.dayIndex);
			if (bucket) bucket.push(s);
			else sessionsByDay.set(s.dayIndex, [s]);
		}

		// 6. Build the breakdown per day.
		const now = new Date();

		return days.map((day): PlanDayBreakdown => {
			const daySessions = sessionsByDay.get(day.dayIndex) ?? [];

			if (daySessions.length === 0) {
				return {
					dayIndex: day.dayIndex,
					label: toCapitalized(day.label),
					isRestDay: day.isRestDay,
					sessionCount: 0,
					lastTrainedAt: null,
					lastTrainedDaysAgo: null,
					bestLift: null,
					averageVolumeKg: 0,
					recentSessions: [],
				};
			}

			// Most recent session is first (query was desc by date).
			const lastSession = daySessions[0];
			const lastDate = new Date(lastSession.date);
			const daysAgo = Math.floor(
				(now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
			);

			// Best lift across all sessions on this day.
			// Use e1RM (weight × (1 + reps/30)) for comparison, weight
			// for display.
			let bestLift: PlanDayBreakdown["bestLift"] = null;
			let bestE1RM = 0;

			let totalVolumeAcrossSessions = 0;

			for (const s of daySessions) {
				const sessionSets = setsBySession.get(s.id) ?? [];
				const sessionVolume = sessionSets.reduce(
					(acc, set) => acc + Number(set.weight) * set.reps,
					0,
				);
				totalVolumeAcrossSessions += sessionVolume;

				for (const set of sessionSets) {
					// Skip bodyweight sets for the "best lift" — they
					// don't have a comparable load.
					if (Number(set.weight) <= 0) continue;

					const e1rm = Number(set.weight) * (1 + set.reps / 30);
					if (e1rm > bestE1RM) {
						bestE1RM = e1rm;
						bestLift = {
							exerciseName: toCapitalized(set.exerciseName),
							weightKg: Number(set.weight),
							reps: set.reps,
						};
					}
				}
			}

			const recentSessions = daySessions
				.slice(0, recentPerDay)
				.map((s): PlanDaySessionSummary => {
					const sessionSets = setsBySession.get(s.id) ?? [];
					const totalVolume = sessionSets.reduce(
						(acc, set) => acc + Number(set.weight) * set.reps,
						0,
					);
					const prCount = sessionSets.filter(
						(set) => set.isPR,
					).length;

					const topSet =
						sessionSets
							.filter((set) => Number(set.weight) > 0)
							.sort((a, b) => {
								const wDiff =
									Number(b.weight) - Number(a.weight);
								if (wDiff !== 0) return wDiff;
								return b.reps - a.reps;
							})[0] ?? null;

					const sessionDate = new Date(s.date);

					return {
						id: s.id,
						date: sessionDate.toLocaleDateString("en-US", {
							day: "numeric",
							month: "short",
							year: "numeric",
						}),
						rawDate: s.date.toISOString(),
						topSet: topSet
							? {
									exerciseName: toCapitalized(
										topSet.exerciseName,
									),
									weightKg: Number(topSet.weight),
									reps: topSet.reps,
								}
							: null,
						totalVolumeKg: totalVolume,
						prCount,
						notes: s.notes,
					};
				});

			return {
				dayIndex: day.dayIndex,
				label: toCapitalized(day.label),
				isRestDay: day.isRestDay,
				sessionCount: daySessions.length,
				lastTrainedAt: lastDate.toLocaleDateString("en-US", {
					day: "numeric",
					month: "short",
					year: "numeric",
				}),
				lastTrainedDaysAgo: daysAgo,
				bestLift,
				averageVolumeKg:
					Math.round(
						(totalVolumeAcrossSessions / daySessions.length) * 10,
					) / 10,
				recentSessions,
			};
		});
	} catch (error) {
		console.error("Error fetching plan day breakdown:", error);
		return [];
	}
}
