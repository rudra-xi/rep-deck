import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}

// Configure postgres client with better settings
const client = postgres(process.env.DATABASE_URL, {
	ssl: { rejectUnauthorized: false },
	max: 10, // Maximum number of connections
	idle_timeout: 20, // Idle connection timeout in seconds
	connect_timeout: 10, // Connection timeout in seconds
	prepare: false, // Disable prepared statements for better compatibility
});

// Create drizzle instance with schema
export const db = drizzle({ client, schema });

// Export client for raw queries if needed
export { client };

// Export everything from schema
export * from "./schema";
