"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PreferencesSectionProps {
	initialPreferences: UserPreferences;
}

export function PreferencesSection({
	initialPreferences,
}: PreferencesSectionProps) {
	const { prefs, savingKey, handleWeightToggle, handleMeasurementToggle } =
		usePreferences(initialPreferences);

	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]">
			<CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
					<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<SlidersHorizontalIcon
							className="size-4"
							weight="bold"
						/>
					</div>
					Preferences
				</CardTitle>
			</CardHeader>

			<CardContent className="p-5 pt-0 space-y-4">
				{/* Weight Unit */}
				<div className="p-3.5 border border-border/40 bg-background/50 rounded-none transition-all duration-200 hover:border-primary/30 group">
					<div className="flex items-start gap-3">
						<div className="flex items-center justify-center border border-primary/20 bg-primary/5 p-2 text-primary rounded-md shrink-0 group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-200">
							<ScalesIcon className="size-4" weight="bold" />
						</div>
						<div className="space-y-1 flex-1 min-w-0">
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

					<div className="mt-3 flex items-center justify-between gap-3 p-2 border border-border/30 bg-muted/20">
						<div className="flex items-baseline gap-2 font-mono tabular-nums min-w-0">
							<span
								className={cn(
									"text-sm font-bold transition-all duration-300",
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
									"text-sm font-bold transition-all duration-300",
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
				<div className="p-3.5 border border-border/40 bg-background/50 rounded-none transition-all duration-200 hover:border-primary/30 group">
					<div className="flex items-start gap-3">
						<div className="flex items-center justify-center border border-primary/20 bg-primary/5 p-2 text-primary rounded-md shrink-0 group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-200">
							<RulerIcon className="size-4" weight="bold" />
						</div>
						<div className="space-y-1 flex-1 min-w-0">
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

					<div className="mt-3 flex items-center justify-between gap-3 p-2 border border-border/30 bg-muted/20">
						<div className="flex items-baseline gap-2 min-w-0">
							<span
								className={cn(
									"font-bold transition-all duration-300",
									prefs.measurementUnit === "in"
										? "text-primary text-sm"
										: "text-muted-foreground text-xs",
								)}
							>
								35.4 in
							</span>
							<span className="text-muted-foreground/40 text-xs">
								·
							</span>
							<span
								className={cn(
									"text-sm font-bold transition-all duration-300",
									prefs.measurementUnit === "cm"
										? "text-primary text-sm"
										: "text-muted-foreground text-xs",
								)}
							>
								90.0 cm
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
