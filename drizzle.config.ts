/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	schemaFilter: ["public"],
	dbCredentials: {
		url: process.env.DIRECT_URL!,
	},
});
