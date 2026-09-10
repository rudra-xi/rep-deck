export type LoggedSet = {
	id: string;
	exerciseName: string;
	weight: number | string;
	reps: number | string;
	rpe: number | string;
	notes: string;
	templateId?: string;
	isPR?: boolean;
	setNumber?: number | string;
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
