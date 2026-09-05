export const onboardingSteps = [
	{
		step: 1,
		title: "Pick your program",
		description:
			"Choose the training block you’re currently following — v1, v2, v3, or v4. Rep Deck keeps your plan organized so you always know what workout comes next.",
	},
	{
		step: 2,
		title: "Log every set",
		description:
			"Enter your weight, reps, and notes right after each set. The app remembers your previous session so you can train with context, not guesswork.",
	},
	{
		step: 3,
		title: "Track real progress",
		description:
			"Watch your strength, measurements, and body composition improve over time. When your program changes, your history stays intact and your progress stays visible.",
	},
];

export const featuresData = [
	{
		id: 1,
		title: "Workout logging",
		description:
			"Log sets, reps, weight, and notes in seconds. Rep Deck is built to make in-gym tracking fast and frictionless.",
	},
	{
		id: 2,
		title: "Last session memory",
		description:
			"See what you lifted last time before you start today’s workout. No more guessing your bench, squat, or deadlift numbers.",
	},
	{
		id: 3,
		title: "Program-based training",
		description:
			"Switch between plan versions like v1, v2, v3, and v4 without losing your history. Your workouts stay organized even when your split changes.",
	},
	{
		id: 4,
		title: "Progress charts",
		description:
			"Track strength, measurements, and bodyweight trends over time. Watch your growth with clean charts instead of scrolling through old notes.",
	},
	{
		id: 5,
		title: "Clean, distraction-free dashboard",
		description:
			"Get a quick snapshot of your training without extra noise. Everything important is right where you need it.",
	},
];

export const faqData = [
	{
		id: 1,
		question: "Is Rep Deck free?",
		answer: "Rep Deck can start as a free app with core workout logging and progress tracking. You can add premium features later if you want.",
	},
	{
		id: 2,
		question: "Do I need to manually enter every workout?",
		answer: "Only once per program setup. After that, you just pick your current plan and log sets quickly as you train.",
	},
	{
		id: 3,
		question: "Can I switch from one program to another?",
		answer: "Yes. You can create and switch between versions like v1, v2, v3, and v4 without losing your old workout history.",
	},
	{
		id: 4,
		question: "Does Rep Deck support Google login?",
		answer: "Yes, Google login can be added so your progress stays synced and easy to access across devices.",
	},
	{
		id: 5,
		question: "Will my old workouts disappear when I change plans?",
		answer: "No. Your history stays saved, even if you start a new training block or swap exercises.",
	},
];

export const ctaData = {
	title: "Ready to train with more clarity?",
	description:
		"Stop guessing what you lifted last week. Start logging every set, track your progress, and keep every training block organized in one place.",
	buttonText: "Start Tracking",
};

export const navigationData = [
	{
		id: 1,
		label: "Plans",
		href: "/plans",
	},
	{
		id: 2,
		label: "Progress",
		href: "/progress",
	},
	{
		id: 3,
		label: "Workout Log",
		href: "/workout-log",
	},
	{
		id: 4,
		label: "About",
		href: "/about",
	},
	{
		id: 5,
		label: "Metrics",
		href: "/metrics",
	},
];

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
		"Rep Deck is a clean workout tracker made to help you log sessions, follow your training plans, and review progress without noise. It’s designed for people who care about the numbers that matter — strength, size, and consistency.",
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
	// Chest
	{ name: "Bench Press", type: "Chest" },
	{ name: "Incline Bench Press", type: "Chest" },
	{ name: "Decline Bench Press", type: "Chest" },
	{ name: "Dumbbell Bench Press", type: "Chest" },
	{ name: "Incline Dumbbell Press", type: "Chest" },
	{ name: "Dumbbell Flyes", type: "Chest" },
	{ name: "Cable Flyes", type: "Chest" },
	{ name: "Pec Deck Flyes", type: "Chest" },
	{ name: "Push-Ups", type: "Chest" },

	// Shoulders
	{ name: "Overhead Press", type: "Shoulders" },
	{ name: "Dumbbell Shoulder Press", type: "Shoulders" },
	{ name: "Arnold Press", type: "Shoulders" },
	{ name: "Lateral Raise", type: "Shoulders" },
	{ name: "Front Raise", type: "Shoulders" },
	{ name: "Rear Delt Flyes", type: "Shoulders" },
	{ name: "Face Pull", type: "Shoulders" },
	{ name: "Upright Row", type: "Shoulders" },
	{ name: "Shrugs", type: "Shoulders" },

	// Back
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

	// Legs
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

	// Arms - Biceps
	{ name: "Barbell Curl", type: "Biceps" },
	{ name: "Dumbbell Curl", type: "Biceps" },
	{ name: "Hammer Curl", type: "Biceps" },
	{ name: "Preacher Curl", type: "Biceps" },
	{ name: "Concentration Curl", type: "Biceps" },

	// Arms - Triceps
	{ name: "Tricep Pushdown", type: "Triceps" },
	{ name: "Tricep Extension", type: "Triceps" },
	{ name: "Skull Crushers", type: "Triceps" },
	{ name: "Close Grip Bench Press", type: "Triceps" },
	{ name: "Overhead Tricep Extension", type: "Triceps" },

	// Core
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

	// Full Body
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
