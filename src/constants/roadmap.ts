export type RoadmapStatus = "shipped" | "in-progress" | "planned";

export type RoadmapVersion =
	| "v0.1.0"
	| "v0.2.0"
	| "v0.3.0"
	| "v0.4.0"
	| "v0.5.0"
	| "v0.6.0"
	| "v0.7.0"
	| "v0.8.0"
	| "v0.9.0"
	| "v1.0.0";

export interface RoadmapItem {
	title: string;
	description: string;
	status: RoadmapStatus;
	version: RoadmapVersion;
	pillar: string;
}

export const CURRENT_VERSION: RoadmapVersion = "v0.3.0";

export const ROADMAP: RoadmapItem[] = [
	// ─────────────────────────────────────────────────────────────────
	// v0.1.0 — Foundation (shipped)
	// First usable version: log a workout, view a plan.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Workout logging",
		description:
			"Log sets, reps, load, and RPE per exercise. Session-level and per-set notes with inline PR badges.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "Training",
	},
	{
		title: "Core plans",
		description:
			"Single-plan model with days and exercises. Prefill the workout log from the active plan.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "Training",
	},
	{
		title: "Google sign-in",
		description:
			"One-click OAuth with Supabase. Session synced to the app's user table on first login.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "Platform",
	},
	{
		title: "Responsive shell",
		description:
			"Mobile-first navigation, theming, and the first pass at the design system.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "Platform",
	},

	// ─────────────────────────────────────────────────────────────────
	// v0.2.0 — Measurement & Progress (shipped)
	// Body composition, unit preferences, the first charts.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Body metrics",
		description:
			"Weight, body fat, and six body measurements with automatic kg/lb and cm/in conversion.",
		status: "shipped",
		version: "v0.2.0",
		pillar: "Tracking",
	},
	{
		title: "Progress charts",
		description:
			"Big 4 strength trends, per-lift detail, session volume, and training distribution.",
		status: "shipped",
		version: "v0.2.0",
		pillar: "Tracking",
	},
	{
		title: "Unit preferences",
		description:
			"Global kg/lb and cm/in toggle. All charts, tables, and inputs read from the same source.",
		status: "shipped",
		version: "v0.2.0",
		pillar: "Platform",
	},
	{
		title: "Themes",
		description:
			"Eight built-in themes with a persistent default and instant preview.",
		status: "shipped",
		version: "v0.2.0",
		pillar: "Platform",
	},

	// ─────────────────────────────────────────────────────────────────
	// v0.3.0 — Program Flexibility (shipped)
	// Plans become a first-class, versioned, schedule-aware concept.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Versioned programs",
		description:
			"Duplicate a plan into a new version without losing session history. Activate any version from the plans page.",
		status: "shipped",
		version: "v0.3.0",
		pillar: "Training",
	},
	{
		title: "Day management",
		description:
			"Create, rename, duplicate, and delete days. Deleting a day reindexes the rest so Day 1, 2, 3 stay contiguous.",
		status: "shipped",
		version: "v0.3.0",
		pillar: "Training",
	},
	{
		title: "Weekday anchoring",
		description:
			"Optionally anchor a plan to a weekday. The workout log auto-selects today's scheduled day, with manual override.",
		status: "shipped",
		version: "v0.3.0",
		pillar: "Training",
	},

	// ─────────────────────────────────────────────────────────────────
	// v0.4.0 — Insights (in progress)
	// Turn data into guidance: progression, plateaus, volume.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Auto-progression",
		description:
			"Simple rules: hit the target reps → suggest +2.5 kg next session. Deload hints after 4–6 weeks of load.",
		status: "in-progress",
		version: "v0.4.0",
		pillar: "Insights",
	},
	{
		title: "Plateau detection",
		description:
			"If a lift stalls for 3+ weeks, flag it and suggest a deload or rep-range change.",
		status: "planned",
		version: "v0.4.0",
		pillar: "Insights",
	},
	{
		title: "Volume trends",
		description:
			"Weekly volume per lift and per muscle group, alongside estimated 1RM trajectory.",
		status: "planned",
		version: "v0.4.0",
		pillar: "Insights",
	},

	// ─────────────────────────────────────────────────────────────────
	// v0.5.0 — Movement Quality
	// Help users train the right way, not just more.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Exercise library",
		description:
			"Per-exercise page with technique cues, common mistakes, and variations. Auto-linked from every logged set.",
		status: "planned",
		version: "v0.5.0",
		pillar: "Quality",
	},
	{
		title: "Warm-up generator",
		description:
			"Percentage-based warm-up sets before a working top set, calculated from the day's planned load.",
		status: "planned",
		version: "v0.5.0",
		pillar: "Quality",
	},
	{
		title: "Readiness check-in",
		description:
			"Optional per-session ratings for sleep, energy, and soreness. Feeds the plateau detector.",
		status: "planned",
		version: "v0.5.0",
		pillar: "Quality",
	},

	// ─────────────────────────────────────────────────────────────────
	// v0.6.0 — Data Trust
	// Your data is yours: backup, restore, export.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Import / export",
		description:
			"Documented CSV and JSON backup with append mode and versioned schema for forward compatibility.",
		status: "planned",
		version: "v0.6.0",
		pillar: "Data",
	},
	{
		title: "Backup reminders",
		description:
			"Gentle nudges when a backup hasn't been taken in 30+ days.",
		status: "planned",
		version: "v0.6.0",
		pillar: "Data",
	},
	{
		title: "Data quality hints",
		description:
			"Flag inconsistent weigh-ins, missed measurements, and unusual set entries before they skew trends.",
		status: "planned",
		version: "v0.6.0",
		pillar: "Data",
	},

	// ─────────────────────────────────────────────────────────────────
	// v0.7.0 — Coaching & Sharing
	// Let someone else see the work.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Coach / friend view",
		description:
			"Read-only share link so a coach or training partner can view logs and charts.",
		status: "planned",
		version: "v0.7.0",
		pillar: "Sharing",
	},
	{
		title: "Progress snapshots",
		description:
			"One-click shareable image: an 8-week strength and body composition summary.",
		status: "planned",
		version: "v0.7.0",
		pillar: "Sharing",
	},
	{
		title: "Weekly digest",
		description:
			"In-app summary: sessions trained, volume change, best lift, and the biggest gap.",
		status: "planned",
		version: "v0.7.0",
		pillar: "Sharing",
	},

	// ─────────────────────────────────────────────────────────────────
	// v0.8.0 — Onboarding & Community
	// Make the first 10 minutes delightful.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Guided onboarding",
		description:
			"Four steps: pick a goal, choose a template, set units, log the first workout — all before the dashboard loads.",
		status: "planned",
		version: "v0.8.0",
		pillar: "Experience",
	},
	{
		title: "Program templates",
		description:
			"Curated starter programs (PPL, Upper/Lower, Full Body) users can clone with one tap.",
		status: "planned",
		version: "v0.8.0",
		pillar: "Experience",
	},
	{
		title: "Public profiles",
		description:
			"Optional read-only page that shows a lifter's bests, trends, and active program.",
		status: "planned",
		version: "v0.8.0",
		pillar: "Experience",
	},

	// ─────────────────────────────────────────────────────────────────
	// v0.9.0 — Platform Polish
	// Feel fast, installable, offline-friendly.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "PWA & install prompt",
		description:
			"Installable app with icon, splash, and better cold loads on mobile.",
		status: "planned",
		version: "v0.9.0",
		pillar: "Platform",
	},
	{
		title: "Offline logging",
		description:
			"Draft sessions offline and sync automatically when connectivity returns.",
		status: "planned",
		version: "v0.9.0",
		pillar: "Platform",
	},
	{
		title: "Performance pass",
		description:
			"Faster charts, lighter bundles, and a measurable improvement to time-to-interactive.",
		status: "planned",
		version: "v0.9.0",
		pillar: "Platform",
	},

	// ─────────────────────────────────────────────────────────────────
	// v1.0.0 — Ecosystem
	// Play well with the rest of a lifter's toolkit.
	// ─────────────────────────────────────────────────────────────────
	{
		title: "Wearable sync",
		description:
			"Optional Apple Health and Google Fit sync for heart rate, sleep, and recovery data.",
		status: "planned",
		version: "v1.0.0",
		pillar: "Ecosystem",
	},
	{
		title: "Third-party import",
		description:
			"Import workout history from Strong, Hevy, and common CSV formats to reduce switching cost.",
		status: "planned",
		version: "v1.0.0",
		pillar: "Ecosystem",
	},
	{
		title: "Opt-in analytics",
		description:
			"Privacy-first usage analytics to see which features actually matter.",
		status: "planned",
		version: "v1.0.0",
		pillar: "Ecosystem",
	},
];

export const STATUS_META: Record<
	RoadmapStatus,
	{ label: string; className: string }
> = {
	shipped: {
		label: "Shipped",
		className: "text-primary bg-primary/10 border-primary/30",
	},
	"in-progress": {
		label: "In progress",
		className:
			"text-popover-foreground bg-popover-foreground/10 border-popover-foreground/30",
	},
	planned: {
		label: "Planned",
		className: "text-muted-foreground bg-muted/30 border-border/40",
	},
};

export const VERSION_META: {
	key: RoadmapVersion;
	label: string;
	subtitle: string;
}[] = [
	{
		key: "v0.1.0",
		label: "v0.1.0 — Foundation",
		subtitle: "First usable version: log a workout, view a plan.",
	},
	{
		key: "v0.2.0",
		label: "v0.2.0 — Measurement & Progress",
		subtitle: "Body composition, unit preferences, and the first charts.",
	},
	{
		key: "v0.3.0",
		label: "v0.3.0 — Program Flexibility",
		subtitle: "Versioned plans, day management, and weekday anchoring.",
	},
	{
		key: "v0.4.0",
		label: "v0.4.0 — Insights",
		subtitle: "Auto-progression, plateau detection, and volume trends.",
	},
	{
		key: "v0.5.0",
		label: "v0.5.0 — Movement Quality",
		subtitle: "Exercise library, warm-ups, and readiness.",
	},
	{
		key: "v0.6.0",
		label: "v0.6.0 — Data Trust",
		subtitle: "Backups, restore, and data quality hints.",
	},
	{
		key: "v0.7.0",
		label: "v0.7.0 — Coaching & Sharing",
		subtitle: "Coach view, snapshots, and weekly digests.",
	},
	{
		key: "v0.8.0",
		label: "v0.8.0 — Onboarding & Community",
		subtitle: "Guided first-run, starter templates, and public profiles.",
	},
	{
		key: "v0.9.0",
		label: "v0.9.0 — Platform Polish",
		subtitle: "PWA, offline logging, and a performance pass.",
	},
	{
		key: "v1.0.0",
		label: "v1.0.0 — Ecosystem",
		subtitle: "Wearables, imports, and opt-in analytics.",
	},
];
