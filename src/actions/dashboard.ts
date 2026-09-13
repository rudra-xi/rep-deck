"use server";

import { and, gte, lte, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
	bodyMeasurements,
	programTemplates,
	programDayTemplates,
	workoutSessions,
	workoutSets,
} from "@/db/schema";
import { getCurrentUser } from "@/actions/auth";
import { toCapitalized } from "@/lib/to-capitalized";

export interface StrengthTrendDataPoint {
	date: string;
	squat?: number;
	bench?: number;
	deadlift?: number;
	ohp?: number;
	prs?: {
		squat?: boolean;
		bench?: boolean;
		deadlift?: boolean;
		ohp?: boolean;
	};
}

// ✅ Shared trend shape with raw diff
export interface KpiTrendShape {
	direction: "up" | "down" | "neutral";
	value?: string;
	rawDiffKg?: number;
}

export async function getDashboardData() {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		const userId = dbUser.id;

		/* ... unchanged sections 1 & 2 ... */

		const [activeProgram] = await db
			.select({
				id: programTemplates.id,
				name: programTemplates.name,
				active: programTemplates.active,
			})
			.from(programTemplates)
			.where(
				and(
					eq(programTemplates.userId, userId),
					eq(programTemplates.active, true),
				),
			)
			.limit(1);

		let sessionsPerWeek = 4;
		if (activeProgram) {
			const daysCount = await db
				.select({ count: sql<number>`count(*)` })
				.from(programDayTemplates)
				.where(eq(programDayTemplates.programId, activeProgram.id));
			sessionsPerWeek = Number(daysCount[0]?.count || 4);
		}

		const now = new Date();
		const dayOfWeek = now.getDay();
		const startOfWeek = new Date(now);
		startOfWeek.setDate(
			now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
		);
		startOfWeek.setHours(0, 0, 0, 0);

		const weeklySessions = await db
			.select({ count: sql<number>`count(*)` })
			.from(workoutSessions)
			.where(
				and(
					eq(workoutSessions.userId, userId),
					gte(workoutSessions.date, startOfWeek),
				),
			);

		const sessionsCount = Number(weeklySessions[0]?.count || 0);

		// ✅ 3. Body weight trend — explicit KpiTrendShape typing
		const recentWeights = await db
			.select()
			.from(bodyMeasurements)
			.where(eq(bodyMeasurements.userId, userId))
			.orderBy(desc(bodyMeasurements.date))
			.limit(2);

		const latestWeightRecord = recentWeights[0];
		const previousWeightRecord = recentWeights[1];

		let bodyWeightTrend: KpiTrendShape | undefined;

		if (latestWeightRecord && previousWeightRecord) {
			const currentKg = Number(latestWeightRecord.weightKg);
			const prevKg = Number(previousWeightRecord.weightKg);
			const diff = currentKg - prevKg;
			const absDiff = Math.abs(diff);

			if (currentKg > prevKg) {
				bodyWeightTrend = {
					direction: "up",
					value: `+${absDiff.toFixed(1)} kg`,
					rawDiffKg: absDiff,
				};
			} else if (currentKg < prevKg) {
				bodyWeightTrend = {
					direction: "down",
					value: `-${absDiff.toFixed(1)} kg`,
					rawDiffKg: absDiff,
				};
			} else {
				bodyWeightTrend = {
					direction: "neutral",
					value: "0 kg",
					rawDiffKg: 0,
				};
			}
		}

		// ... 4. Last workout (unchanged) ...
		const [lastSession] = await db
			.select({
				id: workoutSessions.id,
				date: workoutSessions.date,
				programId: workoutSessions.programId,
				dayIndex: workoutSessions.dayIndex,
			})
			.from(workoutSessions)
			.where(eq(workoutSessions.userId, userId))
			.orderBy(desc(workoutSessions.date))
			.limit(1);

		let lastWorkoutData = null;
		if (lastSession) {
			const topLifts = await db
				.select({
					id: workoutSets.id,
					exercise: workoutSets.exerciseName,
					weightKg: workoutSets.weight,
					reps: workoutSets.reps,
					isPR: workoutSets.isPR,
				})
				.from(workoutSets)
				.where(eq(workoutSets.sessionId, lastSession.id))
				.limit(5);

			const sessionDate = new Date(lastSession.date);
			const formattedDate = sessionDate.toLocaleDateString("en-US", {
				day: "numeric",
				month: "short",
				year: "numeric",
			});

			lastWorkoutData = {
				id: lastSession.id,
				date: formattedDate,
				programName: activeProgram?.name
					? toCapitalized(activeProgram.name)
					: "Workout Session",
				dayName:
					lastSession.dayIndex !== null
						? `Day ${lastSession.dayIndex + 1}`
						: "Custom Session",
				topLifts: topLifts.map((lift) => ({
					...lift,
					exercise: toCapitalized(lift.exercise),
					isPR: lift.isPR || false,
				})),
			};
		}

		// ✅ 5. Best lifts — dropdown options with rawWeightKg + rawDiffKg
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const trackedLifts = [
			{ label: toCapitalized("Bench Press"), value: "Bench Press" },
			{ label: toCapitalized("Barbell Squat"), value: "Barbell Squat" },
			{ label: toCapitalized("Deadlift"), value: "Deadlift" },
			{ label: toCapitalized("Overhead Press"), value: "Overhead Press" },
		];

		const dropdownOptions = await Promise.all(
			trackedLifts.map(async (lift) => {
				const sets = await db
					.select({
						weight: workoutSets.weight,
						reps: workoutSets.reps,
						rpe: workoutSets.rpe,
						date: workoutSessions.date,
					})
					.from(workoutSets)
					.innerJoin(
						workoutSessions,
						eq(workoutSets.sessionId, workoutSessions.id),
					)
					.where(
						and(
							eq(workoutSessions.userId, userId),
							eq(workoutSets.exerciseName, lift.value),
							gte(workoutSessions.date, thirtyDaysAgo),
						),
					)
					.orderBy(
						desc(workoutSets.weight),
						desc(workoutSessions.date),
					)
					.limit(2);

				if (sets.length === 0) {
					return {
						label: lift.label,
						value: lift.value,
						targetValue: "—",
						subtext: "No records",
						rawWeightKg: undefined,
						trend: undefined,
					};
				}

				const bestSet = sets[0];
				const previousSet = sets[1];

				const weightKg = Number(bestSet.weight);
				const reps = bestSet.reps;
				const rpe = bestSet.rpe ? Number(bestSet.rpe) : null;

				const subtext = rpe
					? `${reps} ${reps === 1 ? "rep" : "reps"} @ RPE ${rpe}`
					: `${reps} ${reps === 1 ? "rep" : "reps"}`;

				let trend: KpiTrendShape | undefined;

				if (previousSet) {
					const prevWeight = Number(previousSet.weight);
					const diff = weightKg - prevWeight;
					const absDiff = Math.abs(diff);

					if (diff > 0) {
						trend = {
							direction: "up",
							value: `+${absDiff} kg`,
							rawDiffKg: absDiff,
						};
					} else if (diff < 0) {
						trend = {
							direction: "down",
							value: `-${absDiff} kg`,
							rawDiffKg: absDiff,
						};
					} else {
						trend = {
							direction: "neutral",
							value: "0 kg",
							rawDiffKg: 0,
						};
					}
				}

				return {
					label: lift.label,
					value: lift.value,
					targetValue: `${weightKg} kg`,
					rawWeightKg: weightKg,
					subtext,
					trend,
				};
			}),
		);

		// ... 6. Strength trend (unchanged) ...
		const sixtyDaysAgo = new Date();
		sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

		const strengthLifts = [
			"Barbell Squat",
			"Bench Press",
			"Deadlift",
			"Overhead Press",
		];
		const liftKeys = ["squat", "bench", "deadlift", "ohp"];

		const strengthSets = await db
			.select({
				exercise: workoutSets.exerciseName,
				weight: workoutSets.weight,
				reps: workoutSets.reps,
				isPR: workoutSets.isPR,
				date: workoutSessions.date,
			})
			.from(workoutSets)
			.innerJoin(
				workoutSessions,
				eq(workoutSets.sessionId, workoutSessions.id),
			)
			.where(
				and(
					eq(workoutSessions.userId, userId),
					gte(workoutSessions.date, sixtyDaysAgo),
					sql`${workoutSets.exerciseName} IN (${sql.join(
						strengthLifts.map((l) => sql`${l}`),
						sql`, `,
					)})`,
				),
			)
			.orderBy(desc(workoutSessions.date));

		const groupedByDate: Record<
			string,
			Record<string, { weight: number; reps: number; isPR: boolean }>
		> = {};

		strengthSets.forEach((set) => {
			const dateKey = new Date(set.date).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});

			if (!groupedByDate[dateKey]) {
				groupedByDate[dateKey] = {};
			}

			const liftIndex = strengthLifts.indexOf(set.exercise);
			const liftKey = liftKeys[liftIndex];

			if (liftKey) {
				const estimated1RM =
					Number(set.weight) * (1 + Number(set.reps) / 30);

				if (
					!groupedByDate[dateKey][liftKey] ||
					estimated1RM > groupedByDate[dateKey][liftKey].weight
				) {
					groupedByDate[dateKey][liftKey] = {
						weight: estimated1RM,
						reps: set.reps,
						isPR: set.isPR || false,
					};
				}
			}
		});

		const strengthTrendData: StrengthTrendDataPoint[] = Object.entries(
			groupedByDate,
		)
			.map(([date, lifts]) => {
				const point: StrengthTrendDataPoint = {
					date,
					prs: {},
				};

				liftKeys.forEach((key) => {
					if (lifts[key]) {
						const liftData = lifts[key];
						point[
							key as keyof Omit<
								StrengthTrendDataPoint,
								"date" | "prs"
							>
						] = Math.round(liftData.weight);
						if (liftData.isPR && point.prs) {
							point.prs[key as keyof typeof point.prs] = true;
						}
					}
				});

				return point;
			})
			.sort((a, b) => {
				const dateA = new Date(a.date + ", 2026");
				const dateB = new Date(b.date + ", 2026");
				return dateA.getTime() - dateB.getTime();
			});

		// ✅ 7. KPI object
		const kpis = {
			program: {
				id: "program",
				label: "Program",
				value: activeProgram?.name
					? toCapitalized(activeProgram.name)
					: "None",
				subtext: activeProgram ? "Active" : "No active program",
				action: { href: "/plans", label: "View Plans" },
			},
			sessionsThisWeek: {
				id: "sessions",
				label: "Sessions this week",
				value: String(sessionsCount),
				subtext: `Target: ${sessionsPerWeek}`,
			},
			bestLift: {
				id: "best-lift",
				label: "Best Lift",
				value: dropdownOptions[0]?.targetValue ?? "—",
				rawWeightKg: dropdownOptions[0]?.rawWeightKg,
				subtext: dropdownOptions[0]?.subtext ?? "No data logged",
				trend: dropdownOptions[0]?.trend,
				dropdownOptions,
			},
			bodyWeight: {
				id: "body-weight",
				label: "Body weight",
				value: latestWeightRecord?.weightKg
					? `${latestWeightRecord.weightKg} kg`
					: "—",
				rawWeightKg: latestWeightRecord?.weightKg
					? Number(latestWeightRecord.weightKg)
					: undefined,
				subtext: latestWeightRecord
					? new Date(latestWeightRecord.date).toLocaleDateString(
							"en-US",
							{
								day: "numeric",
								month: "short",
								year: "numeric",
							},
						)
					: "No records",
				trend: bodyWeightTrend,
				action: { href: "/metrics", label: "View Metrics" },
			},
		};

		return {
			kpis,
			lastWorkout: lastWorkoutData,
			strengthTrend: strengthTrendData,
		};
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return null;
	}
}
