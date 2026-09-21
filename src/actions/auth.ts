"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { toCapitalized } from "@/lib/to-capitalized";
import { createClient } from "@/utils/supabase/server";

function generateDefaultAvatarSeed(identifier: string) {
	return `thumb-${identifier.slice(0, 8)}`;
}

export async function signInWithGoogle(redirectTo?: string) {
	try {
		const supabase = await createClient();

		const headersList = await headers();
		const host = headersList.get("host");
		const protocol = headersList.get("x-forwarded-proto") || "http";

		const origin =
			headersList.get("origin") ||
			(host
				? `${protocol}://${host}`
				: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

		const callbackUrl = new URL("/auth/callback", origin);
		if (redirectTo) {
			callbackUrl.searchParams.set("next", redirectTo);
		}

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: callbackUrl.toString(),
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});

		if (error) {
			console.error("Google sign-in error:", error);
			return { error: error.message };
		}

		if (data?.url) {
			redirect(data.url);
		}

		return { error: "No redirect URL received" };
	} catch (error) {
		if (isRedirectError(error)) throw error;
		console.error("Sign in error:", error);
		return { error: "Failed to sign in with Google" };
	}
}

export async function signOut() {
	const supabase = await createClient();
	await supabase.auth.signOut();

	revalidatePath("/", "layout");

	redirect("/");
}

export async function getCurrentUser() {
	try {
		const supabase = await createClient();

		if (!supabase || !supabase.auth) {
			return { supabaseUser: null, dbUser: null };
		}

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			return { supabaseUser: null, dbUser: null };
		}

		const [dbUser] = await db
			.select()
			.from(users)
			.where(eq(users.id, user.id));

		if (!dbUser) {
			const syncedUser = await syncUserWithDatabase();
			if (!syncedUser) return { supabaseUser: null, dbUser: null };
			return { supabaseUser: user, dbUser: syncedUser };
		}

		if (!dbUser.avatarSeed) {
			const [updatedUser] = await db
				.update(users)
				.set({
					avatarSeed: generateDefaultAvatarSeed(user.id),
				})
				.where(eq(users.id, dbUser.id))
				.returning();

			return { supabaseUser: user, dbUser: updatedUser || dbUser };
		}

		return { supabaseUser: user, dbUser };
	} catch (error) {
		console.error("Get current user error:", error);
		return { supabaseUser: null, dbUser: null };
	}
}

export async function syncUserWithDatabase() {
	try {
		const supabase = await createClient();
		if (!supabase || !supabase.auth) return null;

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return null;
		if (!user.email) return null;

		const [existingUser] = await db
			.select()
			.from(users)
			.where(eq(users.id, user.id));

		const rawName =
			user.user_metadata?.full_name || user.email.split("@")[0] || "User";

		if (existingUser) {
			const updates: Record<string, unknown> = {};

			if (!existingUser.name) {
				updates.name = toCapitalized(rawName);
			}

			if (!existingUser.avatarSeed) {
				updates.avatarSeed = generateDefaultAvatarSeed(user.id);
			}

			if (Object.keys(updates).length === 0) {
				return existingUser;
			}

			const [updatedUser] = await db
				.update(users)
				.set(updates)
				.where(eq(users.id, existingUser.id))
				.returning();

			return updatedUser || existingUser;
		}

		const [newUser] = await db
			.insert(users)
			.values({
				id: user.id,
				email: user.email,
				name: toCapitalized(rawName),
				avatarSeed: generateDefaultAvatarSeed(user.id),
			})
			.returning();

		return newUser;
	} catch (error) {
		console.error("Sync user error:", error);
		return null;
	}
}
