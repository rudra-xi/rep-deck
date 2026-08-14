import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Test connection
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.limit(1);

		if (error) {
			throw error;
		}

		// Try to get table list
		const { data: tables, error: tablesError } =
			await supabase.rpc("get_tables");

		return NextResponse.json({
			success: true,
			message: "Supabase connection successful!",
			users: data,
			tables: tables || [],
		});
	} catch (error: any) {
		console.error("Supabase test failed:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message,
				details: error.details || null,
				hint: "Make sure you've created the tables in Supabase",
			},
			{ status: 500 },
		);
	}
}
