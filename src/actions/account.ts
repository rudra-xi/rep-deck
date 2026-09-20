"server-only";
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { UserPreferences } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./auth";

export async function getUserProfile() {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		throw new Error("Unauthorized");
	}

	const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));

	return {
		id: user.id,
		supabaseUserId: user.id,
		name: dbUser?.name || user.user_metadata?.full_name || "",
		email: user.email || "",
		createdAt: dbUser?.createdAt
			? dbUser.createdAt.toISOString()
			: user.created_at,
		lastSignedInAt: user.last_sign_in_at,
	};
}

export async function updateProfile(data: { name: string }) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return { success: false, error: "Unauthorized" };

		await db
			.update(users)
			.set({ name: data.name })
			.where(eq(users.id, user.id));

		revalidatePath("/account");
		return { success: true };
	} catch (err) {
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to update profile",
		};
	}
}

export async function getUserPreferences(): Promise<UserPreferences> {
	const { dbUser } = await getCurrentUser();
	if (!dbUser) return { weightUnit: "kg", measurementUnit: "in" };

	return {
		weightUnit: (dbUser.weightUnit as "kg" | "lb") || "kg",
		measurementUnit: (dbUser.measurementUnit as "cm" | "in") || "in",
	};
}

export async function updatePreferences(preferences: UserPreferences) {
	try {
		const { dbUser } = await getCurrentUser();
		if (!dbUser) return { success: false, error: "Unauthorized" };

		await db
			.update(users)
			.set({
				weightUnit: preferences.weightUnit,
				measurementUnit: preferences.measurementUnit,
			})
			.where(eq(users.id, dbUser.id));

		revalidatePath("/account");
		revalidatePath("/metrics");
		revalidatePath("/dashboard");
		return { success: true };
	} catch (err) {
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to save preferences",
		};
	}
}
