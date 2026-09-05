import { useState, useEffect } from "react";

interface KpiCardOption {
	label: string;
	value: string;
	targetValue: string;
	subtext?: string;
	trend?: {
		direction: "up" | "down" | "neutral";
		value?: string;
	};
}

export function useKpiCards(bestLiftDropdownOptions?: KpiCardOption[]) {
	const defaultLift = bestLiftDropdownOptions?.[0]?.value ?? "Bench Press";
	const [selectedLiftValue, setSelectedLiftValue] =
		useState<string>(defaultLift);

	useEffect(() => {
		if (bestLiftDropdownOptions && bestLiftDropdownOptions.length > 0) {
			setSelectedLiftValue(bestLiftDropdownOptions[0].value);
		}
	}, [bestLiftDropdownOptions]);

	const getActiveLiftOption = (options?: KpiCardOption[]) => {
		return (
			options?.find(
				(opt) =>
					opt.value.trim().toLowerCase() ===
						selectedLiftValue.trim().toLowerCase() ||
					opt.label.trim().toLowerCase() ===
						selectedLiftValue.trim().toLowerCase(),
			) ?? options?.[0]
		);
	};

	return {
		selectedLiftValue,
		setSelectedLiftValue,
		getActiveLiftOption,
	};
}
