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
