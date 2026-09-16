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
import { MapTrifoldIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
	STATUS_META,
	VERSION_META,
	getItemsByVersion,
	type RoadmapItem,
} from "@/lib/roadmap";

function RoadmapCard({ item }: { item: RoadmapItem }) {
	const meta = STATUS_META[item.status];
	return (
		<div className="p-3 border border-border/40 bg-background/50 rounded-none transition-all duration-200 hover:border-primary/30">
			<div className="flex items-start justify-between gap-2">
				<p className="text-xs font-bold text-foreground">
					{item.title}
				</p>
				<Badge
					variant="outline"
					className={cn(
						"text-[9px] font-bold uppercase tracking-wider rounded-none shrink-0",
						meta.className,
					)}
				>
					{meta.label}
				</Badge>
			</div>
			<p className="text-[11px] text-muted-foreground mt-1">
				{item.description}
			</p>
		</div>
	);
}

export function RoadmapDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						type="button"
						className="text-[11px] font-semibold text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5 px-2.5 py-1.5 transition-all duration-200 rounded-none"
					>
						<MapTrifoldIcon className="size-3.5" weight="bold" />
						What's coming
					</Button>
				}
			/>

			<DialogContent className="max-w-lg rounded-none border-border/50 bg-card/95 backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
						<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
							<MapTrifoldIcon className="size-4" weight="bold" />
						</div>
						Roadmap
					</DialogTitle>
					<DialogDescription className="text-[11px] text-muted-foreground pt-1">
						Where Rep Deck is headed.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 mt-2 max-h-[65vh] overflow-y-auto pr-1">
					{VERSION_META.map((v) => {
						const items = getItemsByVersion(v.key);
						if (items.length === 0) return null;

						// Skip fully-shipped versions — user wants to see what's next
						const allShipped = items.every(
							(i) => i.status === "shipped",
						);
						if (allShipped) return null;

						// Group items inside this version by pillar
						const byPillar = items.reduce<
							Record<string, RoadmapItem[]>
						>((acc, item) => {
							(acc[item.pillar] ??= []).push(item);
							return acc;
						}, {});

						return (
							<div key={v.key} className="space-y-3">
								{/* Version header */}
								<div className="flex items-baseline justify-between gap-2 border-b border-border/40 pb-1.5">
									<div>
										<h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
											{v.label}
										</h3>
										<p className="text-[10px] text-muted-foreground mt-0.5">
											{v.subtitle}
										</p>
									</div>
								</div>

								{/* Pillars inside this version */}
								<div className="space-y-3">
									{Object.entries(byPillar).map(
										([pillar, pillarItems]) => (
											<div
												key={pillar}
												className="space-y-1.5"
											>
												<p className="text-[9px] font-bold uppercase tracking-wider text-primary/70">
													{pillar}
												</p>
												{pillarItems.map((item) => (
													<RoadmapCard
														key={item.title}
														item={item}
													/>
												))}
											</div>
										),
									)}
								</div>
							</div>
						);
					})}
				</div>
			</DialogContent>
		</Dialog>
	);
}
