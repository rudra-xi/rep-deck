import { useMemo, useState } from "react";
import { CHALLENGES } from "@/constants";

export function useChallenge() {
	const [mobileTab, setMobileTab] = useState<"past" | "current" | "next">(
		"current",
	);

	const { yesterday, today, tomorrow } = useMemo(() => {
		const now = new Date();
		const start = new Date(now.getFullYear(), 0, 0);
		const diff = now.getTime() - start.getTime();
		const oneDay = 1000 * 60 * 60 * 24;
		const dayIndex = Math.floor(diff / oneDay);

		const total = CHALLENGES.length;
		const yesterdayIdx = (dayIndex - 1 + total) % total;
		const todayIdx = dayIndex % total;
		const tomorrowIdx = (dayIndex + 1) % total;

		return {
			yesterday: CHALLENGES[yesterdayIdx],
			today: CHALLENGES[todayIdx],
			tomorrow: CHALLENGES[tomorrowIdx],
		};
	}, []);

	const mobileItems = {
		past: { title: "Yesterday", challenge: yesterday },
		current: { title: "Today", challenge: today },
		next: { title: "Tomorrow", challenge: tomorrow },
	};

	const goToPrevious = () => {
		setMobileTab((p) => (p === "next" ? "current" : "past"));
	};

	const goToNext = () => {
		setMobileTab((p) => (p === "past" ? "current" : "next"));
	};

	return {
		mobileTab,
		setMobileTab,
		mobileItems,
		yesterday,
		today,
		tomorrow,
		goToPrevious,
		goToNext,
	};
}
