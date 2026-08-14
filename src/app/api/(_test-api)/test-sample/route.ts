import { NextResponse } from "next/server";
import postgres from "postgres";

export async function GET() {
	try {
		const connectionString =
			process.env.DIRECT_URL || process.env.DATABASE_URL;

		// Try with SSL disabled
		const sql = postgres(connectionString, {
			ssl: false, // ✅ Fixes self-signed certificate error
		});

		const result =
			await sql`SELECT 1 as test, NOW() as time, current_database() as database`;

		return NextResponse.json({
			success: true,
			message: "✅ Direct PostgreSQL connection successful!",
			result: result,
		});
	} catch (error: any) {
		console.error("Simple connection test failed:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message,
				code: error.code,
				stack: error.stack,
			},
			{ status: 500 },
		);
	}
}
