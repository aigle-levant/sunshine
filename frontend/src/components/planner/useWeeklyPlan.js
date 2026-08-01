// src/components/planner/useWeeklyPlan.js
//
// The rows for the week being viewed, and their persistence.
//
// State is the *whole* planner — every week, keyed by its Monday — and the
// visible week is derived from it. That's what makes moving between weeks free:
// there's no effect resyncing state when the week changes, and therefore no
// window in which one week's rows could be written under another week's key.
//
// Every mutation goes through `commit`, which saves in the same call that
// updates state, so an edit, an add, a delete and a generated week are all
// persisted without any caller remembering to.

import { useCallback, useMemo, useState } from "react";

import { getPlannerWeeks, savePlannerWeek } from "../../lib/storage";
import { dateForDay, fromKey, normaliseRow, sortRows, toKey } from "./plannerModel";

/** Stored weeks, repaired against the current row shape. */
function loadWeeks() {
  const weeks = {};

  for (const [weekKey, rows] of Object.entries(getPlannerWeeks())) {
    const weekStart = fromKey(weekKey);

    if (!weekStart || !Array.isArray(rows)) continue;

    try {
      weeks[weekKey] = sortRows(
        rows
          .filter((row) => row && typeof row === "object" && row.id)
          .map((row) => normaliseRow(row, weekStart)),
      );
    } catch {
      // Drop one unreadable week rather than losing every other one.
    }
  }

  return weeks;
}

export default function useWeeklyPlan(weekStart) {
  const weekKey = toKey(weekStart);

  const [weeks, setWeeks] = useState(loadWeeks);

  const rows = useMemo(() => weeks[weekKey] ?? [], [weeks, weekKey]);

  const commit = useCallback(
    (next) => {
      const ordered = sortRows(next);

      setWeeks((current) => {
        const updated = { ...current };

        // An emptied week is removed, so it falls back to the empty state
        // rather than reading as a saved-but-blank plan.
        if (ordered.length) updated[weekKey] = ordered;
        else delete updated[weekKey];

        return updated;
      });

      savePlannerWeek(weekKey, ordered);

      return ordered;
    },
    [weekKey],
  );

  /** Insert or update, decided by id. */
  const saveRow = useCallback(
    (row) => {
      commit(
        rows.some((existing) => existing.id === row.id)
          ? rows.map((existing) => (existing.id === row.id ? row : existing))
          : [...rows, row],
      );
    },
    [commit, rows],
  );

  const deleteRow = useCallback(
    (id) => commit(rows.filter((row) => row.id !== id)),
    [commit, rows],
  );

  /** Returns the new row so the page can drop straight into editing it. */
  const addRow = useCallback(() => {
    const row = normaliseRow(
      { day: "Monday", date: dateForDay(weekStart, "Monday") },
      weekStart,
    );

    commit([...rows, row]);

    return row;
  }, [commit, rows, weekStart]);

  const replaceAll = useCallback((next) => commit(next), [commit]);

  return useMemo(
    () => ({ rows, weekKey, saveRow, deleteRow, addRow, replaceAll }),
    [rows, weekKey, saveRow, deleteRow, addRow, replaceAll],
  );
}
