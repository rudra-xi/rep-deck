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
	/** Optional pillar/grouping key — used to cluster items inside a version */
	pillar: string;
}

export const CURRENT_VERSION: RoadmapVersion = "v0.1.0";

/**
 * Roadmap grouped by release. Each version is a "pillar" of work,
 * not a strict release train — items may slip between versions.
 *
 * v0.1.0 — shipped baseline (logging, metrics, charts, account, themes, units)
 * v0.2.0–v0.4.0 — smarter programming + insights + onboarding
 * v0.5.0–v0.7.0 — movement quality + accountability + data trust
 * v0.8.0–v1.0.0 — platform, performance, ecosystem
 */
export const ROADMAP: RoadmapItem[] = [
	// ─────────────────────────────────────────────────────────────
	// v0.1.0 — Shipped baseline
	// ─────────────────────────────────────────────────────────────
	{
		title: "Workout logging",
		description:
			"Log sets, reps, and load for any exercise. Core session tracking.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "Core",
	},
	{
		title: "Body metrics",
		description: "Track body weight, measurements, and progress over time.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "Core",
	},
	{
		title: "Progress charts",
		description: "Visualise strength and body comp trends at a glance.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "Core",
	},
	{
		title: "Custom themes",
		description:
			"Pick from 8 built-in themes and set your favourite as default.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "UX",
	},
	{
		title: "Unit preferences",
		description: "Switch between kg/lb and cm/in anywhere in the app.",
		status: "shipped",
		version: "v0.1.0",
		pillar: "UX",
	},

	// ─────────────────────────────────────────────────────────────
	// v0.2.0 — Programming core
	// ─────────────────────────────────────────────────────────────
	{
		title: "Program library",
		description:
			"Prebuilt templates (full body, upper/lower, PPL) with days, exercises, and target sets/reps.",
		status: "in-progress",
		version: "v0.2.0",
		pillar: "Programming",
	},
	{
		title: "Program assignment",
		description:
			"Pick a program and get a schedule generated automatically (e.g. Mon/Wed/Fri).",
		status: "planned",
		version: "v0.2.0",
		pillar: "Programming",
	},

	// ─────────────────────────────────────────────────────────────
	// v0.3.0 — Progression + insights
	// ─────────────────────────────────────────────────────────────
	{
		title: "Auto-progression",
		description:
			"Simple rules: hit all reps → add 2.5 kg next session. Deload every 4–6 weeks.",
		status: "planned",
		version: "v0.3.0",
		pillar: "Programming",
	},
	{
		title: "Volume & 1RM trends",
		description:
			"Weekly volume per lift and estimated 1RM trend lines over time.",
		status: "planned",
		version: "v0.3.0",
		pillar: "Insights",
	},

	// ─────────────────────────────────────────────────────────────
	// v0.4.0 — Insight depth + onboarding
	// ─────────────────────────────────────────────────────────────
	{
		title: "Readiness check-in",
		description:
			"Rate each session 1–5 for effort and recovery. Feeds fatigue hints.",
		status: "planned",
		version: "v0.4.0",
		pillar: "Insights",
	},
	{
		title: "Plateau detection",
		description: `If a lift stalls for 3+ weeks, suggest a deload or rep-range change.`,
		status: "planned",
		version: "v0.4.0",
		pillar: "Insights",
	},
	{
		title: "Onboarding flow",
		description:
			"3–4 steps: pick a goal, choose a program, set units, log first workout.",
		status: "planned",
		version: "v0.4.0",
		pillar: "UX",
	},

	// ─────────────────────────────────────────────────────────────
	// v0.5.0 — Movement quality
	// ─────────────────────────────────────────────────────────────
	{
		title: "RPE / RIR logging",
		description:
			"Optional per-set fields for Rate of Perceived Exertion or Reps in Reserve.",
		status: "planned",
		version: "v0.5.0",
		pillar: "Quality",
	},
	{
		title: "Exercise notes & cues",
		description:
			"Per-exercise page with technique cues, common mistakes, and variations.",
		status: "planned",
		version: "v0.5.0",
		pillar: "Quality",
	},

	// ─────────────────────────────────────────────────────────────
	// v0.6.0 — Accountability
	// ─────────────────────────────────────────────────────────────
	{
		title: "Pain & injury tracker",
		description:
			"Light tags (e.g. 'lower back: mild') that adjust suggested loads and volume.",
		status: "planned",
		version: "v0.6.0",
		pillar: "Quality",
	},
	{
		title: "Progress snapshots",
		description:
			"One-click shareable image: 8-week strength and body comp summary.",
		status: "planned",
		version: "v0.6.0",
		pillar: "Accountability",
	},
	{
		title: "Weekly digest",
		description:
			"In-app or email summary: sessions trained, volume change, best lift.",
		status: "planned",
		version: "v0.6.0",
		pillar: "Accountability",
	},

	// ─────────────────────────────────────────────────────────────
	// v0.7.0 — Sharing + data trust
	// ─────────────────────────────────────────────────────────────
	{
		title: "Coach / friend view",
		description:
			"Read-only share link so a coach or friend can view your logs and charts.",
		status: "planned",
		version: "v0.7.0",
		pillar: "Accountability",
	},
	{
		title: "Import / export upgrades",
		description:
			"Documented CSV schema, append mode, and versioned headers for backups.",
		status: "planned",
		version: "v0.7.0",
		pillar: "Data",
	},

	// ─────────────────────────────────────────────────────────────
	// v0.8.0 — Platform polish
	// ─────────────────────────────────────────────────────────────
	{
		title: "PWA polish",
		description:
			"Better offline behavior, install prompt, faster cold loads.",
		status: "planned",
		version: "v0.8.0",
		pillar: "Platform",
	},
	{
		title: "Backup reminders",
		description:
			"Nudge users who haven't exported in 3+ months to download a backup.",
		status: "planned",
		version: "v0.8.0",
		pillar: "Data",
	},

	// ─────────────────────────────────────────────────────────────
	// v0.9.0 — Extensibility
	// ─────────────────────────────────────────────────────────────
	{
		title: "Opt-in analytics",
		description:
			"Privacy-first usage analytics to see which features actually matter.",
		status: "planned",
		version: "v0.9.0",
		pillar: "Platform",
	},
	{
		title: "Custom program builder",
		description:
			"Let advanced users author their own programs with progression rules.",
		status: "planned",
		version: "v0.9.0",
		pillar: "Programming",
	},

	// ─────────────────────────────────────────────────────────────
	// v1.0.0 — Ecosystem
	// ─────────────────────────────────────────────────────────────
	{
		title: "Third-party integrations",
		description:
			"Optional sync with wearables (Apple Health, Google Fit) for recovery data.",
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

/**
 * Version metadata for grouping in the UI.
 * Order matters — the dialog renders versions in this order, top to bottom.
 */
export const VERSION_META: {
	key: RoadmapVersion;
	label: string;
	subtitle: string;
}[] = [
	{
		key: "v0.1.0",
		label: "v0.1.0 — Foundation",
		subtitle: "Core logging, metrics, charts, and account basics.",
	},
	{
		key: "v0.2.0",
		label: "v0.2.0 — Programming Core",
		subtitle: "Follow a program instead of logging ad-hoc.",
	},
	{
		key: "v0.3.0",
		label: "v0.3.0 — Progression & Insights",
		subtitle: "Auto-progression and volume / 1RM trends.",
	},
	{
		key: "v0.4.0",
		label: "v0.4.0 — Insight Depth & Onboarding",
		subtitle: "Readiness, plateau hints, and a guided first-run.",
	},
	{
		key: "v0.5.0",
		label: "v0.5.0 — Movement Quality",
		subtitle: "RPE / RIR logging and per-exercise cues.",
	},
	{
		key: "v0.6.0",
		label: "v0.6.0 — Accountability",
		subtitle: "Pain tracking, shareable snapshots, and weekly digests.",
	},
	{
		key: "v0.7.0",
		label: "v0.7.0 — Sharing & Data Trust",
		subtitle: "Coach view and stronger import / export.",
	},
	{
		key: "v0.8.0",
		label: "v0.8.0 — Platform Polish",
		subtitle: "PWA improvements and backup reminders.",
	},
	{
		key: "v0.9.0",
		label: "v0.9.0 — Extensibility",
		subtitle: "Analytics and custom program authoring.",
	},
	{
		key: "v1.0.0",
		label: "v1.0.0 — Ecosystem",
		subtitle: "Wearable sync and integrations.",
	},
];

/** Convenience selectors used by the dialog */
export function getItemsByVersion(version: RoadmapVersion) {
	return ROADMAP.filter((item) => item.version === version);
}

export function getNextUp() {
	// First in-progress item, otherwise first planned item
	return (
		ROADMAP.find((i) => i.status === "in-progress") ??
		ROADMAP.find((i) => i.status === "planned") ??
		null
	);
}
