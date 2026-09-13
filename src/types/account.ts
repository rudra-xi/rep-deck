export interface UserProfile {
	id: string;
	supabaseUserId: string;
	name: string;
	email: string;
	createdAt: string;
	lastSignedInAt?: string;
}

export interface UserPreferences {
	weightUnit: "kg" | "lb";
	measurementUnit: "cm" | "in";
	defaultWorkoutDay?: string;
	showEstimated1RM?: boolean;
}
