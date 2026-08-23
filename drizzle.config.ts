import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema/index.ts",
	dialect: "postgresql",
	schemaFilter: ["public"],
	dbCredentials: {
		url: process.env.DIRECT_URL!,
		ssl: {
			rejectUnauthorized: false,
		},
	},
});
