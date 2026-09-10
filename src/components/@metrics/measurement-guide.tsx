"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon } from "@phosphor-icons/react";

const GUIDE_ITEMS = [
	{
		label: "Weight",
		instruction: "Morning, after bathroom, before food, minimal clothing.",
	},
	{
		label: "Body Fat",
		instruction: "Same time of day, same device (2–3 readings averaged).",
	},
	{
		label: "Arms",
		instruction: "Midpoint between shoulder and elbow, arm relaxed.",
	},
	{
		label: "Forearms",
		instruction: "At the thickest part near the elbow.",
	},
	{
		label: "Thighs",
		instruction: "Midpoint between hip and knee, legs relaxed.",
	},
	{
		label: "Waist",
		instruction: "Narrowest point or at belly button, exhale normally.",
	},
];

export function MeasurementGuide() {
	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none">
			<CardHeader className="p-4 pb-2">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
					<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<BookOpenIcon className="size-4" weight="bold" />
					</div>
					How to Measure
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
				{GUIDE_ITEMS.map((item) => (
					<div
						key={item.label}
						className="p-2 border border-border/40 bg-background/50 rounded-none space-y-0.5"
					>
						<span className="text-[11px] font-bold text-primary block">
							{item.label}
						</span>
						<p className="text-[11px] text-muted-foreground leading-snug">
							{item.instruction}
						</p>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
