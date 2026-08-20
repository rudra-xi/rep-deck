import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const cookieStore = await cookies();

	// 1. Validate session token from request cookies
	const sessionToken =
		cookieStore.get("next-auth.session-token")?.value ||
		cookieStore.get("__Secure-next-auth.session-token")?.value ||
		cookieStore.get("session_token")?.value;

	// 2. Return 401 Unauthorized if no active session exists
	if (!sessionToken) {
		return NextResponse.json(
			{ error: "Unauthorized access. Please log in at /" },
			{ status: 401 },
		);
	}

	// 3. Perform authenticated data fetching / business logic
	return NextResponse.json(
		{
			status: "success",
			message: "Authenticated access granted.",
			// Return protected user data here
		},
		{ status: 200 },
	);
}
