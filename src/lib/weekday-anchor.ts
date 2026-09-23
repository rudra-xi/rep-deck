export const WEEKDAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const;

export const WEEKDAY_SHORT = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
] as const;

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function isValidWeekday(value: unknown): value is Weekday {
	return (
		typeof value === "number" &&
		Number.isInteger(value) &&
		value >= 0 &&
		value <= 6
	);
}

/**
 * Returns the derived calendar weekday for a given dayIndex,
 * or null if the plan has no anchor.
 */
export function deriveWeekday(
	anchorWeekday: number | null,
	dayIndex: number,
): Weekday | null {
	if (anchorWeekday == null || !isValidWeekday(anchorWeekday)) return null;
	const offset = (anchorWeekday + (dayIndex - 1)) % 7;
	return offset as Weekday;
}

/**
 * Human-readable weekday name for a given day, or null if unanchored.
 */
export function deriveWeekdayName(
	anchorWeekday: number | null,
	dayIndex: number,
): string | null {
	const wd = deriveWeekday(anchorWeekday, dayIndex);
	return wd == null ? null : WEEKDAY_NAMES[wd];
}

/**
 * Returns the dayIndex in a plan that falls on `weekday`, or null if
 * the plan doesn't cover that day (e.g. a 3-day plan on a 5th weekday).
 *
 * @param anchorWeekday  plan's anchor (0–6), or null
 * @param weekday        target weekday (0–6)
 * @param dayCount       number of days in the plan
 */
export function dayIndexForWeekday(
	anchorWeekday: number | null,
	weekday: number,
	dayCount: number,
): number | null {
	if (anchorWeekday == null || !isValidWeekday(anchorWeekday)) return null;
	if (dayCount <= 0) return null;

	const offset = (weekday - anchorWeekday + 7) % 7;
	const dayIndex = offset + 1;

	return dayIndex <= dayCount ? dayIndex : null;
}

/**
 * Returns the dayIndex that corresponds to today's weekday,
 * or null if today isn't covered by the plan.
 */
export function todayDayIndex(
	anchorWeekday: number | null,
	dayCount: number,
): number | null {
	if (anchorWeekday == null) return null;
	return dayIndexForWeekday(anchorWeekday, new Date().getDay(), dayCount);
}

/**
 * Compact label like "Mon" / "Tue" for a day, or null if unanchored.
 */
export function deriveWeekdayShort(
	anchorWeekday: number | null,
	dayIndex: number,
): string | null {
	const wd = deriveWeekday(anchorWeekday, dayIndex);
	return wd == null ? null : WEEKDAY_SHORT[wd];
}
