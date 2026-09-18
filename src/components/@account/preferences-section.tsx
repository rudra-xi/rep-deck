"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { UserPreferences } from "@/types";
import {
	ScalesIcon,
	RulerIcon,
	SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { usePreferences } from "@/hooks";
import { cn } from "@/lib/utils";
import { CardsHeader } from "@/common";

interface PreferencesSectionProps {
	initialPreferences: UserPreferences;
}

export function PreferencesSection({
	initialPreferences,
}: PreferencesSectionProps) {
	const { prefs, savingKey, handleWeightToggle, handleMeasurementToggle } =
		usePreferences(initialPreferences);

	return (
		<Card className="fcard-flat card-ease hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]">
			<CardsHeader icon={SlidersHorizontalIcon} title="Preferences" />

			<CardContent className="p-5 pt-1 fcol4">
				{/* Weight Unit */}
				<div className="p-3.5 border border-border/40 bg-background/50 rounded-none base-ease hover:border-primary/30 group">
					<div className="ft gap-3">
						<div className="fc border border-primary/20 bg-primary/5 p-2 text-primary rounded-md sh0 group-hover:bg-primary/10 group-hover:border-primary/40 base-ease">
							<ScalesIcon className="size-4" weight="bold" />
						</div>
						<div className="space-y-1 fgrow min-w-0">
							<Label className="text-xs font-bold text-foreground block">
								Weight Unit
							</Label>
							<p className="text-[11px] text-muted-foreground">
								Display weights in{" "}
								<span className="font-semibold text-foreground">
									{prefs.weightUnit === "lb"
										? "Pounds"
										: "Kilograms"}
								</span>
							</p>
						</div>
					</div>

					<div className="mt-3 fcb gap-3 p-2 border border-border/30 bg-muted/20">
						<div className="flex items-baseline gap-2 font-mono tabular-nums min-w-0">
							<span
								className={cn(
									"text-sm font-bold base-ease",
									prefs.weightUnit === "kg"
										? "text-primary text-sm"
										: "text-muted-foreground text-xs",
								)}
							>
								75.0 kg
							</span>
							<span className="text-muted-foreground/40 text-xs">
								·
							</span>
							<span
								className={cn(
									"text-sm font-bold base-ease",
									prefs.weightUnit === "lb"
										? "text-primary text-sm"
										: "text-muted-foreground text-xs",
								)}
							>
								165.3 lb
							</span>
						</div>
						<Switch
							checked={prefs.weightUnit === "lb"}
							onCheckedChange={handleWeightToggle}
							disabled={savingKey === "weightUnit"}
						/>
					</div>
				</div>

				{/* Measurement Unit */}
				<div className="p-3.5 border border-border/40 bg-background/50 rounded-none base-ease hover:border-primary/30 group">
					<div className="ft gap-3">
						<div className="fc border border-primary/20 bg-primary/5 p-2 text-primary rounded-md sh0 group-hover:bg-primary/10 group-hover:border-primary/40 base-ease">
							<RulerIcon className="size-4" weight="bold" />
						</div>
						<div className="space-y-1 fgrow min-w-0">
							<Label className="text-xs font-bold text-foreground block">
								Measurement Unit
							</Label>
							<p className="text-[11px] text-muted-foreground">
								Display body measurements in{" "}
								<span className="font-semibold text-foreground">
									{prefs.measurementUnit === "in"
										? "Inches"
										: "Centimeters"}
								</span>
							</p>
						</div>
					</div>

					<div className="mt-3 fcb gap-3 p-2 border border-border/30 bg-muted/20">
						<div className="flex items-baseline gap-2 min-w-0">
							<span
								className={cn(
									"text-sm font-bold base-ease",
									prefs.measurementUnit === "cm"
										? "text-primary text-sm"
										: "text-muted-foreground text-xs",
								)}
							>
								90.0 cm
							</span>
							<span className="text-muted-foreground/40 text-xs">
								·
							</span>
							<span
								className={cn(
									"font-bold base-ease",
									prefs.measurementUnit === "in"
										? "text-primary text-sm"
										: "text-muted-foreground text-xs",
								)}
							>
								35.4 in
							</span>
						</div>
						<Switch
							checked={prefs.measurementUnit === "in"}
							onCheckedChange={handleMeasurementToggle}
							disabled={savingKey === "measurementUnit"}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
