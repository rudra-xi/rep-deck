function requireEnv(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(
			`Missing required environment variable: ${key}. ` +
				`Copy .env.example to .env.local and fill it in.`,
		);
	}
	return value;
}

export const env = {
	SUPABASE_URL: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
	SUPABASE_ANON_KEY: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
} as const;
