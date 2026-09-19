"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updatePreferences } from "@/actions/account";
import type { UserPreferences } from "@/types";

const WEIGHT_UNIT_LABELS = {
	kg: "kilograms (kg)",
	lb: "pounds (lb)",
} as const;

const MEASUREMENT_UNIT_LABELS = {
	cm: "centimeters (cm)",
	in: "inches (in)",
} as const;

export function usePreferences(initialPreferences: UserPreferences) {
	const [prefs, setPrefs] = useState<UserPreferences>({
		...initialPreferences,
		weightUnit: initialPreferences.weightUnit || "kg",
		measurementUnit: initialPreferences.measurementUnit || "in",
	});
	const [savingKey, setSavingKey] = useState<string | null>(null);

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
				toast.success(
					type === "weight"
						? `Weight unit set to ${WEIGHT_UNIT_LABELS[value as "kg" | "lb"]}`
						: `Measurement unit set to ${MEASUREMENT_UNIT_LABELS[value as "cm" | "in"]}`,
				);
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

	const handleWeightToggle = (checked: boolean) =>
		handlePreferenceChange("weightUnit", checked ? "lb" : "kg", "weight");

	const handleMeasurementToggle = (checked: boolean) =>
		handlePreferenceChange(
			"measurementUnit",
			checked ? "in" : "cm",
			"measurement",
		);

	return {
		prefs,
		savingKey,
		handleWeightToggle,
		handleMeasurementToggle,
	};
}
