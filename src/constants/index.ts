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