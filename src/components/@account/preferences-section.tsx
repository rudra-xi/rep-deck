"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updatePreferences } from "@/actions/account";
import { toast } from "sonner";
import type { UserPreferences } from "@/types";
import {
	ScalesIcon,
	RulerIcon,
	SlidersHorizontalIcon,
} from "@phosphor-icons/react";

interface PreferencesSectionProps {
	initialPreferences: UserPreferences;
}

// ✅ Human-readable unit labels for toasts
const WEIGHT_UNIT_LABELS = {
	kg: "kilograms (kg)",
	lb: "pounds (lb)",
} as const;

const MEASUREMENT_UNIT_LABELS = {
	cm: "centimeters (cm)",
	in: "inches (in)",
} as const;

export function PreferencesSection({
	initialPreferences,
}: PreferencesSectionProps) {
	// ✅ Default to kg / in if not set
	const [prefs, setPrefs] = useState<UserPreferences>({
		...initialPreferences,
		weightUnit: initialPreferences.weightUnit || "kg",
		measurementUnit: initialPreferences.measurementUnit || "in",
	});
	const [savingKey, setSavingKey] = useState<string | null>(null);

	const handleWeightToggle = (checked: boolean) => {
		const newUnit = checked ? "lb" : "kg";
		handlePreferenceChange("weightUnit", newUnit, "weight");
	};

	const handleMeasurementToggle = (checked: boolean) => {
		const newUnit = checked ? "in" : "cm";
		handlePreferenceChange("measurementUnit", newUnit, "measurement");
	};

	const handlePreferenceChange = async (
		key: keyof UserPreferences,
		value: "kg" | "lb" | "cm" | "in",
		type: "weight" | "measurement",
	) => {
		const previousPrefs = { ...prefs };
		const updated = { ...prefs, [key]: value };

		setPrefs(updated);
		setSavingKey(key);

		try {
			const res = await updatePreferences(updated);
			if (res.success) {
				if (type === "weight") {
					toast.success(
						`Weight unit set to ${WEIGHT_UNIT_LABELS[value as "kg" | "lb"]}`,
					);
				} else {
					toast.success(
						`Measurement unit set to ${MEASUREMENT_UNIT_LABELS[value as "cm" | "in"]}`,
					);
				}
			} else {
				setPrefs(previousPrefs);
				toast.error(res.error || "Failed to save preference");
			}
		} catch {
			setPrefs(previousPrefs);
			toast.error("An error occurred");
		} finally {
			setSavingKey(null);
		}
	};

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

					{/* Dual-Display Preview — Active unit shown first */}
					<div className="mt-3 flex items-center justify-between gap-3 p-2 border border-border/30 bg-muted/20">
						<div className="flex items-baseline gap-2 font-mono tabular-nums min-w-0">
							{prefs.weightUnit === "kg" ? (
								<>
									<span className="text-primary font-bold text-sm transition-all duration-300">
										75.0 kg
									</span>
									<span className="text-muted-foreground/30 text-xs">
										/
									</span>
									<span className="text-muted-foreground/50 text-xs line-through decoration-muted-foreground/30 transition-all duration-300">
										165.3 lb
									</span>
								</>
							) : (
								<>
									<span className="text-primary font-bold text-sm transition-all duration-300">
										165.3 lb
									</span>
									<span className="text-muted-foreground/30 text-xs">
										/
									</span>
									<span className="text-muted-foreground/50 text-xs line-through decoration-muted-foreground/30 transition-all duration-300">
										75.0 kg
									</span>
								</>
							)}
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

					{/* Dual-Display Preview — Active unit shown first */}
					<div className="mt-3 flex items-center justify-between gap-3 p-2 border border-border/30 bg-muted/20">
						<div className="flex items-baseline gap-2 font-mono tabular-nums min-w-0">
							{prefs.measurementUnit === "in" ? (
								<>
									<span className="text-primary font-bold text-sm transition-all duration-300">
										35.4 in
									</span>
									<span className="text-muted-foreground/30 text-xs">
										/
									</span>
									<span className="text-muted-foreground/50 text-xs line-through decoration-muted-foreground/30 transition-all duration-300">
										90.0 cm
									</span>
								</>
							) : (
								<>
									<span className="text-primary font-bold text-sm transition-all duration-300">
										90.0 cm
									</span>
									<span className="text-muted-foreground/30 text-xs">
										/
									</span>
									<span className="text-muted-foreground/50 text-xs line-through decoration-muted-foreground/30 transition-all duration-300">
										35.4 in
									</span>
								</>
							)}
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
