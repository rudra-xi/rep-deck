export function formatTargetReps(range: string | null): {
	value: string;
	label: string | null;
} {
	if (!range) return { value: "—", label: null };

	const trimmed = range.trim();

	const looksLikeTime =
		/[sm]$/i.test(trimmed) ||
		/sec|min|hold/i.test(trimmed) ||
		/^\d+:\d{2}$/.test(trimmed);

	return {
		value: trimmed,
		label: looksLikeTime ? null : "reps",
	};
}
