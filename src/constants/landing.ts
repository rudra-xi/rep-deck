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
