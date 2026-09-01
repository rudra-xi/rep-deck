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
}

// 1. Get Active Plan with Days and Exercises
export async function getActiveWorkoutPlan() {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		// 1. Fetch active program
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

		// 2. Fetch days for active program
		const days = await db
			.select()
			.from(programDayTemplates)
			.where(eq(programDayTemplates.programId, activeProgram.id))
			.orderBy(asc(programDayTemplates.dayIndex));

		// 3. Fetch exercises per day
		const daysWithExercises = await Promise.all(
			days.map(async (day) => {
				const exercises = await db
					.select()
					.from(exerciseTemplates)
					.where(eq(exerciseTemplates.programDayId, day.id))
					.orderBy(asc(exerciseTemplates.order));

				return { ...day, exercises };
			}),
		);

		return {
			...activeProgram,
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

		// Fetch all historical sets for this user & exercise name ordered by date
		const allSets = await db
			.select({
				sessionId: workoutSessions.id,
				weight: workoutSets.weight,
				reps: workoutSets.reps,
				rpe: workoutSets.rpe,
				notes: workoutSets.notes, // Query set notes
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
					eq(workoutSets.exerciseName, exerciseName),
				),
			)
			.orderBy(desc(workoutSessions.date), desc(workoutSets.createdAt));

		if (!allSets.length) return null;

		const formatSet = (set: {
			weight: number;
			reps: number;
			rpe?: number | null;
		}) =>
			`${set.weight}kg × ${set.reps}${set.rpe ? ` @ RPE ${set.rpe}` : ""}`;

		const latestSessionId = allSets[0].sessionId;
		const lastSessionSets = allSets.filter(
			(set) => set.sessionId === latestSessionId,
		);

		// Find the most recent non-empty note left on this exercise
		const lastNoteSet = allSets.find(
			(set) => set.notes && set.notes.trim() !== "",
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
			lastNote: lastNoteSet?.notes ?? null, // Return latest note
		};
	} catch (error) {
		console.error("Error fetching exercise performance history:", error);
		return null;
	}
}

// 2b. Backward compatibility helper (Returns Last Best string formatted)
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
		notes?: string; // 1. Added notes to input type
	}>;
}) {
	console.log(
		"📝 Server received notes:",
		data.sets.map((s) => ({ name: s.exerciseName, notes: s.notes })),
	); // ✅ Debug log
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized" };
		}

		// 1. Fetch template IDs for any sets missing a valid templateId
		const missingTemplateNames = [
			...new Set(
				data.sets
					.filter((s) => !s.templateId)
					.map((s) => s.exerciseName.trim().toLowerCase()),
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

		// 2. Insert session & sets in a transaction
		const result = await db.transaction(async (tx) => {
			const [session] = await tx
				.insert(workoutSessions)
				.values({
					userId: dbUser.id,
					programId: data.programId || null,
					dayIndex: data.dayIndex || null,
					notes: data.notes || null,
					date: new Date(),
				})
				.returning();

			if (data.sets.length > 0) {
				await tx.insert(workoutSets).values(
					data.sets.map((set) => {
						const normalizedName = set.exerciseName
							.trim()
							.toLowerCase();
						const resolvedTemplateId =
							set.templateId ||
							templateMap.get(normalizedName) ||
							null;

						return {
							sessionId: session.id,
							exerciseName: set.exerciseName,
							templateId: resolvedTemplateId,
							setNumber: set.setNumber,
							weight: set.weight,
							reps: set.reps,
							rpe: set.rpe || null,
							notes: set.notes || null, // 2. Insert set-level notes into DB
						};
					}),
				);
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

		// Find the most recent session for this program and day
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
