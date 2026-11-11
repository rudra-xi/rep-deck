import type { HeatmapDayStatus } from "@/actions/progress";

export const DAY_LABELS = [
	{ key: "mon", short: "M", full: "Monday" },
	{ key: "tue", short: "T", full: "Tuesday" },
	{ key: "wed", short: "W", full: "Wednesday" },
	{ key: "thu", short: "T", full: "Thursday" },
	{ key: "fri", short: "F", full: "Friday" },
	{ key: "sat", short: "S", full: "Saturday" },
	{ key: "sun", short: "S", full: "Sunday" },
] as const;

export const HEATMAP_MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const;

export const STATUS_STYLE: Record<
	HeatmapDayStatus,
	{ className: string; label: string; description: string }
> = {
	trained: {
		className: "bg-primary border-primary/80",
		label: "Trained",
		description: "Session logged",
	},
	rest: {
		className: "bg-primary/20 border-primary/10",
		label: "Rest",
		description: "Scheduled rest day",
	},
	skipped: {
		className: "bg-muted/50 border-border/60",
		label: "Skipped",
		description: "Training day, no session logged",
	},
	future: {
		className: "bg-transparent border-border/20 border-dashed",
		label: "Upcoming",
		description: "Not yet reached",
	},
};
