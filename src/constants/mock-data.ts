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

export interface Exercise {
	id: string;
	name: string;
	type: "Primary" | "Secondary" | "Extra";
	sets: number;
	reps: string;
}

export interface DayPlan {
	id: number;
	label: string;
	title: string;
	exercises: Exercise[];
}

export interface Plan {
	id: string;
	name: string;
	version: string;
	startDate: string;
	endDate: string;
	isActive: boolean;
	days: DayPlan[];
}

export const PLANS_MOCK_DATA: Plan[] = [
	{
		id: "v1",
		name: "Base Sets",
		version: "v1",
		startDate: "2025-01-01",
		endDate: "2025-03-31",
		isActive: false,
		days: [
			{
				id: 1,
				label: "Day 1",
				title: "Chest & Triceps",
				exercises: [
					{
						id: "e1",
						name: "Flat Bench Press",
						type: "Primary",
						sets: 3,
						reps: "8 - 10",
					},
					{
						id: "e2",
						name: "Incline Dumbbell Flyes",
						type: "Secondary",
						sets: 3,
						reps: "10 - 12",
					},
					{
						id: "e3",
						name: "Tricep Pushdowns",
						type: "Extra",
						sets: 3,
						reps: "12 - 15",
					},
				],
			},
			{
				id: 2,
				label: "Day 2",
				title: "Back & Biceps",
				exercises: [
					{
						id: "e4",
						name: "Lat Pulldown",
						type: "Primary",
						sets: 4,
						reps: "8 - 10",
					},
					{
						id: "e5",
						name: "Seated Cable Row",
						type: "Secondary",
						sets: 3,
						reps: "10 - 12",
					},
				],
			},
		],
	},
	{
		id: "v2",
		name: "Base Sets",
		version: "v2",
		startDate: "2025-04-01",
		endDate: "2025-06-30",
		isActive: false,
		days: [
			{
				id: 1,
				label: "Day 1",
				title: "Upper Power",
				exercises: [
					{
						id: "e6",
						name: "Overhead Press",
						type: "Primary",
						sets: 4,
						reps: "5 - 6",
					},
					{
						id: "e7",
						name: "Barbell Row",
						type: "Primary",
						sets: 4,
						reps: "6 - 8",
					},
				],
			},
		],
	},
	{
		id: "v3",
		name: "Base Sets",
		version: "v3",
		startDate: "2025-07-01",
		endDate: "2025-09-30",
		isActive: true,
		days: [
			{
				id: 1,
				label: "Day 1",
				title: "Chest & Biceps (Heavy)",
				exercises: [
					{
						id: "e8",
						name: "Barbell Bench Press",
						type: "Primary",
						sets: 4,
						reps: "6 - 8",
					},
					{
						id: "e9",
						name: "Incline Dumbbell Press",
						type: "Secondary",
						sets: 3,
						reps: "8 - 10",
					},
					{
						id: "e10",
						name: "Cable Flyes",
						type: "Secondary",
						sets: 3,
						reps: "12 - 15",
					},
					{
						id: "e11",
						name: "EZ-Bar Bicep Curls",
						type: "Extra",
						sets: 4,
						reps: "10 - 12",
					},
				],
			},
			{
				id: 2,
				label: "Day 2",
				title: "Back & Abs (Volume)",
				exercises: [
					{
						id: "e12",
						name: "Barbell Deadlift",
						type: "Primary",
						sets: 3,
						reps: "5",
					},
					{
						id: "e13",
						name: "Chest-Supported Row",
						type: "Secondary",
						sets: 4,
						reps: "8 - 12",
					},
					{
						id: "e14",
						name: "Hanging Leg Raises",
						type: "Extra",
						sets: 3,
						reps: "15",
					},
				],
			},
			{
				id: 3,
				label: "Day 3",
				title: "Legs & Shoulders",
				exercises: [
					{
						id: "e15",
						name: "Barbell Back Squat",
						type: "Primary",
						sets: 4,
						reps: "6 - 8",
					},
					{
						id: "e16",
						name: "Dumbbell Lateral Raise",
						type: "Secondary",
						sets: 4,
						reps: "12 - 15",
					},
				],
			},
			{
				id: 4,
				label: "Day 4",
				title: "Rest / Active Recovery",
				exercises: [],
			},
			{
				id: 5,
				label: "Day 5",
				title: "Upper Body Hypertrophy",
				exercises: [
					{
						id: "e17",
						name: "Dumbbell Incline Bench",
						type: "Primary",
						sets: 4,
						reps: "8 - 10",
					},
					{
						id: "e18",
						name: "Face Pulls",
						type: "Extra",
						sets: 4,
						reps: "15 - 20",
					},
				],
			},
			{
				id: 6,
				label: "Day 6",
				title: "Lower Body Strength",
				exercises: [
					{
						id: "e19",
						name: "Romanian Deadlift",
						type: "Primary",
						sets: 4,
						reps: "8",
					},
					{
						id: "e20",
						name: "Leg Press",
						type: "Secondary",
						sets: 3,
						reps: "10 - 12",
					},
				],
			},
		],
	},
	{
		id: "v4",
		name: "Hypertrophy Block",
		version: "v4",
		startDate: "2025-10-01",
		endDate: "2025-12-31",
		isActive: false,
		days: [
			{
				id: 1,
				label: "Day 1",
				title: "Push Focus",
				exercises: [
					{
						id: "e21",
						name: "Standing Overhead Press",
						type: "Primary",
						sets: 4,
						reps: "8 - 10",
					},
				],
			},
		],
	},
];

export interface StrengthDataPoint {
	date: string;
	bench: number;
	squat: number;
	deadlift: number;
	ohp: number;
}

export interface LiftDetailPoint {
	date: string;
	weight: number;
	estimated1RM: number;
	volume: number;
	isPR?: boolean;
}

export interface BodyMetricPoint {
	date: string;
	weight: number;
	bodyFat: number;
	waist?: number;
	arms?: number;
}

export interface PastSession {
	id: string;
	date: string;
	programName: string;
	dayLabel: string;
	totalVolume: string;
	keyLiftsSummary: string;
}

export interface FrequencyPoint {
	weekLabel: string;
	sessionsCount: number;
}

export const STRENGTH_TREND_DATA: StrengthDataPoint[] = [
	{ date: "Jan 05", bench: 80, squat: 100, deadlift: 120, ohp: 50 },
	{ date: "Jan 19", bench: 82.5, squat: 105, deadlift: 125, ohp: 52.5 },
	{ date: "Feb 02", bench: 85, squat: 107.5, deadlift: 130, ohp: 55 },
	{ date: "Feb 16", bench: 85, squat: 110, deadlift: 135, ohp: 55 },
	{ date: "Mar 02", bench: 87.5, squat: 115, deadlift: 140, ohp: 57.5 },
	{ date: "Mar 16", bench: 90, squat: 117.5, deadlift: 142.5, ohp: 60 },
];

export const LIFT_DETAILS_DATA: Record<string, LiftDetailPoint[]> = {
	bench: [
		{ date: "Jan 05", weight: 80, estimated1RM: 92, volume: 2400 },
		{ date: "Jan 19", weight: 82.5, estimated1RM: 95, volume: 2475 },
		{
			date: "Feb 02",
			weight: 85,
			estimated1RM: 98,
			volume: 2550,
			isPR: true,
		},
		{ date: "Feb 16", weight: 85, estimated1RM: 98, volume: 2550 },
		{ date: "Mar 02", weight: 87.5, estimated1RM: 101, volume: 2625 },
		{
			date: "Mar 16",
			weight: 90,
			estimated1RM: 104,
			volume: 2700,
			isPR: true,
		},
	],
	squat: [
		{ date: "Jan 05", weight: 100, estimated1RM: 115, volume: 3000 },
		{ date: "Jan 19", weight: 105, estimated1RM: 121, volume: 3150 },
		{ date: "Feb 02", weight: 107.5, estimated1RM: 124, volume: 3225 },
		{
			date: "Feb 16",
			weight: 110,
			estimated1RM: 127,
			volume: 3300,
			isPR: true,
		},
		{ date: "Mar 02", weight: 115, estimated1RM: 132, volume: 3450 },
		{
			date: "Mar 16",
			weight: 117.5,
			estimated1RM: 135,
			volume: 3525,
			isPR: true,
		},
	],
	deadlift: [
		{ date: "Jan 05", weight: 120, estimated1RM: 138, volume: 1800 },
		{ date: "Jan 19", weight: 125, estimated1RM: 144, volume: 1875 },
		{ date: "Feb 02", weight: 130, estimated1RM: 150, volume: 1950 },
		{
			date: "Feb 16",
			weight: 135,
			estimated1RM: 155,
			volume: 2025,
			isPR: true,
		},
		{ date: "Mar 02", weight: 140, estimated1RM: 161, volume: 2100 },
		{
			date: "Mar 16",
			weight: 142.5,
			estimated1RM: 164,
			volume: 2137,
			isPR: true,
		},
	],
	ohp: [
		{ date: "Jan 05", weight: 50, estimated1RM: 58, volume: 1500 },
		{ date: "Jan 19", weight: 52.5, estimated1RM: 60, volume: 1575 },
		{
			date: "Feb 02",
			weight: 55,
			estimated1RM: 63,
			volume: 1650,
			isPR: true,
		},
		{ date: "Feb 16", weight: 55, estimated1RM: 63, volume: 1650 },
		{ date: "Mar 02", weight: 57.5, estimated1RM: 66, volume: 1725 },
		{
			date: "Mar 16",
			weight: 60,
			estimated1RM: 69,
			volume: 1800,
			isPR: true,
		},
	],
};

export const BODY_METRICS_DATA: BodyMetricPoint[] = [
	{ date: "Jan 01", weight: 82.4, bodyFat: 18.5, waist: 86, arms: 37.5 },
	{ date: "Jan 15", weight: 81.8, bodyFat: 18.1, waist: 85.5, arms: 37.5 },
	{ date: "Feb 01", weight: 81.2, bodyFat: 17.6, waist: 85, arms: 38 },
	{ date: "Feb 15", weight: 80.7, bodyFat: 17.0, waist: 84.2, arms: 38 },
	{ date: "Mar 01", weight: 80.3, bodyFat: 16.2, waist: 83.8, arms: 38.5 },
	{ date: "Mar 15", weight: 80.0, bodyFat: 15.5, waist: 83.0, arms: 38.5 },
];

export const PAST_SESSIONS_DATA: PastSession[] = [
	{
		id: "s1",
		date: "Mar 16, 2026",
		programName: "Base Sets (v3)",
		dayLabel: "Day 1",
		totalVolume: "12,450 kg",
		keyLiftsSummary: "Bench Press 90kg x 8, Incline DB 32kg x 10",
	},
	{
		id: "s2",
		date: "Mar 14, 2026",
		programName: "Base Sets (v3)",
		dayLabel: "Day 6",
		totalVolume: "14,800 kg",
		keyLiftsSummary: "RDL 120kg x 8, Leg Press 220kg x 12",
	},
	{
		id: "s3",
		date: "Mar 12, 2026",
		programName: "Base Sets (v3)",
		dayLabel: "Day 5",
		totalVolume: "10,200 kg",
		keyLiftsSummary: "Incline DB Bench 34kg x 8, Face Pulls 40kg x 15",
	},
	{
		id: "s4",
		date: "Mar 09, 2026",
		programName: "Base Sets (v3)",
		dayLabel: "Day 3",
		totalVolume: "15,600 kg",
		keyLiftsSummary: "Squat 117.5kg x 6, Lateral Raises 14kg x 15",
	},
];

export const FREQUENCY_DATA: FrequencyPoint[] = [
	{ weekLabel: "W1", sessionsCount: 4 },
	{ weekLabel: "W2", sessionsCount: 5 },
	{ weekLabel: "W3", sessionsCount: 4 },
	{ weekLabel: "W4", sessionsCount: 3 },
	{ weekLabel: "W5", sessionsCount: 5 },
	{ weekLabel: "W6", sessionsCount: 4 },
	{ weekLabel: "W7", sessionsCount: 5 },
	{ weekLabel: "W8", sessionsCount: 4 },
];
