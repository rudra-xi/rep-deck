import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function proxy(request: NextRequest) {
	const response = NextResponse.next({ request });

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

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const path = request.nextUrl.pathname;

	const publicRoutes = ["/", "/auth/callback"];
	const isPublicRoute = publicRoutes.some(
		(route) => path === route || path.startsWith(`${route}/`),
	);

	if (user && path === "/") {
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard";
		return NextResponse.redirect(url);
	}

	if (!user && !isPublicRoute) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
