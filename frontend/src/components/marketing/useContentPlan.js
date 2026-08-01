// src/components/marketing/useContentPlan.js
//
// Owns the content plan for the Marketing page: the calendar reads it, the
// suggestion panel and the editor modal write to it. One owner means an edit
// made in the modal shows up in the grid without either knowing about the
// other.

import { useCallback, useEffect, useMemo, useState } from "react";

import { monthKey } from "./calendarMonth";
import {
  groupByDate,
  readPlan,
  seedPlan,
  sortByDate,
  writePlan,
} from "./contentPlan";

export default function useContentPlan({ orders = [] } = {}) {
  const [items, setItems] = useState(() => {
    const stored = readPlan();

    // Seeded during the initial render for the same reason the dashboard reads
    // storage there: doing it in an effect paints an empty month for a frame
    // and then replaces it.
    return stored.seeded ? stored.items : seedPlan({ orders });
  });

  // The only writer. The starter month is saved on mount, and every later edit
  // as it lands — so no caller has to remember to persist.
  useEffect(() => {
    writePlan({ items, seeded: true });
  }, [items]);

  /** Insert or update, decided by id — the modal doesn't need to know which. */
  const saveItem = useCallback((item) => {
    if (!item?.id) return;

    setItems((current) =>
      current.some((existing) => existing.id === item.id)
        ? current.map((existing) => (existing.id === item.id ? item : existing))
        : [...current, item],
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  /**
   * Offered on the empty state, so clearing a month isn't a dead end. Scoped to
   * the month being looked at: restoring August must not throw away what's
   * planned for September.
   */
  const reseed = useCallback(
    (month = new Date()) => {
      const prefix = monthKey(month);

      setItems((current) => [
        ...current.filter((item) => !String(item.date).startsWith(prefix)),
        ...seedPlan({ orders, month }),
      ]);
    },
    [orders],
  );

  const byDate = useMemo(() => groupByDate(items), [items]);

  const sorted = useMemo(() => sortByDate(items), [items]);

  return { items: sorted, byDate, saveItem, removeItem, reseed };
}
