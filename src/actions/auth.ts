"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

// Sign in with Google
export async function signInWithGoogle(redirectTo?: string) {
	try {
		const supabase = await createClient();

		// Get the origin from the request headers
		const headersList = await headers();
		const origin =
			headersList.get("origin") ||
			process.env.NEXT_PUBLIC_APP_URL ||
			"http://localhost:3000";

		console.log("Sign in origin:", origin);

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${origin}/auth/callback${redirectTo ? `?next=${redirectTo}` : ""}`,
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
			console.log("Redirecting to:", data.url);
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
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/");
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
			.where(eq(users.supabaseUserId, user.id));

		// If user exists in Auth but not in DB yet, attempt sync
		if (!dbUser) {
			const syncedUser = await syncUserWithDatabase();
			return { supabaseUser: user, dbUser: syncedUser };
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
			.where(eq(users.supabaseUserId, user.id));

		if (existingUser) {
			// Update user profile metadata
			const [updatedUser] = await db
				.update(users)
				.set({
					name: user.user_metadata?.full_name || existingUser.name,
				})
				.where(eq(users.id, existingUser.id))
				.returning();

			return updatedUser || existingUser;
		}

		// Insert new database record
		const [newUser] = await db
			.insert(users)
			.values({
				supabaseUserId: user.id,
				email: user.email!,
				name:
					user.user_metadata?.full_name ||
					user.email?.split("@")[0] ||
					"User",
			})
			.returning();

		return newUser;
	} catch (error) {
		console.error("Sync user error:", error);
		return null;
	}
}
