import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storage";

interface SetInput {
	weight: string;
	reps: string;
	rpe: string;
	added?: boolean;
}

interface ExerciseState {
	sets: Record<number, SetInput>;
	note: string;
}

type ExerciseInputsState = Record<string, ExerciseState>;

const VALIDATION = {
	weight: { min: 0, max: 1000 },
	reps: { min: 1, max: 100 },
	rpe: { min: 0, max: 10 },
} as const;

type FieldType = keyof typeof VALIDATION;

const EMPTY_SET: SetInput = { weight: "", reps: "", rpe: "" };

function migrate(raw: unknown): ExerciseInputsState {
	if (!raw || typeof raw !== "object") return {};
	const result: ExerciseInputsState = {};
	for (const [exerciseId, value] of Object.entries(raw)) {
		if (!value || typeof value !== "object") continue;

	
		if ("sets" in value && "note" in value) {
			result[exerciseId] = value as ExerciseState;
			continue;
		}

		const sets: Record<number, SetInput> = {};
		for (const [k, v] of Object.entries(value)) {
			const n = Number(k);
			if (!Number.isNaN(n) && v && typeof v === "object") {
				sets[n] = v as SetInput;
			}
		}
		result[exerciseId] = { sets, note: "" };
	}
	return result;
}

export function useExerciseInputs() {
	const [inputs, setInputs] = useState<ExerciseInputsState>({});
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.EXERCISE_INPUTS);
			if (saved) {
				setInputs(migrate(JSON.parse(saved)));
			}
		} catch (error) {
			console.error("Failed to restore exercise inputs:", error);
		} finally {
			setIsInitialized(true);
		}
	}, []);

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

	const validateAndCorrect = useCallback(
		(field: FieldType, value: string): string => {
			if (value === "") return value;
			const num = parseFloat(value);
			if (Number.isNaN(num)) return value;
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

			setInputs((prev) => {
				const existing = prev[exerciseId] ?? {
					sets: {},
					note: "",
				};

				return {
					...prev,
					[exerciseId]: {
						...existing,
						sets: {
							...existing.sets,
							[setNumber]: {
								...(existing.sets[setNumber] ?? EMPTY_SET),
								[field]: processedValue,
							},
						},
					},
				};
			});
		},
		[validateAndCorrect],
	);

	const markSetAsAdded = useCallback(
		(exerciseId: string, setNumber: number) => {
			setInputs((prev) => {
				const existing = prev[exerciseId] ?? { sets: {}, note: "" };
				const existingSet = existing.sets[setNumber] ?? EMPTY_SET;

				return {
					...prev,
					[exerciseId]: {
						...existing,
						sets: {
							...existing.sets,
							[setNumber]: { ...existingSet, added: true },
						},
					},
				};
			});
		},
		[],
	);

	const clearInputs = useCallback(() => {
		setInputs({});
		localStorage.removeItem(STORAGE_KEYS.EXERCISE_INPUTS);
	}, []);

	const getSetInput = useCallback(
		(exerciseId: string, setNumber: number) => {
			return inputs[exerciseId]?.sets?.[setNumber];
		},
		[inputs],
	);

	const setExerciseNote = useCallback((exerciseId: string, value: string) => {
		setInputs((prev) => {
			const existing = prev[exerciseId] ?? { sets: {}, note: "" };
			return {
				...prev,
				[exerciseId]: { ...existing, note: value },
			};
		});
	}, []);

	const getExerciseNote = useCallback(
		(exerciseId: string) => {
			return inputs[exerciseId]?.note ?? "";
		},
		[inputs],
	);

	const getValidationRules = useCallback((field: FieldType) => {
		return VALIDATION[field];
	}, []);

	return {
		inputs,
		handleInputChange,
		markSetAsAdded,
		clearInputs,
		getSetInput,
		getExerciseNote,
		setExerciseNote,
		getValidationRules,
		isInitialized,
	};
}
