"use client";

import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useMounted } from "./use-mounted";

export const THEME_OPTIONS = [
	{ value: "enterprise", label: "Enterprise" },
	{ value: "zen", label: "Zen" },
	{ value: "opcl", label: "OPCL" },
	{ value: "qraft", label: "qrafthive" },
	{ value: "rosepine", label: "Rose Pine" },
	{ value: "barmell", label: "Barmell" },
] as const;

export function useThemeSelection() {
	const { theme, setTheme } = useTheme();
	const isMounted = useMounted();

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
		const label =
			THEME_OPTIONS.find((t) => t.value === newTheme)?.label ?? newTheme;
		toast.success(`Theme set to ${label}`);
	};

	return { theme, isMounted, handleThemeChange };
}