import { NextResponse } from "next/server";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js"; // ⚠️ IMPORTANT: Add this import!
import * as schema from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const debugInfo: any = {
    steps: [],
    errors: [],
  };

  try {
    // Step 1: Check environment variables
    debugInfo.steps.push({
      step: "Checking environment variables",
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
      DIRECT_URL: process.env.DIRECT_URL ? "✅ Set" : "❌ Missing",
      NODE_ENV: process.env.NODE_ENV,
    });

    // Step 2: Try connecting with DIRECT_URL first
    debugInfo.steps.push({
      step: "Attempting connection with DIRECT_URL",
      using: "DIRECT_URL",
    });

    try {
      const client = postgres(process.env.DIRECT_URL!, { 
        prepare: false,
        ssl: false,
      });
      const testDb = drizzle(client, { schema });
      const result = await testDb.execute(sql`SELECT 1 as connected, NOW() as time`);
      
      debugInfo.steps.push({
        step: "✅ DIRECT_URL connection successful",
        result: result.rows[0],
      });
    } catch (directError: any) {
      debugInfo.errors.push({
        connection: "DIRECT_URL",
        error: directError.message,
        code: directError.code,
      });
      
      // Step 3: Try DATABASE_URL
      debugInfo.steps.push({
        step: "❌ DIRECT_URL failed, trying DATABASE_URL",
        using: "DATABASE_URL",
      });

      try {
        const client = postgres(process.env.DATABASE_URL!, { 
          prepare: false,
          ssl: false,
        });
        const testDb = drizzle(client, { schema });
        const result = await testDb.execute(sql`SELECT 1 as connected, NOW() as time`);
        
        debugInfo.steps.push({
          step: "✅ DATABASE_URL connection successful",
          result: result.rows[0],
        });
      } catch (dbError: any) {
        debugInfo.errors.push({
          connection: "DATABASE_URL",
          error: dbError.message,
          code: dbError.code,
        });
        throw dbError;
      }
    }

    // Step 4: Try to get tables
    try {
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      debugInfo.steps.push({
        step: "✅ Tables fetched successfully",
        tables: tables.rows.map((t: any) => t.table_name),
        count: tables.rows.length,
      });
    } catch (tableError: any) {
      debugInfo.errors.push({
        step: "Failed to fetch tables",
        error: tableError.message,
      });
    }

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    debugInfo.steps.push({
      step: "❌ Final connection failed",
      error: error.message,
      code: error.code,
    });

    return NextResponse.json({
      success: false,
      debug: debugInfo,
      error: error.message,
      code: error.code,
      hint: "Make sure all imports are correct",
    }, { status: 500 });
  }
}