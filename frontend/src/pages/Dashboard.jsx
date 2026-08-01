// src/pages/Dashboard.jsx
//
// The /dashboard layout route. It owns the data every section shares — there's
// no dashboard API yet, so `voicekart:entries` in localStorage is the whole
// source of truth — and hands it to the active section through Outlet context.
// Loading here rather than per-section means navigating between sections never
// re-reads storage.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { buildDashboard, readEntries } from "../components/dashboard/dashboardData";

/** Matches a string against the search box, tolerantly. */
function matches(value, query) {
  return String(value ?? "")
    .toLowerCase()
    .includes(query);
}

/**
 * `isLoading` is a prop rather than internal state because localStorage is
 * synchronous — there is nothing to wait for today. It's wired up so that
 * swapping `readEntries()` for a fetch only means passing `true` while it's
 * in flight.
 */
function Dashboard({ isLoading = false }) {
  // Read during the initial render: reading later in an effect would paint an
  // empty dashboard first and then immediately replace it.
  const [entries, setEntries] = useState(readEntries);

  // Search lives in the URL so a filtered view can be shared or reloaded, and
  // so it survives moving between sections.
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";

  const setQuery = useCallback(
    (value) => {
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);

          if (value) next.set("q", value);
          else next.delete("q");

          return next;
        },
        // Typing shouldn't push a history entry per keystroke.
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const load = useCallback(() => setEntries(readEntries()), []);

  useEffect(() => {
    // Voice mode may have run in another tab since this one was last active.
    const onFocus = () => load();

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onFocus);
    };
  }, [load]);

  const data = useMemo(() => buildDashboard(entries), [entries]);

  const trimmed = query.trim().toLowerCase();

  const orders = useMemo(() => {
    if (!trimmed) return data.orders;

    return data.orders.filter(
      (order) =>
        matches(order.item, trimmed) ||
        matches(order.customer, trimmed) ||
        matches(order.status, trimmed),
    );
  }, [data.orders, trimmed]);

  const customers = useMemo(() => {
    if (!trimmed) return data.customers;

    return data.customers.filter((customer) => matches(customer.name, trimmed));
  }, [data.customers, trimmed]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "voicekart-records.json";
    link.click();

    URL.revokeObjectURL(url);
  }, [entries]);

  // `orders`/`customers` are search-filtered; `data` keeps the unfiltered set
  // for anything that shouldn't react to the search box (stats, campaigns).
  const context = useMemo(
    () => ({ data, entries, orders, customers, query, isLoading, onExport: handleExport }),
    [data, entries, orders, customers, query, isLoading, handleExport],
  );

  return (
    <DashboardLayout
      subtitle={
        data.entryCount
          ? `${data.entryCount} recorded ${data.entryCount === 1 ? "update" : "updates"}`
          : "No records yet"
      }
      query={query}
      onQueryChange={setQuery}
    >
      <Outlet context={context} />
    </DashboardLayout>
  );
}

export default Dashboard;
