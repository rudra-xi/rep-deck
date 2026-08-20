import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";
import { createClient } from "@/utils/supabase/server";

export async function proxy(request: NextRequest) {
	// First, update the session
	const response = await updateSession(request);

	// Check if user is authenticated
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const path = request.nextUrl.pathname;

	// Define public routes (only these are accessible without auth)
	const publicRoutes = ["/", "/auth/callback"];
	const isPublicRoute = publicRoutes.some(
		(route) => path === route || path.startsWith(route),
	);

	// Define protected routes (require auth)
	const protectedRoutes = ["/dashboard", "/profile", "/settings"];
	const isProtectedRoute = protectedRoutes.some(
		(route) => path === route || path.startsWith(route),
	);

	// If not authenticated and trying to access protected route
	if (!user && isProtectedRoute) {
		console.log("🔒 Unauthenticated access to protected route:", path);
		return NextResponse.redirect(new URL("/", request.url));
	}

	// If authenticated and trying to access landing page
	if (user && path === "/") {
		console.log(
			"🔓 Authenticated user on landing page, redirecting to dashboard",
		);
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// If not authenticated and trying to access auth/callback, allow it
	if (!user && path === "/auth/callback") {
		return response;
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 */
		"/((?!_next/static|_next/image|favicon.ico|public).*)",
	],
};
