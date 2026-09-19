import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(process.env.DATABASE_URL, {
	ssl: { rejectUnauthorized: false },
	max: 10,
	idle_timeout: 20,
	connect_timeout: 10,
	prepare: false,
});

export const db = drizzle({ client, schema });

export { client };

export * from "./schema";
