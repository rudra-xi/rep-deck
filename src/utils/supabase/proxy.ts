import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function updateSession(request: NextRequest) {
	const response = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		env.SUPABASE_URL,
		env.SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},

				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						request.cookies.set(name, value);
						response.cookies.set(name, value, options);
					});
				},
			},
		},
	);

	await supabase.auth.getUser();

	return response;
}
