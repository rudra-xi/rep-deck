/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

import { createClient } from "@supabase/supabase-js";
import * as schema from "./schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export schema for types
export { schema };

// Create a mock db for compatibility
export const db = {
	query: {
		users: {
			findMany: async () => {
				const { data, error } = await supabase
					.from("users")
					.select("*");
				if (error) throw error;
				return data;
			},
		},
		programTemplates: {
			findMany: async () => {
				const { data, error } = await supabase
					.from("program_templates")
					.select("*");
				if (error) throw error;
				return data;
			},
		},
		workoutSessions: {
			findMany: async (options?: any) => {
				let query = supabase.from("workout_sessions").select(`
          *,
          workout_sets (*)
        `);
				if (options?.with?.sets) {
					query = supabase.from("workout_sessions").select(`
            *,
            workout_sets (*)
          `);
				}
				const { data, error } = await query;
				if (error) throw error;
				return data;
			},
		},
	},
};
