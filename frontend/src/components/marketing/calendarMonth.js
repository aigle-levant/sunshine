// src/components/marketing/calendarMonth.js
//
// Date arithmetic for the month view. Pure functions, no React and no storage,
// so the grid and the agenda list can be built from the same source.
//
// Everything is keyed by a local "YYYY-MM-DD" string rather than a Date.
// `toISOString()` is deliberately avoided: it converts to UTC first, which in
// IST (+5:30) reports the previous day for anything before 05:30.

/** 0 = Sunday, 1 = Monday. One line to change if a Sunday start is wanted. */
const WEEK_STARTS_ON = 1;

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function toKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function fromKey(key) {
  const [year, month, day] = String(key ?? "")
    .split("-")
    .map(Number);

  if (!year || !month || !day) return null;

  // Constructed from parts, so it lands at local midnight on the right day.
  return new Date(year, month - 1, day);
}

export function todayKey() {
  return toKey(new Date());
}

/** "YYYY-MM" — the prefix every day key in that month shares. */
export function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function monthLabel(date) {
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function isSameMonth(date, other) {
  return (
    date.getFullYear() === other.getFullYear() &&
    date.getMonth() === other.getMonth()
  );
}

/** "Fri, 7 Aug" — the agenda list's heading and the modal's subtitle. */
export function formatDayLabel(key) {
  const date = fromKey(key);

  if (!date) return "";

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * One flat array of cells covering the month, padded at both ends so the first
 * cell is a week start and the last a week end. Flat rather than nested weeks
 * because a single `grid-cols-7` lays it out with no row wrappers.
 *
 * Only as many weeks as the month needs — a fixed six would leave a dead row
 * in most months.
 */
export function buildMonthCells(monthDate, today = new Date()) {
  const first = startOfMonth(monthDate);

  const leading = (first.getDay() - WEEK_STARTS_ON + 7) % 7;

  const start = new Date(
    first.getFullYear(),
    first.getMonth(),
    1 - leading,
  );

  const daysInMonth = new Date(
    first.getFullYear(),
    first.getMonth() + 1,
    0,
  ).getDate();

  const total = Math.ceil((leading + daysInMonth) / 7) * 7;

  const currentKey = toKey(today);

  return Array.from({ length: total }, (_, offset) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + offset,
    );

    const key = toKey(date);

    return {
      key,
      date,
      day: date.getDate(),
      inMonth: isSameMonth(date, first),
      isToday: key === currentKey,
    };
  });
}
