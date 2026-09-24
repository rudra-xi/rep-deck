"use client";

import {
	CalendarCheckIcon,
	ChartLineUpIcon,
	FloppyDiskIcon,
	LockKeyIcon,
} from "@phosphor-icons/react";

const BADGES = [
	{
		icon: LockKeyIcon,
		label: "Private by Default",
		description: "Your data, your control",
	},
	{
		icon: CalendarCheckIcon,
		label: "Weekday Anchoring",
		description: "Auto-selects today's plan",
	},
	{
		icon: FloppyDiskIcon,
		label: "Backdate Sessions",
		description: "Log a missed workout",
	},
	{
		icon: ChartLineUpIcon,
		label: "Big 4 Trends",
		description: "Estimated 1RM charts",
	},
];

export const TrustBadges = () => {
	return (
		<section className="w-full border-y border-border/50 bg-card/40 backdrop-blur-sm py-6">
			<div className="container max-w-6xl mx-auto px-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
					{BADGES.map(({ icon: Icon, label, description }, index) => (
						<div
							key={label}
							className={`fcy gap-3.5 p-3 ${
								index !== 0 ? "pt-4 sm:pt-3 sm:pl-6" : ""
							}`}
						>
							<div className="size-9 border border-primary/20 bg-primary/10 fc sh0">
								<Icon
									className="size-4.5 text-primary"
									weight="bold"
								/>
							</div>
							<div className="min-w-0 text-left">
								<p className="text-xs font-bold uppercase tracking-wider text-foreground">
									{label}
								</p>
								<p className="text-[11px] text-muted-foreground leading-snug">
									{description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
