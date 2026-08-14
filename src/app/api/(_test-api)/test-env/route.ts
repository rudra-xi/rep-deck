import { NextResponse } from "next/server";

export async function GET() {
  // Get all environment variables (only safe ones)
  const env = {
    // Database URLs (masked for security)
    DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
    DIRECT_URL: process.env.DIRECT_URL ? "✅ Set" : "❌ Missing",
    DATABASE_URL_Preview: process.env.DATABASE_URL ? 
      process.env.DATABASE_URL : 
      "Not set",
    DIRECT_URL_Preview: process.env.DIRECT_URL ? 
      process.env.DIRECT_URL: 
      "Not set",
    
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : 
      "❌ Missing",
    
    // Environment info
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
  };

  return NextResponse.json({
    success: true,
    environment: env,
    timestamp: new Date().toISOString(),
  });
}