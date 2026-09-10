// hooks/useMeasurementReminders.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Map short day names to full day names
const FULL_DAY_NAMES: Record<string, string> = {
	Mon: "Monday",
	Tue: "Tuesday",
	Wed: "Wednesday",
	Thu: "Thursday",
	Fri: "Friday",
	Sat: "Saturday",
	Sun: "Sunday",
};

// Map short day names to plural full day names
const PLURAL_DAY_NAMES: Record<string, string> = {
	Mon: "Mondays",
	Tue: "Tuesdays",
	Wed: "Wednesdays",
	Thu: "Thursdays",
	Fri: "Fridays",
	Sat: "Saturdays",
	Sun: "Sundays",
};

const STORAGE_KEY = "measurement_reminder_days";

export function useMeasurementReminders(
	initialDays: string[] = ["Mon", "Thu"],
) {
	const [selectedDays, setSelectedDays] = useState<string[]>(initialDays);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		if (typeof window !== "undefined") {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					if (Array.isArray(parsed) && parsed.length > 0) {
						setSelectedDays(parsed);
					}
				} catch (e) {
					console.error("Failed to parse stored reminder days", e);
				}
			}
		}
	}, []);

	useEffect(() => {
		if (isMounted && typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedDays));
		}
	}, [selectedDays, isMounted]);

	const getPluralDayName = (day: string): string => {
		return PLURAL_DAY_NAMES[day] || `${day}s`;
	};

	const getFullDayName = (day: string): string => {
		return FULL_DAY_NAMES[day] || day;
	};

	const toggleDay = (day: string) => {
		const isAdding = !selectedDays.includes(day);
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);

		// Show toast feedback with proper pluralization
		if (isAdding) {
			const pluralDay = getPluralDayName(day);
			toast.success(`Added ${getFullDayName(day)} to tracking days`, {
				description: `You'll be reminded to measure on ${pluralDay}`,
				duration: 3000,
			});
		} else {
			toast.info(`Removed ${getFullDayName(day)} from tracking days`, {
				duration: 3000,
			});
		}
	};

	const isDaySelected = (day: string) => selectedDays.includes(day);

	const resetToDefaults = () => {
		setSelectedDays(initialDays);
		const pluralDays = initialDays.map(getPluralDayName).join(", ");
		toast.info("Reset to default tracking days", {
			description: `Tracking on ${pluralDays}`,
			duration: 3000,
		});
	};

	return {
		selectedDays,
		toggleDay,
		isDaySelected,
		days: DAYS,
		resetToDefaults,
		isMounted,
	};
}
