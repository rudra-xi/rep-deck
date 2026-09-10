"use server";

import { and, asc, desc, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { bodyMeasurements } from "@/db/schema";
import { getCurrentUser } from "@/actions/auth";
import { subDays, format, differenceInDays } from "date-fns";

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

		await db.insert(bodyMeasurements).values({
			userId: dbUser.id,
			date: formData.date,
			weightKg: formData.weightKg ?? null,
			bodyFatPercent: formData.bodyFatPercent ?? null,
			armsIn: formData.armsIn ?? null,
			forearmsIn: formData.forearmsIn ?? null,
			thighsIn: formData.thighsIn ?? null,
			chestIn: formData.chestIn ?? null,
			waistIn: formData.waistIn ?? null,
			hipsIn: formData.hipsIn ?? null,
			notes: formData.notes ?? null,
		});

		revalidatePath("/metrics");
		return { success: true };
	} catch (error) {
		console.error("Error creating measurement:", error);
		return { success: false, error: "Failed to save measurement" };
	}
}

export async function getMetricsData(timeRange: "3M" | "6M" | "1Y" = "3M") {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return null;

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

		// --- Calculate Data Quality Metrics ---
		let daysSinceLastMeasurement = 0;
		let averageGapDays = 0;

		if (latest) {
			daysSinceLastMeasurement = Math.max(
				0,
				differenceInDays(new Date(), new Date(latest.date)),
			);
		} else {
			daysSinceLastMeasurement = 999; // Indicates no measurements logged yet
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
		// -------------------------------------

		const fourWeeksAgoDate = subDays(new Date(), 28);
		const pastEntry =
			allEntries.find((e) => new Date(e.date) <= fourWeeksAgoDate) ||
			allEntries[allEntries.length - 1] ||
			null;

		const calculateDelta = (curr?: number | null, prev?: number | null) => {
			if (curr == null || prev == null) return null;
			return Number((curr - prev).toFixed(1));
		};

		const stats = {
			notes: latest?.notes ?? null,
			weight: {
				current: latest?.weightKg ?? null,
				delta: calculateDelta(latest?.weightKg, pastEntry?.weightKg),
				unit: "kg",
			},
			bodyFat: {
				current: latest?.bodyFatPercent ?? null,
				delta: calculateDelta(
					latest?.bodyFatPercent,
					pastEntry?.bodyFatPercent,
				),
				unit: "%",
			},
			arms: {
				current: latest?.armsIn ?? null,
				delta: calculateDelta(latest?.armsIn, pastEntry?.armsIn),
				unit: "in",
			},
		};

		const chartData = chartEntries.map((e) => ({
			rawDate: e.date,
			date: format(new Date(e.date), "MMM d"),
			weight: e.weightKg ? Number(e.weightKg) : null,
			bodyFat: e.bodyFatPercent ? Number(e.bodyFatPercent) : null,
			arms: e.armsIn ? Number(e.armsIn) : null,
			forearms: e.forearmsIn ? Number(e.forearmsIn) : null,
			thighs: e.thighsIn ? Number(e.thighsIn) : null,
			chest: e.chestIn ? Number(e.chestIn) : null,
			waist: e.waistIn ? Number(e.waistIn) : null,
			hips: e.hipsIn ? Number(e.hipsIn) : null,
		}));

		const tableData = allEntries.map((e) => ({
			id: e.id,
			date: format(new Date(e.date), "MMM d, yyyy"),
			rawDate: e.date,
			weightKg: e.weightKg ?? null,
			bodyFatPercent: e.bodyFatPercent ?? null,
			armsIn: e.armsIn ?? null,
			forearmsIn: e.forearmsIn ?? null,
			thighsIn: e.thighsIn ?? null,
			chestIn: e.chestIn ?? null,
			waistIn: e.waistIn ?? null,
			hipsIn: e.hipsIn ?? null,
		}));

		return {
			stats,
			chartData,
			tableData,
			qualityMetrics,
			latest,
		};
	} catch (error) {
		console.error("Error fetching metrics data:", error);
		return null;
	}
}
