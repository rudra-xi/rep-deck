"use client";

import { useState } from "react";
import {
	ChartLineUpIcon,
	ClipboardTextIcon,
	FolderSimpleIcon,
	ScalesIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const TABS = [
	{
		id: "log",
		label: "Workout Log",
		icon: ClipboardTextIcon,
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
		id: "plans",
		label: "Plans",
		icon: FolderSimpleIcon,
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
	{
		id: "progress",
		label: "Progress",
		icon: ChartLineUpIcon,
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
		id: "metrics",
		label: "Metrics",
		icon: ScalesIcon,
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
];

export const ShowcaseSection = () => {
	const [activeTab, setActiveTab] = useState(TABS[0].id);
	const active = TABS.find((t) => t.id === activeTab) ?? TABS[0];

	return (
		<section className="w-full py-20 px-6 bg-background/50">
			<div className="container max-w-6xl mx-auto space-y-12">
				{/* Header */}
				<div className="text-center space-y-4 max-w-2xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider">
						Everything you need.
					</h2>
					<p className="text-muted-foreground text-base sm:text-lg">
						Four core surfaces built to work together — not
						bolted-on features.
					</p>
				</div>

				{/* Tab Switcher */}
				<div className="flex flex-wrap justify-center gap-2">
					{TABS.map(({ id, label, icon: Icon }) => (
						<button
							key={id}
							type="button"
							onClick={() => setActiveTab(id)}
							className={cn(
								"flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border base-ease rounded-none",
								activeTab === id
									? "border-primary bg-primary/10 text-primary"
									: "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
							)}
						>
							<Icon
								className="size-4"
								weight={activeTab === id ? "fill" : "bold"}
							/>
							{label}
						</button>
					))}
				</div>

				{/* Content Panel */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border border-border/60 bg-card/40 p-6 lg:p-10">
					{/* Text side */}
					<div className="space-y-5">
						<div className="ficon-box">
							<active.icon
								className="size-4"
								weight="bold"
							/>
						</div>

						<h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
							{active.title}
						</h3>

						<p className="text-muted-foreground leading-relaxed">
							{active.description}
						</p>

						<ul className="space-y-2 pt-2">
							{active.bullets.map((bullet) => (
								<li
									key={bullet}
									className="flex items-start gap-2.5 text-sm text-foreground"
								>
									<span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
									{bullet}
								</li>
							))}
						</ul>
					</div>

					{/* Visual placeholder */}
					<div className="aspect-4/3 border border-border/60 bg-background/50 fcc relative overflow-hidden">
						<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />
						<div className="relative text-center space-y-3 px-6">
							<active.icon
								className="size-12 text-primary/40 mx-auto"
								weight="duotone"
							/>
							<p className="ftext-xs2 uppercase tracking-widest text-muted-foreground">
								{active.label} Preview
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};