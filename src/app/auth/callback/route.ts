import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { syncUserWithDatabase } from "@/actions/auth";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const code = url.searchParams.get("code");
	const next = url.searchParams.get("next") ?? "/dashboard";

	if (!code) {
		return NextResponse.redirect(
			new URL("/?error=missing_code", url.origin),
		);
	}

	const supabase = await createClient();

	const { error } = await supabase.auth.exchangeCodeForSession(code);

	if (error) {
		console.error("OAuth exchange failed:", error);

		return NextResponse.redirect(
			new URL(`/?error=${encodeURIComponent(error.message)}`, url.origin),
		);
	}

	console.log("✅ Supabase OAuth session created");

	// Sync authenticated Supabase user into Drizzle
	const dbUser = await syncUserWithDatabase();

	if (!dbUser) {
		console.error("❌ Failed to sync user into database");

		return NextResponse.redirect(
			new URL("/?error=user_sync_failed", url.origin),
		);
	}

	console.log("✅ User synced to Drizzle:", dbUser.email);

	const safeNext = next.startsWith("/") ? next : "/dashboard";

	return NextResponse.redirect(new URL(safeNext, url.origin));
}
