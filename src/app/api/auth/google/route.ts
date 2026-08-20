import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
	try {
		const supabase = await createClient();

		if (!supabase || !supabase.auth) {
			return NextResponse.json(
				{ error: "Authentication service is not available" },
				{ status: 500 },
			);
		}

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});

		if (error) {
			console.error("Google sign-in error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (data?.url) {
			return NextResponse.redirect(data.url);
		}

		return NextResponse.json(
			{ error: "No redirect URL received" },
			{ status: 500 },
		);
	} catch (error) {
		console.error("Sign in error:", error);
		return NextResponse.json(
			{ error: "Failed to sign in with Google" },
			{ status: 500 },
		);
	}
}
