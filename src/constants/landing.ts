export const onboardingSteps = [
	{
		step: 1,
		title: "Build your plan",
		description:
			"Create a training block with days and exercises. Anchor it to a weekday — Monday, Sunday, whenever you start — and the app figures out which day to show you on any given date.",
	},
	{
		step: 2,
		title: "Log every set",
		description:
			"Your active plan pre-fills the workout screen. Enter weight, reps, and RPE set by set. Last session's numbers sit beside the input. Forget to log yesterday? Backdate the session and it lands on the right day.",
	},
	{
		step: 3,
		title: "Watch it compound",
		description:
			"Estimated 1RM trends, body measurements, and training frequency update as you log. Switch program versions — v1, v2, v3 — and your history stays intact.",
	},
];

export const featuresData = [
	{
		id: 1,
		title: "Workout logging",
		description:
			"Log sets, reps, weight, RPE, and notes in seconds. Per-set and per-exercise notes, PR detection, and inline history — built for the gym floor.",
	},
	{
		id: 2,
		title: "Anchored schedules",
		description:
			"Anchor a plan to a weekday and the workout log auto-selects today's scheduled day. Miss a session? Pick a past date and log it against the right day.",
	},
	{
		id: 3,
		title: "Versioned programs",
		description:
			"Duplicate a plan into a new version — v1, v2, v3 — without losing history. Rename, duplicate, or delete days and exercises in place.",
	},
	{
		id: 4,
		title: "Progress charts",
		description:
			"Estimated 1RM for the Big 4, per-lift detail, session volume, training distribution, and body composition trends — all in one place.",
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
			"Every PR is detected automatically using estimated 1RM. Inline PR badges on the set, the exercise, and the session summary.",
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
			question: "How does Google login work?",
			answer: "Sign in with Google in one click. Your progress syncs across devices automatically — no passwords to remember.",
		},
	{
		id: 4,
		question: "Can I switch between programs without losing history?",
		answer: "Yes. Create multiple plan versions (v1, v2, v3) and set any one as active. All past sessions, PRs, and trends stay tied to your account — nothing is deleted when you switch.",
	},
	{
		id: 5,
		question: "How does weekday anchoring work?",
		answer: "Anchor a plan to whichever weekday you start on — Monday, Sunday, doesn't matter. The workout log derives each day's weekday from that anchor and auto-selects today's scheduled day. If your plan doesn't cover today, you'll see a rest-day message and can pick manually.",
	},
	{
		id: 6,
		question: "Can I log a workout I forgot to log yesterday?",
		answer: "Yes. The session date picker in the workout log lets you go back any number of days. Pick the date you actually trained, and the session is recorded against that day — not today's date.",
	},
	{
		id: 7,
		question: "What units does Rep Deck use?",
		answer: "Everything is stored in metric (kg and inches) behind the scenes, and converted to your preferred units on the fly. Toggle kg/lb and cm/in any time from your account preferences.",
	},
	{
		id: 8,
		question: "What's coming next?",
		answer: "Auto-progression, plateau detection, and volume trends are in progress. Import/export, coach sharing, and PWA support are on the roadmap. You can see the full plan in the roadmap dialog under Account → About.",
	},
];

export const ctaData = {
	title: "Ready to train with more clarity?",
	description:
		"Stop guessing what you lifted last week. Start logging every set, anchor your plan to your schedule, and keep every training block organized in one place.",
	buttonText: "Start Tracking",
};

export const showcaseTabs = [
	{
		id: "log",
		label: "Workout Log",
		title: "Log every set without friction",
		description:
			"Pre-filled targets from your active program. Last session's numbers right beside the input. Backdate a missed session and it lands on the day you actually trained.",
		bullets: [
			"Previous session shown inline",
			"Per-set RPE and notes",
			"Backdate missed sessions",
			"Auto-select today's scheduled day",
		],
	},
	{
		id: "metrics",
		label: "Metrics",
		title: "Body composition, tracked properly",
		description:
			"Weight, body fat, and six body measurements with automatic unit conversion, data quality warnings, and reminders.",
		bullets: [
			"kg/lb + cm/in auto-conversion",
			"Data quality scoring",
			"Measurement reminders",
			"Six measurement points",
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
			"Build reusable templates with days and exercises. Anchor to a weekday, duplicate days, and version up — all without losing history.",
		bullets: [
			"Multi-day program templates",
			"Weekday anchoring",
			"Duplicate days & versions",
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
		{ id: 1, text: "Track every set with ease." },
		{ id: 2, text: "Keep old programs and new blocks organized." },
		{ id: 3, text: "See your progress clearly over time." },
	],
	creator: "Designed and built by rudra-xi.",
};

export const testimonialsData = [
	{
		quote: "Finally stopped guessing what I lifted last week. The inline previous-session numbers changed how I train.",
		author: "Arjun M.",
		role: "Powerlifter",
		initials: "AM",
	},
	{
		quote: "Anchored my plan to Monday and now it just shows the right day when I open the app. The backdating is what sold me.",
		author: "Priya K.",
		role: "Hypertrophy Enthusiast",
		initials: "PK",
	},
	{
		quote: "The Big 4 trend chart is the only reason I stopped keeping a paper log. It just works.",
		author: "Rohan S.",
		role: "Intermediate Lifter",
		initials: "RS",
	},
];
