"use server";

import { revalidatePath } from "next/cache";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
	exerciseTemplates,
	programDayTemplates,
	programTemplates,
	workoutSessions,
	workoutSets,
} from "@/db/schema";
import { getCurrentUser } from "@/actions/auth";
import { toCapitalized } from "@/lib/to-capitalized";

export interface ExercisePerformanceSummary {
	lastBest: {
		weight: number;
		reps: number;
		rpe?: number | null;
		formatted: string;
	} | null;
	overallBest: {
		weight: number;
		reps: number;
		rpe?: number | null;
		formatted: string;
	} | null;
	lastNote?: string | null;
	isPR?: boolean;
}

// Helper function to check if a set is a PR using 1RM comparison
async function checkIfPR(
	userId: string,
	exerciseName: string,
	weight: number,
	reps: number,
): Promise<boolean> {
	const current1RM = weight * (1 + reps / 30);

	const previousSets = await db
		.select({
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
				eq(workoutSessions.userId, userId),
				eq(workoutSets.exerciseName, exerciseName),
			),
		);

	if (previousSets.length === 0) return true;

	const maxPrevious1RM = Math.max(
		...previousSets.map((s) => Number(s.weight) * (1 + s.reps / 30)),
	);

	return current1RM > maxPrevious1RM;
}

// 1. Get Active Workout Plan
export async function getActiveWorkoutPlan() {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		const [activeProgram] = await db
			.select()
			.from(programTemplates)
			.where(
				and(
					eq(programTemplates.userId, dbUser.id),
					eq(programTemplates.active, true),
				),
			)
			.limit(1);

		if (!activeProgram) return null;

		const days = await db
			.select()
			.from(programDayTemplates)
			.where(eq(programDayTemplates.programId, activeProgram.id))
			.orderBy(asc(programDayTemplates.dayIndex));

		const daysWithExercises = await Promise.all(
			days.map(async (day) => {
				const exercises = await db
					.select()
					.from(exerciseTemplates)
					.where(eq(exerciseTemplates.programDayId, day.id))
					.orderBy(asc(exerciseTemplates.order));

				return {
					...day,
					label: toCapitalized(day.label),
					exercises: exercises.map((e) => ({
						...e,
						name: toCapitalized(e.name),
					})),
				};
			}),
		);

		return {
			...activeProgram,
			name: toCapitalized(activeProgram.name),
			days: daysWithExercises,
		};
	} catch (error) {
		console.error("Error fetching active workout plan:", error);
		return null;
	}
}

// 2. Fetch both Last Session Best & Overall All-Time Best (PR)
export async function getExercisePerformanceHistory(
	exerciseName: string,
): Promise<ExercisePerformanceSummary | null> {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		const normalizedExerciseName = toCapitalized(exerciseName);

		const allSets = await db
			.select({
				sessionId: workoutSessions.id,
				weight: workoutSets.weight,
				reps: workoutSets.reps,
				rpe: workoutSets.rpe,
				notes: workoutSets.notes,
				isPR: workoutSets.isPR,
				createdAt: workoutSets.createdAt,
			})
			.from(workoutSets)
			.innerJoin(
				workoutSessions,
				eq(workoutSets.sessionId, workoutSessions.id),
			)
			.where(
				and(
					eq(workoutSessions.userId, dbUser.id),
					eq(workoutSets.exerciseName, normalizedExerciseName),
				),
			)
			.orderBy(desc(workoutSessions.date), desc(workoutSets.createdAt));

		if (!allSets.length) return null;

		const formatSet = (set: {
			weight: number;
			reps: number;
			rpe?: number | null;
		}) =>
			`${set.weight}kg × ${set.reps}${set.rpe ? ` @ rpe ${set.rpe}` : ""}`;

		const latestSessionId = allSets[0].sessionId;
		const lastSessionSets = allSets.filter(
			(set) => set.sessionId === latestSessionId,
		);

		const lastNoteSet = allSets.find(
			(set) => set.notes !== null && set.notes.trim() !== "",
		);

		const lastBestSet = lastSessionSets.reduce((prev, current) => {
			if (current.weight > prev.weight) return current;
			if (current.weight === prev.weight && current.reps > prev.reps)
				return current;
			return prev;
		}, lastSessionSets[0]);

		const overallBestSet = allSets.reduce((prev, current) => {
			if (current.weight > prev.weight) return current;
			if (current.weight === prev.weight && current.reps > prev.reps)
				return current;
			return prev;
		}, allSets[0]);

		const isPR = allSets.some((set) => set.isPR === true);

		return {
			lastBest: {
				weight: lastBestSet.weight,
				reps: lastBestSet.reps,
				rpe: lastBestSet.rpe,
				formatted: formatSet(lastBestSet),
			},
			overallBest: {
				weight: overallBestSet.weight,
				reps: overallBestSet.reps,
				rpe: overallBestSet.rpe,
				formatted: formatSet(overallBestSet),
			},
			lastNote: lastNoteSet?.notes ?? null,
			isPR,
		};
	} catch (error) {
		console.error("Error fetching exercise performance history:", error);
		return null;
	}
}

export async function getLastExercisePerformance(exerciseName: string) {
	const history = await getExercisePerformanceHistory(exerciseName);
	return history?.lastBest?.formatted ?? null;
}

// 3. Save Workout Session and Sets
export async function finishWorkoutSession(data: {
	programId?: string;
	dayIndex?: number;
	notes?: string;
	sets: Array<{
		exerciseName: string;
		templateId?: string;
		setNumber: number;
		weight: number;
		reps: number;
		rpe?: number;
		notes?: string;
	}>;
}) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized" };
		}

		const missingTemplateNames = [
			...new Set(
				data.sets
					.filter((s) => !s.templateId)
					.map((s) =>
						toCapitalized(s.exerciseName).trim().toLowerCase(),
					),
			),
		];

		const templateMap = new Map<string, string>();

		if (missingTemplateNames.length > 0) {
			const matchedTemplates = await db
				.select({
					id: exerciseTemplates.id,
					name: exerciseTemplates.name,
				})
				.from(exerciseTemplates);

			matchedTemplates.forEach((t) => {
				templateMap.set(t.name.trim().toLowerCase(), t.id);
			});
		}

		// Group notes by exercise to guarantee note persistence across all sets
		const exerciseNoteMap = new Map<string, string>();
		data.sets.forEach((set) => {
			const normalizedKey = toCapitalized(set.exerciseName)
				.trim()
				.toLowerCase();
			if (set.notes && set.notes.trim() !== "") {
				exerciseNoteMap.set(normalizedKey, set.notes.trim());
			}
		});

		const result = await db.transaction(async (tx) => {
			const [session] = await tx
				.insert(workoutSessions)
				.values({
					userId: dbUser.id,
					programId: data.programId || null,
					dayIndex: data.dayIndex || null,
					notes: data.notes?.trim() || null,
					date: new Date(),
				})
				.returning();

			if (data.sets.length > 0) {
				const setsWithPR = await Promise.all(
					data.sets.map(async (set) => {
						const capitalizedName = toCapitalized(set.exerciseName);
						const normalizedName = capitalizedName
							.trim()
							.toLowerCase();
						const resolvedTemplateId =
							set.templateId ||
							templateMap.get(normalizedName) ||
							null;

						const isPR = await checkIfPR(
							dbUser.id,
							capitalizedName,
							set.weight,
							set.reps,
						);

						// Fallback to exerciseNoteMap if the set's individual note is empty
						const finalNote =
							set.notes?.trim() ||
							exerciseNoteMap.get(normalizedName) ||
							null;

						return {
							sessionId: session.id,
							exerciseName: capitalizedName,
							templateId: resolvedTemplateId,
							setNumber: set.setNumber,
							weight: set.weight,
							reps: set.reps,
							rpe: set.rpe || null,
							notes: finalNote,
							isPR,
						};
					}),
				);

				await tx.insert(workoutSets).values(setsWithPR);
			}

			return session;
		});

		revalidatePath("/workout-log");
		return { success: true, session: result };
	} catch (error) {
		console.error("Error saving workout session:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to save session",
		};
	}
}

// 4. Get Last Session Note for a specific day
export async function getLastSessionNote(
	programId: string,
	dayIndex: number,
): Promise<string | null> {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		const [lastSession] = await db
			.select({
				notes: workoutSessions.notes,
			})
			.from(workoutSessions)
			.where(
				and(
					eq(workoutSessions.userId, dbUser.id),
					eq(workoutSessions.programId, programId),
					eq(workoutSessions.dayIndex, dayIndex),
				),
			)
			.orderBy(desc(workoutSessions.date))
			.limit(1);

		return lastSession?.notes ?? null;
	} catch (error) {
		console.error("Error fetching last session note:", error);
		return null;
	}
}

// 5. Get Personal Records
export async function getPersonalRecords(exerciseName: string) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		const capitalizedName = toCapitalized(exerciseName);

		const prs = await db
			.select({
				id: workoutSets.id,
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
					eq(workoutSessions.userId, dbUser.id),
					eq(workoutSets.exerciseName, capitalizedName),
					eq(workoutSets.isPR, true),
				),
			)
			.orderBy(desc(workoutSets.weight), desc(workoutSets.reps));

		return prs.map((pr) => ({
			...pr,
			formatted: `${pr.weight}kg × ${pr.reps}${pr.rpe ? ` @ rpe ${pr.rpe}` : ""}`,
			date: pr.date.toLocaleDateString(),
		}));
	} catch (error) {
		console.error("Error fetching personal records:", error);
		return null;
	}
}

// 6. Get Workout Session Details
export async function getWorkoutSessionDetails(sessionId: string) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		const allSessions = await db
			.select({
				id: workoutSessions.id,
				date: workoutSessions.date,
			})
			.from(workoutSessions)
			.where(eq(workoutSessions.userId, dbUser.id))
			.orderBy(desc(workoutSessions.date));

		const sessionList = allSessions.map((s) => ({
			id: s.id,
			date: s.date.toISOString(),
		}));

		const [session] = await db
			.select()
			.from(workoutSessions)
			.where(
				and(
					eq(workoutSessions.id, sessionId),
					eq(workoutSessions.userId, dbUser.id),
				),
			)
			.limit(1);

		if (!session) return null;

		let programName = "Workout Session";
		if (session.programId) {
			const [program] = await db
				.select({ name: programTemplates.name })
				.from(programTemplates)
				.where(eq(programTemplates.id, session.programId))
				.limit(1);
			if (program) programName = toCapitalized(program.name);
		}

		const sets = await db
			.select()
			.from(workoutSets)
			.where(eq(workoutSets.sessionId, sessionId))
			.orderBy(asc(workoutSets.setNumber));

		return {
			id: session.id,
			rawDate: session.date.toISOString(),
			date: new Date(session.date).toLocaleDateString("en-US", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
			programName,
			dayName:
				session.dayIndex !== null
					? `Day ${session.dayIndex + 1}`
					: "Custom Session",
			sets: sets.map((set) => ({
				id: set.id,
				exercise: toCapitalized(set.exerciseName),
				weightKg: Number(set.weight),
				reps: set.reps,
				rpe: set.rpe ? Number(set.rpe) : undefined,
				notes: set.notes,
				isPR: set.isPR || false,
			})),
			sessions: sessionList,
		};
	} catch (error) {
		console.error("Error fetching workout details:", error);
		return null;
	}
}
