"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	MapTrifoldIcon,
	CheckCircleIcon,
	ClockIcon,
	CircleDashedIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
	STATUS_META,
	VERSION_META,
	getItemsByVersion,
	type RoadmapItem,
	type RoadmapStatus,
} from "@/lib/roadmap";

const STATUS_ICONS: Record<RoadmapStatus, React.ElementType> = {
	shipped: CheckCircleIcon,
	"in-progress": ClockIcon,
	planned: CircleDashedIcon,
};

function RoadmapCard({ item }: { item: RoadmapItem }) {
	const meta = STATUS_META[item.status];
	const StatusIcon = STATUS_ICONS[item.status];

	return (
		<div className="fcard-flat base-ease hover:border-primary/30 p-3 sm:p-4">
			<div className="fbs gap-3">
				<div className="min-w-0 fgrow">
					<p className="text-xs font-bold text-foreground leading-tight">
						{item.title}
					</p>
					<p className="text-[11px] text-muted-foreground mt-1 leading-snug">
						{item.description}
					</p>
				</div>
				<Badge
					variant="outline"
					className={cn(
						"text-[9px] font-bold uppercase tracking-wider rounded-none sh0 gap-1 inline-flex items-center",
						meta.className,
					)}
				>
					<StatusIcon className="size-2.5" weight="fill" />
					<span className="hidden sm:inline">{meta.label}</span>
				</Badge>
			</div>
		</div>
	);
}

function VersionSection({
	version,
	items,
}: {
	version: (typeof VERSION_META)[number];
	items: RoadmapItem[];
}) {
	const byPillar = items.reduce<Record<string, RoadmapItem[]>>(
		(acc, item) => {
			(acc[item.pillar] ??= []).push(item);
			return acc;
		},
		{},
	);

	return (
		<div className="space-y-4">
			{/* Sticky version header */}
			<div className="sticky top-0 z-10 -mx-1 px-1 pb-2 pt-1 bg-card/95 backdrop-blur-sm border-b border-border/40">
				<h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
					{version.label}
				</h3>
				<p className="text-[10px] text-muted-foreground mt-0.5">
					{version.subtitle}
				</p>
			</div>

			{/* Pillars */}
			<div className="space-y-4">
				{Object.entries(byPillar).map(([pillar, pillarItems]) => (
					<div
						key={pillar}
						className="space-y-2 pl-3 border-l-2 border-border/30"
					>
						<p className="text-[9px] font-bold uppercase tracking-wider text-primary/70">
							{pillar}
						</p>
						<div className="space-y-2">
							{pillarItems.map((item) => (
								<RoadmapCard key={item.title} item={item} />
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function RoadmapDialog() {
	const [open, setOpen] = useState(false);
	const [showShipped, setShowShipped] = useState(false);

	const upcoming = VERSION_META.map((v) => {
		const items = getItemsByVersion(v.key);
		const allShipped = items.every((i) => i.status === "shipped");
		return { version: v, items, allShipped };
	}).filter(({ items }) => items.length > 0);

	const visible = upcoming.filter(
		({ allShipped }) => showShipped || !allShipped,
	);

	const hasShippedSection = upcoming.some(({ allShipped }) => allShipped);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						className="text-[11px] font-semibold text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5 px-2.5 py-1.5 base-ease rounded-none h-auto"
					>
						<MapTrifoldIcon className="size-3.5" weight="bold" />
						What&apos;s coming
					</Button>
				}
			/>

			<DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] p-0 rounded-none border-border/50 bg-card/95 backdrop-blur-sm fcol gap-0">
				{/* Header */}
				<DialogHeader className="p-5 pb-3 border-b border-border/40 sh0">
					<DialogTitle className="text-xs font-bold uppercase tracking-wider text-foreground fcy gap-2.5">
						<div className="fc border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md sh0">
							<MapTrifoldIcon className="size-4" weight="bold" />
						</div>
						Roadmap
					</DialogTitle>
					<DialogDescription className="text-[11px] text-muted-foreground pt-1">
						Where Rep Deck is headed.
					</DialogDescription>
				</DialogHeader>

				{/* Scrollable body */}
				<div className="fgrow min-h-0 overflow-y-auto p-5 space-y-6">
					{visible.length === 0 ? (
						<p className="text-[11px] text-muted-foreground text-center py-8">
							Nothing on the roadmap right now.
						</p>
					) : (
						visible.map(({ version, items }) => (
							<VersionSection
								key={version.key}
								version={version}
								items={items}
							/>
						))
					)}
				</div>

				{/* Footer toggle — only if there are shipped versions to reveal */}
				{hasShippedSection && (
					<div className="border-t border-border/40 p-3 sh0">
						<button
							type="button"
							onClick={() => setShowShipped((s) => !s)}
							className="w-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary py-1.5 base-ease"
						>
							{showShipped
								? "Hide shipped versions"
								: "Show shipped versions"}
						</button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
