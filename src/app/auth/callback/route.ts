import { NextResponse } from "next/server";
import { syncUserWithDatabase } from "@/actions/auth";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
	console.log("=== Auth Callback Started ===");

	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") || "/dashboard";

	console.log("Code present:", !!code);
	console.log("Next redirect:", next);
	console.log("Origin:", origin);

	if (code) {
		try {
			const supabase = await createClient();

			console.log("Exchanging code for session...");
			const { data, error } =
				await supabase.auth.exchangeCodeForSession(code);

			if (error) {
				console.error("Exchange code error:", error);
				// Use the origin from the request instead of hardcoded URL
				return NextResponse.redirect(
					new URL(
						`/?error=${encodeURIComponent(error.message)}`,
						origin,
					),
				);
			}

			console.log("Session exchanged successfully!");
			console.log("User email:", data?.user?.email);

			// Sync user with your database
			try {
				console.log("Syncing user with database...");
				const syncedUser = await syncUserWithDatabase();
				console.log("User synced:", syncedUser?.id || "Failed to sync");
			} catch (syncError) {
				console.error("Sync error (continuing):", syncError);
			}

			// Use the origin from the request
			console.log("Redirecting to dashboard at:", origin);
			return NextResponse.redirect(new URL("/dashboard", origin));
		} catch (error) {
			console.error("Callback error:", error);
			return NextResponse.redirect(
				new URL(
					`/?error=${encodeURIComponent("Callback failed")}`,
					origin,
				),
			);
		}
	}

	console.log("No code provided, redirecting to home");
	return NextResponse.redirect(new URL("/?error=no_code", origin));
}
