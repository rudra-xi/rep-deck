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
