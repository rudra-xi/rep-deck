"use server";

import { eq } from "drizzle-orm";
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

		console.log("OAuth Redirect Target:", callbackUrl.toString());

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
			return redirect(data.url);
		}

		return { error: "No redirect URL received" };
	} catch (error) {
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}
		console.error("Sign in error:", error);
		return { error: "Failed to sign in with Google" };
	}
}

export async function signOut() {
	try {
		const supabase = await createClient();
		await supabase.auth.signOut();

		return {
			success: true,
			message: "Signed out successfully",
		};
	} catch (error) {
		console.error("Sign out error:", error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "Failed to sign out",
		};
	}
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

		if (!supabase || !supabase.auth) {
			console.error("Supabase client or auth is undefined");
			return null;
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			console.error("No authenticated user found to sync");
			return null;
		}

		const [existingUser] = await db
			.select()
			.from(users)
			.where(eq(users.id, user.id));

		const rawName =
			user.user_metadata?.full_name ||
			user.email?.split("@")[0] ||
			"User";

		if (existingUser) {
			const [updatedUser] = await db
				.update(users)
				.set({
					name: toCapitalized(rawName),
					avatarSeed:
						existingUser.avatarSeed ||
						generateDefaultAvatarSeed(user.id),
				})
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
