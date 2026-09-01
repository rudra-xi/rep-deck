// hooks/useExerciseInputs.ts
import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/storage";

interface SetInput {
	weight: string;
	reps: string;
	rpe: string;
	added?: boolean;
}

type SetInputState = Record<string, Record<number, SetInput>>;

// Validation rules
const VALIDATION = {
	weight: { min: 0, max: 1000 },
	reps: { min: 1, max: 100 },
	rpe: { min: 0, max: 10 },
} as const;

type FieldType = keyof typeof VALIDATION;

export function useExerciseInputs() {
	const [inputs, setInputs] = useState<SetInputState>({});
	const [isInitialized, setIsInitialized] = useState(false);

	// Load from localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.EXERCISE_INPUTS);
			if (saved) {
				setInputs(JSON.parse(saved));
			}
		} catch (error) {
			console.error("Failed to restore exercise inputs:", error);
		} finally {
			setIsInitialized(true);
		}
	}, []);

	// Save to localStorage
	useEffect(() => {
		if (!isInitialized) return;
		try {
			localStorage.setItem(
				STORAGE_KEYS.EXERCISE_INPUTS,
				JSON.stringify(inputs),
			);
		} catch (error) {
			console.error("Failed to save exercise inputs:", error);
		}
	}, [inputs, isInitialized]);

	// Core ranged validation logic (same as useRangedInput)
	const validateAndCorrect = useCallback(
		(field: FieldType, value: string): string => {
			if (value === "") return value;

			const num = parseFloat(value);
			if (isNaN(num)) return value;

			const { min, max } = VALIDATION[field];
			if (num > max) return max.toString();
			if (num < min) return min.toString();
			return value;
		},
		[],
	);

	const handleInputChange = useCallback(
		(
			exerciseId: string,
			setNumber: number,
			field: FieldType,
			value: string,
		) => {
			const processedValue = validateAndCorrect(field, value);

			setInputs((prev) => ({
				...prev,
				[exerciseId]: {
					...(prev[exerciseId] || {}),
					[setNumber]: {
						...(prev[exerciseId]?.[setNumber] || {
							weight: "",
							reps: "",
							rpe: "",
						}),
						[field]: processedValue,
					},
				},
			}));
		},
		[validateAndCorrect],
	);

	const markSetAsAdded = useCallback(
		(exerciseId: string, setNumber: number) => {
			setInputs((prev) => ({
				...prev,
				[exerciseId]: {
					...prev[exerciseId],
					[setNumber]: {
						...prev[exerciseId]?.[setNumber],
						added: true,
					},
				},
			}));
		},
		[],
	);

	const clearInputs = useCallback(() => {
		setInputs({});
		localStorage.removeItem(STORAGE_KEYS.EXERCISE_INPUTS);
	}, []);

	const getSetInput = useCallback(
		(exerciseId: string, setNumber: number) => {
			return inputs[exerciseId]?.[setNumber];
		},
		[inputs],
	);

	// Get validation rules for a field
	const getValidationRules = useCallback((field: FieldType) => {
		return VALIDATION[field];
	}, []);

	return {
		inputs,
		handleInputChange,
		markSetAsAdded,
		clearInputs,
		getSetInput,
		getValidationRules,
		isInitialized,
	};
}
