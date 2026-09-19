"use server";

import { differenceInDays, format, subDays } from "date-fns";
import { and, asc, desc, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserPreferences } from "@/actions/account";
import { getCurrentUser } from "@/actions/auth";
import { db } from "@/db";
import { bodyMeasurements } from "@/db/schema";
import {
	formatMeasurement,
	formatWeight,
	parseMeasurementToIn,
	parseWeightToKg,
} from "@/lib/units";

export interface MeasurementFormData {
	date: Date;
	weightKg?: number | null;
	bodyFatPercent?: number | null;
	armsIn?: number | null;
	forearmsIn?: number | null;
	thighsIn?: number | null;
	chestIn?: number | null;
	waistIn?: number | null;
	hipsIn?: number | null;
	notes?: string | null;
}

export async function createMeasurement(formData: MeasurementFormData) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return { success: false, error: "Unauthorized" };

		const prefs = await getUserPreferences();

		const weightKg = formData.weightKg
			? parseWeightToKg(formData.weightKg, prefs.weightUnit)
			: null;

		const armsIn = formData.armsIn
			? parseMeasurementToIn(formData.armsIn, prefs.measurementUnit)
			: null;
		const forearmsIn = formData.forearmsIn
			? parseMeasurementToIn(formData.forearmsIn, prefs.measurementUnit)
			: null;
		const thighsIn = formData.thighsIn
			? parseMeasurementToIn(formData.thighsIn, prefs.measurementUnit)
			: null;
		const chestIn = formData.chestIn
			? parseMeasurementToIn(formData.chestIn, prefs.measurementUnit)
			: null;
		const waistIn = formData.waistIn
			? parseMeasurementToIn(formData.waistIn, prefs.measurementUnit)
			: null;
		const hipsIn = formData.hipsIn
			? parseMeasurementToIn(formData.hipsIn, prefs.measurementUnit)
			: null;

		await db.insert(bodyMeasurements).values({
			userId: dbUser.id,
			date: formData.date,
			weightKg,
			bodyFatPercent: formData.bodyFatPercent ?? null,
			armsIn,
			forearmsIn,
			thighsIn,
			chestIn,
			waistIn,
			hipsIn,
			notes: formData.notes ?? null,
		});

		revalidatePath("/metrics");
		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Error creating measurement:", error);
		return { success: false, error: "Failed to save measurement" };
	}
}

export async function deleteMeasurement(measurementId: string) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return { success: false, error: "Unauthorized" };

		await db
			.delete(bodyMeasurements)
			.where(
				and(
					eq(bodyMeasurements.id, measurementId),
					eq(bodyMeasurements.userId, dbUser.id),
				),
			);

		revalidatePath("/metrics");
		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Error deleting measurement:", error);
		return { success: false, error: "Failed to delete measurement" };
	}
}

export async function updateMeasurement(
	measurementId: string,
	formData: Partial<MeasurementFormData>,
) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return { success: false, error: "Unauthorized" };

		const prefs = await getUserPreferences();

		const updates: Record<string, unknown> = {};

		if (formData.date) updates.date = formData.date;

		if (formData.weightKg !== undefined) {
			updates.weightKg = formData.weightKg
				? parseWeightToKg(formData.weightKg, prefs.weightUnit)
				: null;
		}

		if (formData.bodyFatPercent !== undefined) {
			updates.bodyFatPercent = formData.bodyFatPercent ?? null;
		}

		const measurementFields = [
			"armsIn",
			"forearmsIn",
			"thighsIn",
			"chestIn",
			"waistIn",
			"hipsIn",
		] as const;

		for (const field of measurementFields) {
			if (formData[field] !== undefined) {
				updates[field] = formData[field]
					? parseMeasurementToIn(
							formData[field] as number,
							prefs.measurementUnit,
						)
					: null;
			}
		}

		if (formData.notes !== undefined)
			updates.notes = formData.notes ?? null;

		await db
			.update(bodyMeasurements)
			.set(updates)
			.where(
				and(
					eq(bodyMeasurements.id, measurementId),
					eq(bodyMeasurements.userId, dbUser.id),
				),
			);

		revalidatePath("/metrics");
		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Error updating measurement:", error);
		return { success: false, error: "Failed to update measurement" };
	}
}

export async function getMetricsData(timeRange: "3M" | "6M" | "1Y" = "3M") {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		const prefs = await getUserPreferences();
		const daysMap = { "3M": 90, "6M": 180, "1Y": 365 };
		const startDate = subDays(new Date(), daysMap[timeRange] || 90);

		const allEntries = await db
			.select()
			.from(bodyMeasurements)
			.where(eq(bodyMeasurements.userId, dbUser.id))
			.orderBy(desc(bodyMeasurements.date));

		const chartEntries = await db
			.select()
			.from(bodyMeasurements)
			.where(
				and(
					eq(bodyMeasurements.userId, dbUser.id),
					gte(bodyMeasurements.date, startDate),
				),
			)
			.orderBy(asc(bodyMeasurements.date));

		const latest = allEntries[0] || null;

		let daysSinceLastMeasurement = 0;
		let averageGapDays = 0;

		if (latest) {
			daysSinceLastMeasurement = Math.max(
				0,
				differenceInDays(new Date(), new Date(latest.date)),
			);
		} else {
			daysSinceLastMeasurement = 999;
		}

		if (allEntries.length > 1) {
			let totalGapDays = 0;
			for (let i = 0; i < allEntries.length - 1; i++) {
				const currentDate = new Date(allEntries[i].date);
				const prevDate = new Date(allEntries[i + 1].date);
				totalGapDays += Math.max(
					1,
					differenceInDays(currentDate, prevDate),
				);
			}
			averageGapDays = Math.round(totalGapDays / (allEntries.length - 1));
		} else {
			averageGapDays =
				daysSinceLastMeasurement !== 999 ? daysSinceLastMeasurement : 0;
		}

		const qualityMetrics = {
			daysSinceLastMeasurement,
			averageGapDays,
		};

		const fourWeeksAgoDate = subDays(new Date(), 28);
		const pastEntry =
			allEntries.find((e) => new Date(e.date) <= fourWeeksAgoDate) ||
			allEntries[allEntries.length - 1] ||
			null;

		const calculateDelta = (
			curr?: number | string | null,
			prev?: number | string | null,
		) => {
			if (curr == null || prev == null) return null;
			const c = Number(curr);
			const p = Number(prev);
			if (Number.isNaN(c) || Number.isNaN(p)) return null;
			return Number((c - p).toFixed(2));
		};

		const convertWeightDelta = (delta: number | null) => {
			if (delta === null) return null;
			if (prefs.weightUnit === "lb") {
				return Number((delta * 2.20462).toFixed(2));
			}
			return delta;
		};

		const convertMeasurementDelta = (delta: number | null) => {
			if (delta === null) return null;
			if (prefs.measurementUnit === "cm") {
				return Number((delta * 2.54).toFixed(2));
			}
			return delta;
		};

		const weightDelta = convertWeightDelta(
			calculateDelta(latest?.weightKg, pastEntry?.weightKg),
		);
		const bodyFatDelta = calculateDelta(
			latest?.bodyFatPercent,
			pastEntry?.bodyFatPercent,
		);
		const armsDelta = convertMeasurementDelta(
			calculateDelta(latest?.armsIn, pastEntry?.armsIn),
		);
		const thighsDelta = convertMeasurementDelta(
			calculateDelta(latest?.thighsIn, pastEntry?.thighsIn),
		);

		const stats = {
			notes: latest?.notes ?? null,
			weight: {
				current: latest?.weightKg
					? formatWeight(Number(latest.weightKg), prefs.weightUnit)
					: null,
				delta: weightDelta,
				unit: prefs.weightUnit,
			},
			bodyFat: {
				current: latest?.bodyFatPercent
					? Number(latest.bodyFatPercent)
					: null,
				delta: bodyFatDelta,
				unit: "%",
			},
			arms: {
				current: latest?.armsIn
					? formatMeasurement(
							Number(latest.armsIn),
							prefs.measurementUnit,
						)
					: null,
				delta: armsDelta,
				unit: prefs.measurementUnit,
			},
			thighs: {
				current: latest?.thighsIn
					? formatMeasurement(
							Number(latest.thighsIn),
							prefs.measurementUnit,
						)
					: null,
				delta: thighsDelta,
				unit: prefs.measurementUnit,
			},
		};

		const chartData = chartEntries.map((e) => ({
			rawDate: e.date,
			date: format(new Date(e.date), "MMM d"),
			weight: e.weightKg
				? formatWeight(Number(e.weightKg), prefs.weightUnit)
				: null,
			bodyFat: e.bodyFatPercent ? Number(e.bodyFatPercent) : null,
			arms: e.armsIn
				? formatMeasurement(Number(e.armsIn), prefs.measurementUnit)
				: null,
			forearms: e.forearmsIn
				? formatMeasurement(Number(e.forearmsIn), prefs.measurementUnit)
				: null,
			thighs: e.thighsIn
				? formatMeasurement(Number(e.thighsIn), prefs.measurementUnit)
				: null,
			chest: e.chestIn
				? formatMeasurement(Number(e.chestIn), prefs.measurementUnit)
				: null,
			waist: e.waistIn
				? formatMeasurement(Number(e.waistIn), prefs.measurementUnit)
				: null,
			hips: e.hipsIn
				? formatMeasurement(Number(e.hipsIn), prefs.measurementUnit)
				: null,
		}));

		const tableData = allEntries.map((e) => ({
			id: e.id,
			date: format(new Date(e.date), "MMM d, yyyy"),
			rawDate: e.date,
			weightKg: e.weightKg
				? formatWeight(Number(e.weightKg), prefs.weightUnit)
				: null,
			bodyFatPercent: e.bodyFatPercent ? Number(e.bodyFatPercent) : null,
			armsIn: e.armsIn
				? formatMeasurement(Number(e.armsIn), prefs.measurementUnit)
				: null,
			forearmsIn: e.forearmsIn
				? formatMeasurement(Number(e.forearmsIn), prefs.measurementUnit)
				: null,
			thighsIn: e.thighsIn
				? formatMeasurement(Number(e.thighsIn), prefs.measurementUnit)
				: null,
			chestIn: e.chestIn
				? formatMeasurement(Number(e.chestIn), prefs.measurementUnit)
				: null,
			waistIn: e.waistIn
				? formatMeasurement(Number(e.waistIn), prefs.measurementUnit)
				: null,
			hipsIn: e.hipsIn
				? formatMeasurement(Number(e.hipsIn), prefs.measurementUnit)
				: null,
			notes: e.notes ?? null,
		}));

		return {
			stats,
			chartData,
			tableData,
			qualityMetrics,
			latest,
			preferences: prefs,
		};
	} catch (error) {
		console.error("Error fetching metrics data:", error);
		return null;
	}
}

export async function getMeasurementById(measurementId: string) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

		const [measurement] = await db
			.select()
			.from(bodyMeasurements)
			.where(
				and(
					eq(bodyMeasurements.id, measurementId),
					eq(bodyMeasurements.userId, dbUser.id),
				),
			)
			.limit(1);

		return measurement ?? null;
	} catch (error) {
		console.error("Error fetching measurement:", error);
		return null;
	}
}
