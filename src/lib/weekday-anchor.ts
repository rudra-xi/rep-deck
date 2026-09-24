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

export function deriveWeekday(
	anchorWeekday: number | null,
	dayIndex: number,
): Weekday | null {
	if (anchorWeekday == null || !isValidWeekday(anchorWeekday)) return null;
	const offset = (anchorWeekday + (dayIndex - 1)) % 7;
	return offset as Weekday;
}

export function deriveWeekdayName(
	anchorWeekday: number | null,
	dayIndex: number,
): string | null {
	const wd = deriveWeekday(anchorWeekday, dayIndex);
	return wd == null ? null : WEEKDAY_NAMES[wd];
}

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

export function todayDayIndex(
	anchorWeekday: number | null,
	dayCount: number,
): number | null {
	if (anchorWeekday == null) return null;
	return dayIndexForWeekday(anchorWeekday, new Date().getDay(), dayCount);
}

export function deriveWeekdayShort(
	anchorWeekday: number | null,
	dayIndex: number,
): string | null {
	const wd = deriveWeekday(anchorWeekday, dayIndex);
	return wd == null ? null : WEEKDAY_SHORT[wd];
}

export function dayIndexForDate(
	anchorWeekday: number | null,
	date: Date,
	dayCount: number,
): number | null {
	if (anchorWeekday == null) return null;
	return dayIndexForWeekday(anchorWeekday, date.getDay(), dayCount);
}
