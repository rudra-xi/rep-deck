"use server";

import { and, asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/actions/auth";
import { db } from "@/db";
import {
	exerciseTemplates,
	programDayTemplates,
	programTemplates,
} from "@/db/schema";
import { toCapitalized } from "@/lib/to-capitalized";

async function requireAuth() {
	const { supabaseUser } = await getCurrentUser();
	if (!supabaseUser) throw new Error("Unauthorized");
	return supabaseUser;
}

/** Helper function to purge all cache related to plans */
function purgePlansCache() {
	// Revalidates the page and all dynamic child paths under /plans
	revalidatePath("/plans", "page");
	revalidatePath("/plans/[id]", "page");
}

/* ==========================================
   1. PLAN / PROGRAM TEMPLATE ACTIONS
   ========================================== */

export async function getUserPlans() {
	const user = await requireAuth();

	const plans = await db
		.select()
		.from(programTemplates)
		.where(eq(programTemplates.userId, user.id))
		.orderBy(desc(programTemplates.createdAt));

	return Promise.all(
		plans.map(async (plan) => {
			const days = await db
				.select()
				.from(programDayTemplates)
				.where(eq(programDayTemplates.programId, plan.id))
				.orderBy(asc(programDayTemplates.dayIndex));

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

			return { ...plan, days: daysWithExercises };
		}),
	);
}

export async function createPlan(data: {
	name: string;
	version?: number;
	startDate?: string | null;
}) {
	const user = await requireAuth();

	const [newPlan] = await db
		.insert(programTemplates)
		.values({
			userId: user.id,
			name: toCapitalized(data.name), // ✅ Apply toCapitalized
			version: data.version ?? 1,
			startDate: data.startDate ? new Date(data.startDate) : null,
			active: false,
		})
		.returning();

	purgePlansCache();
	return { success: true, plan: newPlan };
}

export async function updatePlan(
	planId: string,
	data: { name?: string; version?: number; startDate?: string | null },
) {
	const user = await requireAuth();

	await db
		.update(programTemplates)
		.set({
			...(data.name && { name: toCapitalized(data.name) }), // ✅ Apply toCapitalized
			...(data.version !== undefined && { version: data.version }),
			...(data.startDate !== undefined && {
				startDate: data.startDate ? new Date(data.startDate) : null,
			}),
		})
		.where(
			and(
				eq(programTemplates.id, planId),
				eq(programTemplates.userId, user.id),
			),
		);

	purgePlansCache();
	return { success: true };
}

export async function setActivePlan(planId: string) {
	const user = await requireAuth();

	await db
		.update(programTemplates)
		.set({ active: false })
		.where(eq(programTemplates.userId, user.id));

	await db
		.update(programTemplates)
		.set({ active: true })
		.where(
			and(
				eq(programTemplates.id, planId),
				eq(programTemplates.userId, user.id),
			),
		);

	purgePlansCache();
	return { success: true };
}

export async function deletePlan(planId: string) {
	const user = await requireAuth();

	await db
		.delete(programTemplates)
		.where(
			and(
				eq(programTemplates.id, planId),
				eq(programTemplates.userId, user.id),
			),
		);

	purgePlansCache();
	return { success: true };
}

/* ==========================================
   2. DAY TEMPLATE ACTIONS
   ========================================== */

export async function addPlanDay(planId: string, label: string) {
	await requireAuth();

	const existingDays = await db
		.select()
		.from(programDayTemplates)
		.where(eq(programDayTemplates.programId, planId));

	const [newDay] = await db
		.insert(programDayTemplates)
		.values({
			programId: planId,
			label: toCapitalized(label), // ✅ Apply toCapitalized
			dayIndex: existingDays.length + 1,
		})
		.returning();

	purgePlansCache();
	return { success: true, day: newDay };
}

export async function deletePlanDay(dayId: string) {
	await requireAuth();

	await db
		.delete(programDayTemplates)
		.where(eq(programDayTemplates.id, dayId));

	purgePlansCache();
	return { success: true };
}

/* ==========================================
   3. EXERCISE TEMPLATE ACTIONS
   ========================================== */

export async function addExerciseToDay(data: {
	programDayId: string;
	name: string;
	type?: string;
	targetSets?: number;
	targetRepRange?: string;
}) {
	await requireAuth();

	const currentExercises = await db
		.select()
		.from(exerciseTemplates)
		.where(eq(exerciseTemplates.programDayId, data.programDayId));

	const [newExercise] = await db
		.insert(exerciseTemplates)
		.values({
			programDayId: data.programDayId,
			name: toCapitalized(data.name), // ✅ Apply toCapitalized
			type: data.type || "General",
			targetSets: data.targetSets ?? 3,
			targetRepRange: data.targetRepRange || "8-12",
			order: currentExercises.length + 1,
		})
		.returning();

	purgePlansCache();
	return { success: true, exercise: newExercise };
}

export async function updateExercise(
	exerciseId: string,
	data: {
		name?: string;
		type?: string;
		targetSets?: number;
		targetRepRange?: string;
	},
) {
	await requireAuth();

	await db
		.update(exerciseTemplates)
		.set({
			...(data.name && { name: toCapitalized(data.name) }), // ✅ Apply toCapitalized
			...(data.type && { type: data.type }),
			...(data.targetSets !== undefined && {
				targetSets: data.targetSets,
			}),
			...(data.targetRepRange && {
				targetRepRange: data.targetRepRange,
			}),
		})
		.where(eq(exerciseTemplates.id, exerciseId));

	purgePlansCache();
	return { success: true };
}

export async function deleteExercise(exerciseId: string) {
	await requireAuth();

	await db
		.delete(exerciseTemplates)
		.where(eq(exerciseTemplates.id, exerciseId));

	purgePlansCache();
	return { success: true };
}

export async function duplicatePlan(
	planId: string,
	options?: { name?: string; version?: number },
) {
	try {
		const user = await requireAuth();

		if (!planId) {
			return { success: false, error: "Plan ID is required" };
		}

		// 1. Fetch original plan using standard query builder
		const [originalPlan] = await db
			.select()
			.from(programTemplates)
			.where(
				and(
					eq(programTemplates.id, planId),
					eq(programTemplates.userId, user.id),
				),
			)
			.limit(1);

		if (!originalPlan) {
			return { success: false, error: "Plan not found" };
		}

		// 2. Insert duplicated parent plan
		const [newPlan] = await db
			.insert(programTemplates)
			.values({
				userId: user.id,
				name: options?.name?.trim()
					? toCapitalized(options.name.trim()) // ✅ Apply toCapitalized
					: `${toCapitalized(originalPlan.name)} (Copy)`, // ✅ Apply toCapitalized
				version: options?.version ?? originalPlan.version + 1,
				startDate: null,
				active: false,
			})
			.returning();

		// 3. Fetch days belonging to the original plan
		const days = await db
			.select()
			.from(programDayTemplates)
			.where(eq(programDayTemplates.programId, planId))
			.orderBy(asc(programDayTemplates.dayIndex));

		// 4. Duplicate days and their associated exercises
		for (const day of days) {
			const [newDay] = await db
				.insert(programDayTemplates)
				.values({
					programId: newPlan.id,
					label: toCapitalized(day.label), // ✅ Apply toCapitalized
					dayIndex: day.dayIndex,
				})
				.returning();

			const exercises = await db
				.select()
				.from(exerciseTemplates)
				.where(eq(exerciseTemplates.programDayId, day.id))
				.orderBy(asc(exerciseTemplates.order));

			if (exercises.length > 0) {
				await db.insert(exerciseTemplates).values(
					exercises.map((e) => ({
						programDayId: newDay.id,
						name: toCapitalized(e.name), // ✅ Apply toCapitalized
						type: e.type,
						targetSets: e.targetSets,
						targetRepRange: e.targetRepRange,
						order: e.order,
					})),
				);
			}
		}

		purgePlansCache();
		return { success: true, plan: newPlan };
	} catch (error) {
		console.error("Error in duplicatePlan:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to duplicate plan",
		};
	}
}
