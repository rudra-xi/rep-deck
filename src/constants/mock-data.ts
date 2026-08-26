export interface KpiCardData {
	id: string;
	label: string;
	value: string;
	subtext: string;
	trend?: {
		direction: "up" | "down" | "neutral";
		value: string;
	};
	action?: {
		label: string;
		href: string;
	};
	dropdownOptions?: {
		label: string;
		value: string;
		targetValue: string;
		subtext: string;
	}[];
}

export interface StrengthTrendDataPoint {
	date: string;
	squat: number | null;
	bench: number | null;
	deadlift: number | null;
	ohp: number | null;
}

export interface DashboardMockData {
	kpis: {
		program: KpiCardData;
		sessionsThisWeek: KpiCardData;
		bestLift: KpiCardData;
		bodyWeight: KpiCardData;
	};
	strengthTrend: StrengthTrendDataPoint[];
}

export const DASHBOARD_MOCK_DATA: DashboardMockData = {
	kpis: {
		program: {
			id: "program",
			label: "Program",
			value: "Base Sets v3",
			subtext: "Day 4 – Chest & Biceps (High)",
			action: {
				label: "Change",
				href: "/plans",
			},
		},
		sessionsThisWeek: {
			id: "sessions",
			label: "Sessions this week",
			value: "4",
			subtext: "Target: 5",
			trend: {
				direction: "up",
				value: "+1 vs last week",
			},
		},
		bestLift: {
			id: "best-lift",
			label: "Best Lift (Last 30d)",
			value: "80 kg × 5",
			subtext: "PR: 85 kg × 3",
			trend: {
				direction: "up",
				value: "+2.5 kg",
			},
			dropdownOptions: [
				{
					label: "Bench Press",
					value: "bench",
					targetValue: "80 kg × 5",
					subtext: "PR: 85 kg × 3",
				},
				{
					label: "Squat",
					value: "squat",
					targetValue: "125 kg × 3",
					subtext: "PR: 130 kg × 1",
				},
				{
					label: "Deadlift",
					value: "deadlift",
					targetValue: "155 kg × 2",
					subtext: "PR: 160 kg × 1",
				},
				{
					label: "Overhead Press",
					value: "ohp",
					targetValue: "60 kg × 5",
					subtext: "PR: 62.5 kg × 3",
				},
			],
		},
		bodyWeight: {
			id: "body-weight",
			label: "Body weight",
			value: "74.2 kg",
			subtext: "−0.6 kg in 4 weeks",
			trend: {
				direction: "down",
				value: "-0.6 kg",
			},
		},
	},
	strengthTrend: [
		{ date: "Jul 01", squat: 110, bench: 75, deadlift: 140, ohp: 50 },
		{ date: "Jul 08", squat: 112.5, bench: 75, deadlift: 142.5, ohp: 52.5 },
		{ date: "Jul 15", squat: 115, bench: 77.5, deadlift: 145, ohp: 52.5 },
		{ date: "Jul 22", squat: 115, bench: 77.5, deadlift: 147.5, ohp: 55 },
		{ date: "Jul 29", squat: 117.5, bench: 80, deadlift: 150, ohp: 55 },
		{ date: "Aug 05", squat: 120, bench: 80, deadlift: 150, ohp: 57.5 },
		{
			date: "Aug 12",
			squat: 122.5,
			bench: 82.5,
			deadlift: 152.5,
			ohp: 57.5,
		},
		{ date: "Aug 19", squat: 125, bench: 82.5, deadlift: 155, ohp: 60 },
	],
};

export interface TopSet {
	id: string;
	exercise: string;
	weightKg: number;
	reps: number;
	isPR?: boolean;
}

export interface LastWorkoutSession {
	id: string;
	date: string;
	programName: string;
	dayName: string;
	topLifts: TopSet[];
}

export const mockLastWorkout: LastWorkoutSession = {
	id: "session-104",
	date: "Yesterday, 5:30 PM",
	programName: "v3",
	dayName: "Day 2: Legs (High)",
	topLifts: [
		{ id: "1", exercise: "Back Squat", weightKg: 140, reps: 6, isPR: true },
		{ id: "2", exercise: "Romanian Deadlift", weightKg: 120, reps: 8 },
		{ id: "3", exercise: "Leg Press", weightKg: 220, reps: 10 },
	],
};

export type ExerciseTemplate = {
	id: string;
	name: string;
	type: "Primary" | "Secondary" | "Extra";
	target: string;
	lastSession: string;
};

export const MOCK_PROGRAM_DAYS: Record<number, ExerciseTemplate[]> = {
	1: [
		{
			id: "ex-101",
			name: "Incline Barbell Bench Press",
			type: "Primary",
			target: "3 Sets × 6-8 Reps",
			lastSession: "80kg × 8",
		},
		{
			id: "ex-102",
			name: "Standing Dumbbell Bicep Curls",
			type: "Secondary",
			target: "4 Sets × 10-12 Reps",
			lastSession: "16kg × 10",
		},
		{
			id: "ex-103",
			name: "Cable Chest Flyes",
			type: "Extra",
			target: "3 Sets × 12-15 Reps",
			lastSession: "15kg × 12",
		},
	],
	2: [
		{
			id: "ex-201",
			name: "Barbell Bent-Over Row",
			type: "Primary",
			target: "4 Sets × 8-10 Reps",
			lastSession: "85kg × 8",
		},
		{
			id: "ex-202",
			name: "Tricep Rope Pushdowns",
			type: "Secondary",
			target: "3 Sets × 12-15 Reps",
			lastSession: "27.5kg × 12",
		},
	],
	3: [
		{
			id: "ex-301",
			name: "Barbell Back Squat",
			type: "Primary",
			target: "4 Sets × 5 Reps",
			lastSession: "120kg × 5",
		},
		{
			id: "ex-302",
			name: "Hanging Leg Raises",
			type: "Secondary",
			target: "3 Sets × 15 Reps",
			lastSession: "Bodyweight × 15",
		},
	],
	4: [
		{
			id: "ex-401",
			name: "Overhead Dumbbell Press",
			type: "Primary",
			target: "4 Sets × 8-10 Reps",
			lastSession: "28kg × 8",
		},
		{
			id: "ex-402",
			name: "Lateral Cable Raises",
			type: "Secondary",
			target: "4 Sets × 12-15 Reps",
			lastSession: "10kg × 12",
		},
	],
	5: [
		{
			id: "ex-501",
			name: "Romanian Deadlift",
			type: "Primary",
			target: "3 Sets × 8-10 Reps",
			lastSession: "110kg × 8",
		},
		{
			id: "ex-502",
			name: "Incline Dumbbell Press",
			type: "Secondary",
			target: "3 Sets × 10-12 Reps",
			lastSession: "32kg × 10",
		},
	],
	6: [
		{
			id: "ex-601",
			name: "Kettlebell Swings",
			type: "Primary",
			target: "5 Sets × 20 Reps",
			lastSession: "24kg × 20",
		},
		{
			id: "ex-602",
			name: "Ab Wheel Rollouts",
			type: "Secondary",
			target: "4 Sets × 12 Reps",
			lastSession: "Bodyweight × 12",
		},
	],
};

export const DAYS = [
	{ id: 1, label: "Day 1 – Chest & Biceps (Heavy)" },
	{ id: 2, label: "Day 2 – Back & Triceps (Hypertrophy)" },
	{ id: 3, label: "Day 3 – Legs & Abs (Heavy)" },
	{ id: 4, label: "Day 4 – Shoulders & Arms" },
	{ id: 5, label: "Day 5 – Full Body Volume" },
	{ id: 6, label: "Day 6 – Conditioning & Core" },
];
