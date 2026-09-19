export const KG_TO_LB = 2.20462;
export const IN_TO_CM = 2.54;

export type WeightUnit = "kg" | "lb";
export type MeasurementUnit = "cm" | "in";

export function formatWeight(weightKg: number, unit: WeightUnit): number {
	if (unit === "lb") return Number((weightKg * KG_TO_LB).toFixed(2));
	return Number(weightKg.toFixed(2));
}

export function parseWeightToKg(input: number, unit: WeightUnit): number {
	if (unit === "lb") return Number((input / KG_TO_LB).toFixed(2));
	return Number(input.toFixed(2));
}

export function formatWeightString(
	weightKg: number,
	unit: WeightUnit,
	withUnit = true,
): string {
	const v = formatWeight(weightKg, unit);
	return withUnit ? `${v} ${unit}` : `${v}`;
}

export function formatMeasurement(
	lengthIn: number,
	unit: MeasurementUnit,
): number {
	if (unit === "cm") return Number((lengthIn * IN_TO_CM).toFixed(2));
	return Number(lengthIn.toFixed(2));
}

export function parseMeasurementToIn(
	input: number,
	unit: MeasurementUnit,
): number {
	if (unit === "cm") return Number((input / IN_TO_CM).toFixed(2));
	return Number(input.toFixed(2));
}

export function formatMeasurementString(
	lengthIn: number,
	unit: MeasurementUnit,
	withUnit = true,
): string {
	const v = formatMeasurement(lengthIn, unit);
	return withUnit ? `${v} ${unit}` : `${v}`;
}

export const WEIGHT_UNIT_LABEL: Record<WeightUnit, string> = {
	kg: "kg",
	lb: "lb",
};

export const MEASUREMENT_UNIT_LABEL: Record<MeasurementUnit, string> = {
	cm: "cm",
	in: "in",
};

export const WEIGHT_UNIT_FULL: Record<WeightUnit, string> = {
	kg: "kilograms",
	lb: "pounds",
};

export const MEASUREMENT_UNIT_FULL: Record<MeasurementUnit, string> = {
	cm: "centimeters",
	in: "inches",
};
