export type LoggedSet = {
	id: string;
	exerciseName: string;
	weight: string;
	reps: string;
	rpe: string;
	notes: string;
	templateId?: string;
};

// You can also add other workout-related types here
export type Exercise = {
	id: string;
	name: string;
	type: "Primary" | "Secondary" | "Accessory";
	target: string;
	lastSession: string;
};

export type Day = {
	id: number;
	label: string;
	exercises?: Exercise[];
};
