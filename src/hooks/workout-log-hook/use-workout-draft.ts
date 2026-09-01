// hooks/useWorkoutDraft.ts
import { useEffect, useState } from "react";
import type { LoggedSet } from "@/types";
import { STORAGE_KEYS, clearAllWorkoutData } from "@/lib/storage";

export function useWorkoutDraft(initialDayIndex: number) {
	const [loggedSets, setLoggedSets] = useState<LoggedSet[]>([]);
	const [notes, setNotes] = useState("");
	const [selectedDayIndex, setSelectedDayIndex] = useState(initialDayIndex);
	const [isInitialized, setIsInitialized] = useState(false);
	const [draftExists, setDraftExists] = useState(false);

	// Load all draft data on mount
	useEffect(() => {
		try {
			// Load selected day first
			const savedDay = localStorage.getItem(
				STORAGE_KEYS.WORKOUT_SELECTED_DAY,
			);
			if (savedDay !== null) {
				const parsedDay = Number(savedDay);
				if (!isNaN(parsedDay)) {
					setSelectedDayIndex(parsedDay);
				}
			}

			// Load session data
			const savedSession = localStorage.getItem(
				STORAGE_KEYS.WORKOUT_SESSION,
			);
			if (savedSession) {
				const parsed = JSON.parse(savedSession);
				setLoggedSets(parsed.loggedSets || []);
				setNotes(parsed.notes || "");
				if (parsed.selectedDayIndex) {
					setSelectedDayIndex(parsed.selectedDayIndex);
				}
				setDraftExists(parsed.loggedSets?.length > 0);
			}

			// Load notes separately if not in session
			const savedNotes = localStorage.getItem(STORAGE_KEYS.WORKOUT_NOTES);
			if (savedNotes && !savedSession) {
				setNotes(savedNotes);
			}
		} catch (error) {
			console.error("Failed to restore draft from storage:", error);
		} finally {
			setIsInitialized(true);
		}
	}, []);

	// Save all draft data
	useEffect(() => {
		if (!isInitialized) return;

		try {
			const sessionData = {
				loggedSets,
				notes,
				selectedDayIndex,
				timestamp: Date.now(),
			};
			localStorage.setItem(
				STORAGE_KEYS.WORKOUT_SESSION,
				JSON.stringify(sessionData),
			);
			setDraftExists(loggedSets.length > 0);
		} catch (error) {
			console.error("Failed to save draft:", error);
		}
	}, [loggedSets, notes, selectedDayIndex, isInitialized]);

	// Save selected day separately
	useEffect(() => {
		if (!isInitialized) return;
		try {
			localStorage.setItem(
				STORAGE_KEYS.WORKOUT_SELECTED_DAY,
				selectedDayIndex.toString(),
			);
		} catch (error) {
			console.error("Failed to save selected day:", error);
		}
	}, [selectedDayIndex, isInitialized]);

	// Clear all draft data using centralized function
	const clearDraft = () => {
		clearAllWorkoutData();
		setLoggedSets([]);
		setNotes("");
		setDraftExists(false);
	};

	// Add a set
	const addSet = (
		newSet: Omit<LoggedSet, "id"> & { templateId?: string },
	) => {
		console.log("📝 Adding set with notes:", newSet.notes); // ✅ Debug log
		const setWithId = { ...newSet, id: crypto.randomUUID() };
		setLoggedSets((prev) => [...prev, setWithId]);
	};

	// Clear just the session data (keep notes and day selection)
	const clearSession = () => {
		localStorage.removeItem(STORAGE_KEYS.WORKOUT_SESSION);
		setLoggedSets([]);
		setDraftExists(false);
	};

	return {
		loggedSets,
		setLoggedSets,
		notes,
		setNotes,
		selectedDayIndex,
		setSelectedDayIndex,
		isInitialized,
		draftExists,
		addSet,
		clearDraft,
		clearSession,
	};
}
