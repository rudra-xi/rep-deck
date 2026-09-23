"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/actions/auth";
import { db } from "@/db";
import {
	exerciseTemplates,
	type ProgramDayTemplate,
	programDayTemplates,
	programTemplates,
} from "@/db/schema";
import { toCapitalized } from "@/lib/to-capitalized";
import { isValidWeekday } from "@/lib/weekday-anchor";

async function requireAuth() {
	const { supabaseUser } = await getCurrentUser();
	if (!supabaseUser) return null;
	return supabaseUser;
}

function purgePlansCache() {
	revalidatePath("/plans", "page");
	revalidatePath("/plans/[id]", "page");
}

export async function getUserPlans() {
	const user = await requireAuth();
	if (!user) return [];

	const plans = await db
		.select()
		.from(programTemplates)
		.where(eq(programTemplates.userId, user.id))
		.orderBy(asc(programTemplates.startDate));

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
	anchorWeekday?: number | null;
}) {
	const user = await requireAuth();
	if (!user) return { success: false, error: "Unauthorized" };

	const [newPlan] = await db
		.insert(programTemplates)
		.values({
			userId: user.id,
			name: toCapitalized(data.name),
			version: data.version ?? 1,
			startDate: data.startDate ? new Date(data.startDate) : null,
			anchorWeekday:
				data.anchorWeekday != null && isValidWeekday(data.anchorWeekday)
					? data.anchorWeekday
					: null,
			active: false,
		})
		.returning();

	purgePlansCache();
	return { success: true, plan: newPlan };
}

export async function updatePlan(
	planId: string,
	data: {
		name?: string;
		version?: number;
		startDate?: string | null;
		anchorWeekday?: number | null;
	},
) {
	const user = await requireAuth();
	if (!user) return { success: false, error: "Unauthorized" };

	await db
		.update(programTemplates)
		.set({
			...(data.name && { name: toCapitalized(data.name) }),
			...(data.version !== undefined && { version: data.version }),
			...(data.startDate !== undefined && {
				startDate: data.startDate ? new Date(data.startDate) : null,
			}),
			...(data.anchorWeekday !== undefined && {
				anchorWeekday:
					data.anchorWeekday != null &&
					isValidWeekday(data.anchorWeekday)
						? data.anchorWeekday
						: null,
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
	if (!user) return { success: false, error: "Unauthorized" };

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
	if (!user) return { success: false, error: "Unauthorized" };

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

export async function addPlanDay(planId: string, label: string) {
	const user = await requireAuth();
	if (!user) return { success: false, error: "Unauthorized" };

	const existingDays = await db
		.select({ dayIndex: programDayTemplates.dayIndex })
		.from(programDayTemplates)
		.where(eq(programDayTemplates.programId, planId));

	const maxIndex = existingDays.reduce(
		(max, d) => Math.max(max, d.dayIndex),
		0,
	);

	const [newDay] = await db
		.insert(programDayTemplates)
		.values({
			programId: planId,
			label: toCapitalized(label),
			dayIndex: maxIndex + 1,
		})
		.returning();

	purgePlansCache();
	return { success: true, day: newDay };
}

export async function deletePlanDay(dayId: string) {
	const user = await requireAuth();
	if (!user) return { success: false, error: "Unauthorized" };

	await db.transaction(async (tx) => {
		const [target] = await tx
			.select({
				id: programDayTemplates.id,
				programId: programDayTemplates.programId,
				userId: programTemplates.userId,
			})
			.from(programDayTemplates)
			.innerJoin(
				programTemplates,
				eq(programDayTemplates.programId, programTemplates.id),
			)
			.where(eq(programDayTemplates.id, dayId))
			.limit(1);

		if (!target || target.userId !== user.id) return;

		await tx
			.delete(programDayTemplates)
			.where(eq(programDayTemplates.id, dayId));

		const remaining = await tx
			.select()
			.from(programDayTemplates)
			.where(eq(programDayTemplates.programId, target.programId))
			.orderBy(asc(programDayTemplates.dayIndex));

		for (let i = 0; i < remaining.length; i++) {
			const desired = i + 1;
			if (remaining[i].dayIndex !== desired) {
				await tx
					.update(programDayTemplates)
					.set({ dayIndex: desired })
					.where(eq(programDayTemplates.id, remaining[i].id));
			}
		}
	});

	purgePlansCache();
	return { success: true };
}

export async function addExerciseToDay(data: {
	programDayId: string;
	name: string;
	type?: string;
	targetSets?: number;
	targetRepRange?: string;
}) {
	const user = await requireAuth();
	if (!user) return { success: false, error: "Unauthorized" };

	const currentExercises = await db
		.select()
		.from(exerciseTemplates)
		.where(eq(exerciseTemplates.programDayId, data.programDayId));

	const [newExercise] = await db
		.insert(exerciseTemplates)
		.values({
			programDayId: data.programDayId,
			name: toCapitalized(data.name),
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
	const user = await requireAuth();
	if (!user) return { success: false, error: "Unauthorized" };

	await db
		.update(exerciseTemplates)
		.set({
			...(data.name && { name: toCapitalized(data.name) }),
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
	const user = await requireAuth();
	if (!user) return { success: false, error: "Unauthorized" };

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
		if (!user) return { success: false, error: "Unauthorized" };

		if (!planId) {
			return { success: false, error: "Plan ID is required" };
		}

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

		const [newPlan] = await db
			.insert(programTemplates)
			.values({
				userId: user.id,
				name: options?.name?.trim()
					? toCapitalized(options.name.trim())
					: `${toCapitalized(originalPlan.name)} (Copy)`,
				version: options?.version ?? originalPlan.version + 1,
				startDate: null,
				active: false,
			})
			.returning();

		const days = await db
			.select()
			.from(programDayTemplates)
			.where(eq(programDayTemplates.programId, planId))
			.orderBy(asc(programDayTemplates.dayIndex));

		for (const day of days) {
			const [newDay] = await db
				.insert(programDayTemplates)
				.values({
					programId: newPlan.id,
					label: toCapitalized(day.label),
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
						name: toCapitalized(e.name),
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

export async function updatePlanDay(dayId: string, data: { label?: string }) {
	const user = await requireAuth();
	if (!user) return { success: false, error: "Unauthorized" };

	const [day] = await db
		.select({
			id: programDayTemplates.id,
			userId: programTemplates.userId,
		})
		.from(programDayTemplates)
		.innerJoin(
			programTemplates,
			eq(programDayTemplates.programId, programTemplates.id),
		)
		.where(eq(programDayTemplates.id, dayId))
		.limit(1);

	if (!day || day.userId !== user.id) {
		return { success: false, error: "Day not found" };
	}

	await db
		.update(programDayTemplates)
		.set({
			...(data.label && { label: toCapitalized(data.label) }),
		})
		.where(eq(programDayTemplates.id, dayId));

	purgePlansCache();
	return { success: true };
}

export async function duplicateDay(
	dayId: string,
	options?: { label?: string },
): Promise<
	| { success: true; day: ProgramDayTemplate }
	| { success: false; error: string }
> {
	try {
		const user = await requireAuth();
		if (!user) return { success: false, error: "Unauthorized" };

		if (!dayId) {
			return { success: false, error: "Day ID is required" };
		}

		const [original] = await db
			.select({
				day: programDayTemplates,
				planUserId: programTemplates.userId,
			})
			.from(programDayTemplates)
			.innerJoin(
				programTemplates,
				eq(programDayTemplates.programId, programTemplates.id),
			)
			.where(eq(programDayTemplates.id, dayId))
			.limit(1);

		if (!original || original.planUserId !== user.id) {
			return { success: false, error: "Day not found" };
		}

		const siblings = await db
			.select({ dayIndex: programDayTemplates.dayIndex })
			.from(programDayTemplates)
			.where(eq(programDayTemplates.programId, original.day.programId));

		const maxIndex = siblings.reduce(
			(max, d) => Math.max(max, d.dayIndex),
			0,
		);

		const newLabel = options?.label?.trim()
			? toCapitalized(options.label.trim())
			: `${toCapitalized(original.day.label)} (Copy)`;

		const result = await db.transaction(async (tx) => {
			const [newDay] = await tx
				.insert(programDayTemplates)
				.values({
					programId: original.day.programId,
					label: newLabel,
					dayIndex: maxIndex + 1,
				})
				.returning();

			const exercises = await tx
				.select()
				.from(exerciseTemplates)
				.where(eq(exerciseTemplates.programDayId, original.day.id))
				.orderBy(asc(exerciseTemplates.order));

			if (exercises.length > 0) {
				await tx.insert(exerciseTemplates).values(
					exercises.map((e) => ({
						programDayId: newDay.id,
						name: toCapitalized(e.name),
						type: e.type,
						targetSets: e.targetSets,
						targetRepRange: e.targetRepRange,
						order: e.order,
					})),
				);
			}

			return newDay;
		});

		purgePlansCache();
		return { success: true, day: result };
	} catch (error) {
		console.error("Error in duplicateDay:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to duplicate day",
		};
	}
}
