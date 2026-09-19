"use client";

import {
	ChartLineUpIcon,
	ClipboardTextIcon,
	FolderSimpleIcon,
	ScalesIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";
import { Metrics, Plans, Progress, Workout } from "@/assets/image";
import { showcaseTabs } from "@/constants";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   ICON + IMAGE MAPS — stay in the component (UI concern)
   ───────────────────────────────────────────────────────────── */

const tabIconMap: Record<string, React.ElementType> = {
	log: ClipboardTextIcon,
	plans: FolderSimpleIcon,
	progress: ChartLineUpIcon,
	metrics: ScalesIcon,
};

const tabImageMap: Record<string, typeof Workout> = {
	log: Workout,
	plans: Plans,
	progress: Progress,
	metrics: Metrics,
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────── */

export const ShowcaseSection = () => {
	const [activeTabId, setActiveTabId] = useState<string>(showcaseTabs[0].id);
	const active =
		showcaseTabs.find((t) => t.id === activeTabId) ?? showcaseTabs[0];

	const ActiveIcon = tabIconMap[active.id] ?? ClipboardTextIcon;
	const ActiveImage = tabImageMap[active.id] ?? Workout;

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
				<div className="fwrap justify-center gap-2">
					{showcaseTabs.map(({ id, label }) => {
						const Icon = tabIconMap[id] ?? ClipboardTextIcon;
						const isActive = activeTabId === id;

						return (
							<button
								key={id}
								type="button"
								onClick={() => setActiveTabId(id)}
								className={cn(
									"fcy gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border base-ease rounded-none",
									isActive
										? "border-primary bg-primary/10 text-primary"
										: "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
								)}
							>
								<Icon
									className="size-4"
									weight={isActive ? "fill" : "bold"}
								/>
								{label}
							</button>
						);
					})}
				</div>

				{/* Content Panel */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border border-border/60 bg-card/40 p-6 lg:p-10">
					{/* Text side */}
					<div className="space-y-5">
						<div className="ficon-box">
							<ActiveIcon className="size-4" weight="bold" />
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
									className="ft gap-2.5 text-sm text-foreground"
								>
									<span className="size-1.5 rounded-full bg-primary mt-2 sh0" />
									{bullet}
								</li>
							))}
						</ul>
					</div>

					{/* Screenshot */}
					<div className="relative w-full aspect-video border border-border/60 bg-background overflow-hidden shadow-lg">
						<Image
							key={active.id}
							src={ActiveImage}
							alt={`Rep Deck ${active.label} screen`}
							fill
							placeholder="blur"
							quality={95}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 560px"
							className="object-cover object-left-top"
						/>

						{/* Subtle top-left corner accent */}
						<div className="absolute -top-10 -left-10 size-44 bg-linear-to-br from-primary/20 to-transparent pointer-events-none rounded-full blur-xl" />
					</div>
				</div>
			</div>
		</section>
	);
};
