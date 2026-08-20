import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
	try {
		const response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					get(name: string) {
						return request.cookies.get(name)?.value;
					},
					set(name: string, value: string, options: any) {
						response.cookies.set({
							name,
							value,
							...options,
						});
					},
					remove(name: string, options: any) {
						response.cookies.set({
							name,
							value: "",
							...options,
						});
					},
				},
			},
		);

		await supabase.auth.getUser();

		return response;
	} catch (error) {
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
};
