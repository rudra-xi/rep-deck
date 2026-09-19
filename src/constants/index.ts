export const onboardingSteps = [
	{
		step: 1,
		title: "Build your plan",
		description:
			"Create a training block with days and exercises. Or duplicate an existing plan and version it up — v1, v2, v3 — without losing your history.",
	},
	{
		step: 2,
		title: "Log every set",
		description:
			"Your active plan pre-fills the workout screen. Enter weight, reps, and RPE set by set. Last session's numbers sit right beside the input so you always know what to beat.",
	},
	{
		step: 3,
		title: "Watch it compound",
		description:
			"Estimated 1RM trends, body measurements, and training frequency update as you log. Everything is preserved, even when you switch to a new block.",
	},
];

export const featuresData = [
	{
		id: 1,
		title: "Workout logging",
		description:
			"Log sets, reps, weight, RPE, and notes in seconds. Built for the gym floor — not for a spreadsheet.",
	},
	{
		id: 2,
		title: "Last session memory",
		description:
			"Every exercise shows your previous best and PR inline. No more guessing what you lifted last week.",
	},
	{
		id: 3,
		title: "Versioned programs",
		description:
			"Create reusable plan templates with days and exercises. Duplicate, version up, and switch blocks — your history stays intact.",
	},
	{
		id: 4,
		title: "Progress charts",
		description:
			"Estimated 1RM for the Big 4, upper/lower body measurements, session volume, and weekly training distribution — all in one place.",
	},
	{
		id: 5,
		title: "Body metrics tracking",
		description:
			"Weight, body fat, and six body measurements with automatic kg/lb and cm/in conversion. Data quality warnings keep your trendlines honest.",
	},
	{
		id: 6,
		title: "Personal records",
		description:
			"Every PR is detected automatically using estimated 1RM. Celebrate new bests with inline badges and a session-level PR summary.",
	},
];

export const faqData = [
	{
		id: 1,
		question: "Is Rep Deck free?",
		answer: "Core logging, plans, and progress tracking are free. You can start with a free account and only pay if you want advanced features later.",
	},
	{
		id: 2,
		question: "Do I need to set up my program before logging?",
		answer: "No — you can log ad-hoc sets any time. But creating a plan unlocks the planned-exercise workflow, which pre-fills targets and shows last session's numbers for each lift.",
	},
	{
		id: 3,
		question: "Can I switch between programs without losing history?",
		answer: "Yes. Create multiple plan versions (v1, v2, v3) and set any one as active. All past sessions, PRs, and trends stay tied to your account — nothing is deleted when you switch.",
	},
	{
		id: 4,
		question: "How does Google login work?",
		answer: "Sign in with Google in one click. Your progress syncs across devices automatically — no passwords to remember.",
	},
	{
		id: 5,
		question: "What units does Rep Deck use?",
		answer: "Everything is stored in metric (kg and inches) behind the scenes, and converted to your preferred units on the fly. Toggle kg/lb and cm/in any time from your account preferences.",
	},
];

export const ctaData = {
	title: "Ready to train with more clarity?",
	description:
		"Stop guessing what you lifted last week. Start logging every set, track your progress, and keep every training block organized in one place.",
	buttonText: "Start Tracking",
};

export const showcaseTabs = [
	{
		id: "log",
		label: "Workout Log",
		title: "Log every set without friction",
		description:
			"Pre-filled targets from your active program. Last session's numbers right beside the input. Mark done and move on.",
		bullets: [
			"Previous session shown inline",
			"Auto-calculated estimated 1RM",
			"Per-set RPE and notes",
			"Extra/ad-hoc sets supported",
		],
	},
	{
		id: "metrics",
		label: "Metrics",
		title: "Body composition, tracked properly",
		description:
			"Weight, body fat, and 6 body measurements with unit conversion, data quality warnings, and reminders.",
		bullets: [
			"kg/lb + cm/in auto-conversion",
			"Data quality scoring",
			"Measurement reminders",
			"7 measurement points",
		],
	},
	{
		id: "progress",
		label: "Progress",
		title: "See the trend, not just the number",
		description:
			"Estimated 1RM trends for the Big 4, upper/lower body measurements, and session volume — all in one place.",
		bullets: [
			"Big 4 strength trends",
			"Upper/lower body charts",
			"Weekly training distribution",
			"Personal record tracking",
		],
	},
	{
		id: "plans",
		label: "Plans",
		title: "Programs that evolve with you",
		description:
			"Build reusable templates with days and exercises. Duplicate, version, and switch blocks without losing history.",
		bullets: [
			"Multi-day program templates",
			"Duplicate & version control",
			"Switch active plan anytime",
			"Full history preserved",
		],
	},
] as const;

export type ShowcaseTabId = (typeof showcaseTabs)[number]["id"];

export const navigationData = [
	{
		id: "log",
		href: "/workout-log",
		label: "Workout Log",
		shortLabel: "Log",
		description: "Log today's session",
		group: "Do",
	},
	{
		id: "metrics",
		href: "/metrics",
		label: "Metrics",
		shortLabel: "Metrics",
		description: "Body measurements",
		group: "Track",
	},
	{
		id: "progress",
		href: "/progress",
		label: "Progress",
		shortLabel: "Progress",
		description: "Strength & size trends",
		group: "Review",
	},
	{
		id: "plans",
		href: "/plans",
		label: "Plans",
		shortLabel: "Plans",
		description: "Build & version programs",
		group: "Configure",
	},
] as const;

export const navigationGroupOrder = [
	"Do",
	"Track",
	"Review",
	"Configure",
] as const;

export const socialLinksData = [
	{
		id: 1,
		label: "GitHub",
		href: "https://github.com/rudra-xi",
	},
	{
		id: 2,
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/goutam-rudraxi/",
	},
	{
		id: 3,
		label: "Instagram",
		href: "https://instagram.com/rudra.xii",
	},
];

export const aboutData = {
	badge: "About Rep Deck",
	title: "Built for lifters who want clarity.",
	description:
		"Rep Deck is a clean workout tracker made to help you log sessions, follow your training plans, and review progress without noise. It's designed for people who care about the numbers that matter — strength, size, and consistency.",
	bullets: [
		{
			id: 1,
			text: "Track every set with ease.",
		},
		{
			id: 2,
			text: "Keep old programs and new blocks organized.",
		},
		{
			id: 3,
			text: "See your progress clearly over time.",
		},
	],
	creator: "Designed and built by rudra-xi.",
};

export interface Challenge {
	id: string;
	title: string;
	description: string;
	target: string;
	category: "Grip" | "Core" | "Endurance" | "Legs" | "Balance";
}

export const CHALLENGES: Challenge[] = [
	{
		id: "dead-hang",
		title: "Dead Hang Max",
		description:
			"Hang from a pull-up bar for as long as possible. Aim to beat your last time.",
		target: "Max Time",
		category: "Grip",
	},
	{
		id: "plank-hold",
		title: "Plank Hold",
		description: "Hold a strict plank with core engaged and neutral spine.",
		target: "60–90 sec",
		category: "Core",
	},
	{
		id: "pushup-sprint",
		title: "Push-Up Sprint",
		description:
			"Perform as many clean, full range-of-motion push-ups as possible.",
		target: "60 seconds",
		category: "Endurance",
	},
	{
		id: "wall-sit",
		title: "Wall Sit",
		description:
			"Back flat against the wall, knees bent at a strict 90° angle.",
		target: "60+ sec",
		category: "Legs",
	},
	{
		id: "hollow-body",
		title: "Hollow Body Hold",
		description:
			"Press lower back into the floor and hold a tight hollow body position.",
		target: "30–45 sec",
		category: "Core",
	},
	{
		id: "air-squat-ladder",
		title: "Air Squat Ladder",
		description:
			"Complete 10, 15, then 20 air squats with 30 seconds rest between sets.",
		target: "3 Sets",
		category: "Legs",
	},
	{
		id: "reverse-plank",
		title: "Reverse Plank Hold",
		description:
			"Drive hips high with arms extended behind you. Keep glutes engaged.",
		target: "30–45 sec",
		category: "Core",
	},
	{
		id: "farmers-carry",
		title: "Farmer's Carry",
		description:
			"Walk heel-to-toe in a straight line with arms at sides and core tight.",
		target: "30–45 sec",
		category: "Balance",
	},
	{
		id: "single-leg-balance",
		title: "Single-Leg Balance",
		description:
			"Stand on one leg with eyes closed. Maintain strict posture.",
		target: "20–30s / leg",
		category: "Balance",
	},
	{
		id: "burpee-burst",
		title: "Burpee Burst",
		description:
			"Perform clean burpees as fast as possible with good form.",
		target: "10 Reps",
		category: "Endurance",
	},
];

export const PRESET_EXERCISES = [
	{ name: "Bench Press", type: "Chest" },
	{ name: "Incline Bench Press", type: "Chest" },
	{ name: "Decline Bench Press", type: "Chest" },
	{ name: "Dumbbell Bench Press", type: "Chest" },
	{ name: "Incline Dumbbell Press", type: "Chest" },
	{ name: "Dumbbell Flyes", type: "Chest" },
	{ name: "Cable Flyes", type: "Chest" },
	{ name: "Pec Deck Flyes", type: "Chest" },
	{ name: "Push-Ups", type: "Chest" },

	{ name: "Overhead Press", type: "Shoulders" },
	{ name: "Dumbbell Shoulder Press", type: "Shoulders" },
	{ name: "Arnold Press", type: "Shoulders" },
	{ name: "Lateral Raise", type: "Shoulders" },
	{ name: "Front Raise", type: "Shoulders" },
	{ name: "Rear Delt Flyes", type: "Shoulders" },
	{ name: "Face Pull", type: "Shoulders" },
	{ name: "Upright Row", type: "Shoulders" },
	{ name: "Shrugs", type: "Shoulders" },

	{ name: "Lat Pulldown", type: "Back" },
	{ name: "Barbell Row", type: "Back" },
	{ name: "Dumbbell Row", type: "Back" },
	{ name: "Seated Cable Row", type: "Back" },
	{ name: "T-Bar Row", type: "Back" },
	{ name: "Pull-Ups", type: "Back" },
	{ name: "Chin-Ups", type: "Back" },
	{ name: "Deadlift", type: "Back" },
	{ name: "Romanian Deadlift", type: "Back" },
	{ name: "Good Mornings", type: "Back" },
	{ name: "Hyperextensions", type: "Back" },

	{ name: "Barbell Squat", type: "Legs" },
	{ name: "Front Squat", type: "Legs" },
	{ name: "Goblet Squat", type: "Legs" },
	{ name: "Leg Press", type: "Legs" },
	{ name: "Bulgarian Split Squat", type: "Legs" },
	{ name: "Lunges", type: "Legs" },
	{ name: "Walking Lunges", type: "Legs" },
	{ name: "Reverse Lunges", type: "Legs" },
	{ name: "Step-Ups", type: "Legs" },
	{ name: "Leg Curl", type: "Legs" },
	{ name: "Leg Extension", type: "Legs" },
	{ name: "Calf Raise", type: "Legs" },
	{ name: "Seated Calf Raise", type: "Legs" },
	{ name: "Hip Thrusts", type: "Legs" },
	{ name: "Glute Bridges", type: "Legs" },

	{ name: "Barbell Curl", type: "Biceps" },
	{ name: "Dumbbell Curl", type: "Biceps" },
	{ name: "Hammer Curl", type: "Biceps" },
	{ name: "Preacher Curl", type: "Biceps" },
	{ name: "Concentration Curl", type: "Biceps" },

	{ name: "Tricep Pushdown", type: "Triceps" },
	{ name: "Tricep Extension", type: "Triceps" },
	{ name: "Skull Crushers", type: "Triceps" },
	{ name: "Close Grip Bench Press", type: "Triceps" },
	{ name: "Overhead Tricep Extension", type: "Triceps" },

	{ name: "Plank", type: "Core" },
	{ name: "Side Plank", type: "Core" },
	{ name: "Leg Raises", type: "Core" },
	{ name: "Hanging Leg Raises", type: "Core" },
	{ name: "Crunches", type: "Core" },
	{ name: "Russian Twists", type: "Core" },
	{ name: "Bicycle Crunches", type: "Core" },
	{ name: "Woodchoppers", type: "Core" },
	{ name: "Cable Crunches", type: "Core" },
	{ name: "Ab Rollouts", type: "Core" },

	{ name: "Clean and Jerk", type: "Full Body" },
	{ name: "Snatch", type: "Full Body" },
	{ name: "Power Clean", type: "Full Body" },
	{ name: "Thruster", type: "Full Body" },
	{ name: "Burpee", type: "Full Body" },
	{ name: "Kettlebell Swing", type: "Full Body" },
	{ name: "Turkish Get-Up", type: "Full Body" },
	{ name: "Box Jumps", type: "Full Body" },
	{ name: "Farmers Carry", type: "Full Body" },
] as const;

export type PresetExercise = (typeof PRESET_EXERCISES)[number];

export const PRESET_REP_RANGES = [
	"ORM",
	"Failure",
	"AMRAP",
	"4-6",
	"10-12",
	"12-16",
	"5x5",
	"10x10",
];

export const TWELVE_WEEK_BENCHMARK: Record<string, number> = {
	Mon: 12,
	Tue: 12,
	Wed: 12,
	Thu: 12,
	Fri: 12,
	Sat: 12,
	Sun: 0,
};

export const GUIDE_ITEMS = [
	{
		label: "Weight",
		instruction: "Morning, after bathroom, before food, minimal clothing.",
	},
	{
		label: "Body Fat",
		instruction: "Same time of day, same device (2–3 readings averaged).",
	},
	{
		label: "Arms",
		instruction: "Midpoint between shoulder and elbow, arm relaxed.",
	},
	{
		label: "Forearms",
		instruction: "At the thickest part near the elbow.",
	},
	{
		label: "Thighs",
		instruction: "Midpoint between hip and knee, legs relaxed.",
	},
	{
		label: "Waist",
		instruction: "Narrowest point or at belly button, exhale normally.",
	},
];
