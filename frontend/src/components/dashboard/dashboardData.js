// src/components/dashboard/dashboardData.js
//
// Turns the flat list of saved voice entries into everything the dashboard
// renders. Voice mode writes `voicekart:entries` (see voice/extraction.js);
// this is the only place that reads it, so the shape is defined once.

const HISTORY_KEY = "voicekart:entries";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Money is stored however the model returned it — coerce before any maths. */
function toNumber(value) {
  const number = typeof value === "number" ? value : Number(value);

  return Number.isFinite(number) ? number : null;
}

export function formatCurrency(amount, { compact = false } = {}) {
  const value = toNumber(amount) ?? 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: compact && value >= 100000 ? "compact" : "standard",
  }).format(value);
}

export function formatRelativeDate(iso) {
  if (!iso) return null;

  const then = new Date(iso);

  if (Number.isNaN(then.getTime())) return null;

  const days = Math.floor((Date.now() - then.getTime()) / (24 * 60 * 60 * 1000));

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return then.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** An order's worth: price × quantity when both are known, else the price. */
export function orderValue(order) {
  const price = toNumber(order?.price);

  if (price === null) return 0;

  const quantity = toNumber(order?.quantity);

  return quantity === null ? price : price * quantity;
}

function isPaid(payment) {
  return String(payment?.status ?? "").toLowerCase() === "paid";
}

function isOrderOpen(order) {
  const status = String(order?.status ?? "pending").toLowerCase();

  return status !== "completed" && status !== "delivered" && status !== "cancelled";
}

export function readEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Private mode, or something else wrote garbage to the key.
    return [];
  }
}

/**
 * Percentage change between the last seven days and the seven before that.
 * Returns null when there's no prior period to compare against — the cards
 * hide the trend chip rather than claim a misleading +100%.
 */
function trendFor(entries, valueOf) {
  const now = Date.now();

  let current = 0;
  let previous = 0;
  let hasPrevious = false;

  for (const entry of entries) {
    const stamp = new Date(entry?.savedAt ?? 0).getTime();

    if (Number.isNaN(stamp)) continue;

    const age = now - stamp;

    if (age <= WEEK_MS) {
      current += valueOf(entry);
    } else if (age <= WEEK_MS * 2) {
      previous += valueOf(entry);
      hasPrevious = true;
    }
  }

  if (!hasPrevious || previous === 0) return null;

  return Math.round(((current - previous) / previous) * 100);
}

/** Every order across every entry, newest first, with its source timestamp. */
function collectOrders(entries) {
  return entries.flatMap((entry) =>
    (entry?.data?.orders ?? []).map((order, index) => ({
      ...order,
      id: `${entry?.savedAt ?? "entry"}-${index}`,
      savedAt: entry?.savedAt ?? null,
      value: orderValue(order),
    })),
  );
}

/**
 * One row per customer, merged across entries. Names arrive romanised from the
 * backend but casing drifts, so the lowercase name is the identity.
 */
function collectCustomers(entries) {
  const byName = new Map();

  const touch = (rawName, savedAt) => {
    const name = String(rawName ?? "").trim();

    if (!name) return null;

    const key = name.toLowerCase();

    if (!byName.has(key)) {
      byName.set(key, {
        name,
        phone: null,
        orders: 0,
        spent: 0,
        outstanding: 0,
        lastSeen: savedAt,
      });
    }

    const record = byName.get(key);

    // Identity is case-insensitive, but display isn't: the model's casing
    // drifts between entries, so prefer a properly capitalised spelling.
    if (name[0] === name[0].toUpperCase() && record.name[0] !== record.name[0].toUpperCase()) {
      record.name = name;
    }

    // Keep the most recent sighting, whichever entry it came from.
    if (savedAt && (!record.lastSeen || savedAt > record.lastSeen)) {
      record.lastSeen = savedAt;
    }

    return record;
  };

  for (const entry of entries) {
    const savedAt = entry?.savedAt ?? null;
    const data = entry?.data ?? {};

    for (const customer of data.customers ?? []) {
      const record = touch(customer?.name, savedAt);

      if (record && !record.phone && customer?.phone) {
        record.phone = customer.phone;
      }
    }

    for (const order of data.orders ?? []) {
      const record = touch(order?.customer, savedAt);

      if (!record) continue;

      record.orders += 1;
      record.outstanding += orderValue(order);
    }

    for (const payment of data.payments ?? []) {
      const record = touch(payment?.customer, savedAt);

      if (!record) continue;

      const amount = toNumber(payment?.amount) ?? 0;

      if (isPaid(payment)) {
        record.spent += amount;
        record.outstanding -= amount;
      }
    }
  }

  return [...byName.values()]
    .map((customer) => ({
      ...customer,
      // A customer who overpaid across entries isn't owed money by us here.
      outstanding: Math.max(0, Math.round(customer.outstanding)),
    }))
    .sort((a, b) => String(b.lastSeen ?? "").localeCompare(String(a.lastSeen ?? "")));
}

/**
 * Insights and campaigns both come from the model's own `insights` array. The
 * dashboard never invents them — an empty array renders an empty state.
 */
function collectInsights(entries) {
  const seen = new Set();
  const insights = [];

  for (const entry of entries) {
    for (const text of entry?.data?.insights ?? []) {
      const value = String(text ?? "").trim();

      if (!value || seen.has(value.toLowerCase())) continue;

      seen.add(value.toLowerCase());
      insights.push({ text: value, savedAt: entry?.savedAt ?? null });
    }
  }

  return insights;
}

function collectTasks(entries) {
  const seen = new Set();
  const tasks = [];

  for (const entry of entries) {
    for (const text of entry?.data?.tasks ?? []) {
      const value = String(text ?? "").trim();

      if (!value || seen.has(value.toLowerCase())) continue;

      seen.add(value.toLowerCase());
      tasks.push({ text: value, savedAt: entry?.savedAt ?? null });
    }
  }

  return tasks;
}

function paidTotal(entry) {
  return (entry?.data?.payments ?? [])
    .filter(isPaid)
    .reduce((total, payment) => total + (toNumber(payment?.amount) ?? 0), 0);
}

function orderTotal(entry) {
  return (entry?.data?.orders ?? []).reduce(
    (total, order) => total + orderValue(order),
    0,
  );
}

/** The single call the dashboard makes. Everything below it is derived. */
export function buildDashboard(entries) {
  const orders = collectOrders(entries).sort((a, b) =>
    String(b.savedAt ?? "").localeCompare(String(a.savedAt ?? "")),
  );

  const customers = collectCustomers(entries);
  const insights = collectInsights(entries);
  const tasks = collectTasks(entries);

  const revenue = entries.reduce((total, entry) => total + paidTotal(entry), 0);
  const ordered = entries.reduce((total, entry) => total + orderTotal(entry), 0);

  // What's been ordered but not yet collected. Floored, because advances on
  // orders with no recorded price would otherwise push this negative.
  const outstanding = Math.max(0, Math.round(ordered - revenue));

  const openOrders = orders.filter(isOrderOpen);

  return {
    isEmpty: entries.length === 0,
    entryCount: entries.length,
    lastUpdated: entries[0]?.savedAt ?? null,

    stats: {
      revenue: Math.round(revenue),
      revenueTrend: trendFor(entries, paidTotal),

      orders: orders.length,
      ordersTrend: trendFor(entries, (entry) => (entry?.data?.orders ?? []).length),

      customers: customers.length,
      customersTrend: trendFor(
        entries,
        (entry) => (entry?.data?.customers ?? []).length,
      ),

      outstanding,
      outstandingCount: customers.filter((customer) => customer.outstanding > 0)
        .length,
    },

    orders,
    openOrders,
    customers,
    insights,
    tasks,
  };
}
