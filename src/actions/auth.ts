"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

// Helper to generate a default avatar seed
function generateDefaultAvatarSeed(identifier: string) {
	return `thumb-${identifier.slice(0, 8)}`;
}

// Sign in with Google
export async function signInWithGoogle(redirectTo?: string) {
	try {
		const supabase = await createClient();

		// Fallback order for header parsing in Next.js Server Actions
		const headersList = await headers();
		const host = headersList.get("host");
		const protocol = headersList.get("x-forwarded-proto") || "http";

		const origin =
			headersList.get("origin") ||
			(host
				? `${protocol}://${host}`
				: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

		// Construct the absolute callback endpoint
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

// Sign out
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

// Get current user
export async function getCurrentUser() {
	try {
		const supabase = await createClient();

		if (!supabase || !supabase.auth) {
			return { supabaseUser: null, dbUser: null };
		}

		// Direct, secure server-side user fetch (avoids insecure getSession)
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			return { supabaseUser: null, dbUser: null };
		}

		// Fetch database profile
		const [dbUser] = await db
			.select()
			.from(users)
			.where(eq(users.id, user.id));

		// If user exists in Auth but not in DB yet, attempt sync
		if (!dbUser) {
			const syncedUser = await syncUserWithDatabase();
			return { supabaseUser: user, dbUser: syncedUser };
		}

		// Backfill avatarSeed if user exists in DB but doesn't have an avatarSeed set
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

// Sync or create user in your database
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

		// Check if user exists in database
		const [existingUser] = await db
			.select()
			.from(users)
			.where(eq(users.id, user.id));

		if (existingUser) {
			// Update user profile metadata and seed if missing
			const [updatedUser] = await db
				.update(users)
				.set({
					name: user.user_metadata?.full_name || existingUser.name,
					avatarSeed:
						existingUser.avatarSeed ||
						generateDefaultAvatarSeed(user.id),
				})
				.where(eq(users.id, existingUser.id))
				.returning();

			return updatedUser || existingUser;
		}

		// Insert new database record with generated avatar seed
		const [newUser] = await db
			.insert(users)
			.values({
				id: user.id,
				email: user.email!,
				name:
					user.user_metadata?.full_name ||
					user.email?.split("@")[0] ||
					"User",
				avatarSeed: generateDefaultAvatarSeed(user.id),
			})
			.returning();

		return newUser;
	} catch (error) {
		console.error("Sync user error:", error);
		return null;
	}
}
