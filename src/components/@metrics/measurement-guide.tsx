"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpenIcon } from "@phosphor-icons/react";
import { CardsHeader } from "@/common";
import { GUIDE_ITEMS } from "@/constants";

export function MeasurementGuide() {
	return (
		<Card className="fcard-flat card-ease">
			<CardsHeader icon={BookOpenIcon} title="How to Measure" />

			<CardContent className="p-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
				{GUIDE_ITEMS.map((item) => (
					<div
						key={item.label}
						className="p-2 border border-border/40 bg-background/50 rounded-none space-y-0.5"
					>
						<span className="ftext-xs2 font-bold text-primary block">
							{item.label}
						</span>
						<p className="ftext-xs2 fmuted leading-snug">
							{item.instruction}
						</p>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
