import { useEffect, useState } from "react";
import { clearAllWorkoutData, STORAGE_KEYS } from "@/lib/storage";
import type { LoggedSet } from "@/types";

export function useWorkoutDraft(initialDayIndex: number) {
	const [loggedSets, setLoggedSets] = useState<LoggedSet[]>([]);
	const [notes, setNotes] = useState("");
	const [selectedDayIndex, setSelectedDayIndex] = useState(initialDayIndex);
	const [sessionDate, setSessionDate] = useState<Date>(new Date());
	const [isInitialized, setIsInitialized] = useState(false);
	const [draftExists, setDraftExists] = useState(false);

	useEffect(() => {
		try {
			const savedDay = localStorage.getItem(
				STORAGE_KEYS.WORKOUT_SELECTED_DAY,
			);
			if (savedDay !== null) {
				const parsedDay = Number(savedDay);
				if (!Number.isNaN(parsedDay)) {
					setSelectedDayIndex(parsedDay);
				}
			}

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

	useEffect(() => {
		if (!isInitialized) return;

		try {
			const sessionData = {
				loggedSets,
				notes,
				selectedDayIndex,
				sessionDate: sessionDate.toISOString(),
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
	}, [loggedSets, notes, selectedDayIndex, isInitialized, sessionDate]);

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

	const clearDraft = () => {
		clearAllWorkoutData();
		setLoggedSets([]);
		setNotes("");
		setSessionDate(new Date());
		setDraftExists(false);
	};

	const addSet = (
		newSet: Omit<LoggedSet, "id"> & { templateId?: string },
	) => {
		const setWithId = { ...newSet, id: crypto.randomUUID() };
		setLoggedSets((prev) => [...prev, setWithId]);
	};

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
		sessionDate,
		setSessionDate,
		isInitialized,
		draftExists,
		addSet,
		clearDraft,
		clearSession,
	};
}
