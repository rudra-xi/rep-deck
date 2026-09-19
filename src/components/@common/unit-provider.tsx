// components/@common/unit-provider.tsx
"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import {
	formatMeasurement,
	formatMeasurementString,
	formatWeight,
	formatWeightString,
	MEASUREMENT_UNIT_FULL,
	MEASUREMENT_UNIT_LABEL,
	type MeasurementUnit,
	parseMeasurementToIn,
	parseWeightToKg,
	WEIGHT_UNIT_FULL,
	WEIGHT_UNIT_LABEL,
	type WeightUnit,
} from "@/lib/units";
import type { UserPreferences } from "@/types";

interface UnitContextValue {
	weightUnit: WeightUnit;
	measurementUnit: MeasurementUnit;
	weightLabel: string;
	measurementLabel: string;
	weightLabelFull: string;
	measurementLabelFull: string;

	/** DB kg → user unit (number) */
	fmtWeight: (weightKg: number) => number;
	/** DB kg → user unit (string, e.g. "165.3 lb") */
	fmtWeightStr: (weightKg: number, withUnit?: boolean) => string;
	/** user input → DB kg */
	toKg: (input: number) => number;

	/** DB in → user unit (number) */
	fmtMeasurement: (lengthIn: number) => number;
	/** DB in → user unit (string) */
	fmtMeasurementStr: (lengthIn: number, withUnit?: boolean) => string;
	/** user input → DB in */
	toIn: (input: number) => number;
}

const UnitContext = createContext<UnitContextValue | null>(null);

interface UnitProviderProps {
	preferences: UserPreferences;
	children: ReactNode;
}

export function UnitProvider({ preferences, children }: UnitProviderProps) {
	const weightUnit = (preferences.weightUnit ?? "kg") as WeightUnit;
	const measurementUnit = (preferences.measurementUnit ??
		"in") as MeasurementUnit;

	const value = useMemo<UnitContextValue>(
		() => ({
			weightUnit,
			measurementUnit,
			weightLabel: WEIGHT_UNIT_LABEL[weightUnit],
			measurementLabel: MEASUREMENT_UNIT_LABEL[measurementUnit],
			weightLabelFull: WEIGHT_UNIT_FULL[weightUnit],
			measurementLabelFull: MEASUREMENT_UNIT_FULL[measurementUnit],

			fmtWeight: (kg) => formatWeight(kg, weightUnit),
			fmtWeightStr: (kg, withUnit = true) =>
				formatWeightString(kg, weightUnit, withUnit),
			toKg: (input) => parseWeightToKg(input, weightUnit),

			fmtMeasurement: (inch) => formatMeasurement(inch, measurementUnit),
			fmtMeasurementStr: (inch, withUnit = true) =>
				formatMeasurementString(inch, measurementUnit, withUnit),
			toIn: (input) => parseMeasurementToIn(input, measurementUnit),
		}),
		[weightUnit, measurementUnit],
	);

	return (
		<UnitContext.Provider value={value}>{children}</UnitContext.Provider>
	);
}

export function useUnits(): UnitContextValue {
	const ctx = useContext(UnitContext);
	if (!ctx) {
		// Safe fallback — won't crash the app if provider missing
		return {
			weightUnit: "kg",
			measurementUnit: "in",
			weightLabel: "kg",
			measurementLabel: "in",
			weightLabelFull: "kilograms",
			measurementLabelFull: "inches",
			fmtWeight: (kg) => Number(kg.toFixed(2)),
			fmtWeightStr: (kg, withUnit = true) =>
				withUnit
					? `${Number(kg.toFixed(2))} kg`
					: `${Number(kg.toFixed(2))}`,
			toKg: (input) => Number(input.toFixed(2)),
			fmtMeasurement: (inch) => Number(inch.toFixed(2)),
			fmtMeasurementStr: (inch, withUnit = true) =>
				withUnit
					? `${Number(inch.toFixed(2))} in`
					: `${Number(inch.toFixed(2))}`,
			toIn: (input) => Number(input.toFixed(2)),
		};
	}
	return ctx;
}
