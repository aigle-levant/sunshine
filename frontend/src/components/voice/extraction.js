// src/components/voice/extraction.js
//
// Single place that turns the backend's structured payload
// ({ summary, customers, orders, payments, tasks, insights }) into the flat
// set of fields the results screen shows, and back again on save.

const INTENT_LABELS = {
  record_sale: "Record Sale",
  record_payment: "Record Payment",
  add_customer: "Add Customer",
  add_order: "Add Order",
  set_reminder: "Set Reminder",
  unknown: "Not sure yet",
};

const LAST_ANALYSIS_KEY = "voicekart:last-analysis";
const HISTORY_KEY = "voicekart:entries";
const MAX_HISTORY = 20;

export function formatIntent(intent) {
  if (!intent) return null;

  return (
    INTENT_LABELS[intent] ??
    String(intent)
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

export function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === "") return null;

  const value = typeof amount === "number" ? amount : Number(amount);

  if (Number.isNaN(value)) return String(amount);

  return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

function sumAmounts(values) {
  const numbers = values
    .map((value) => (typeof value === "number" ? value : Number(value)))
    .filter((value) => Number.isFinite(value));

  return numbers.length
    ? numbers.reduce((total, value) => total + value, 0)
    : null;
}

function orderValue(order) {
  const price = Number(order?.price);

  if (!Number.isFinite(price)) return null;

  const quantity = Number(order?.quantity);

  return Number.isFinite(quantity) ? price * quantity : price;
}

function joinUnique(values, max = 2) {
  const unique = [...new Set(values.filter(Boolean).map(String))];

  if (!unique.length) return null;

  if (unique.length <= max) return unique.join(", ");

  return `${unique.slice(0, max).join(", ")} +${unique.length - max} more`;
}

/**
 * Nothing in the payload carries a model confidence, so it is derived from how
 * much of the record actually came back filled in. Shown as a hint, not a
 * promise — hence the deliberately narrow 55–99 band.
 */
function deriveConfidence(fields) {
  const checks = [
    fields.intent && fields.intent !== "unknown",
    fields.customer,
    fields.product,
    fields.quantity,
    fields.amount,
    fields.date,
  ];

  const filled = checks.filter(Boolean).length;

  return Math.round(55 + (filled / checks.length) * 44);
}

/**
 * Flattens a backend payload into the seven fields the results screen edits.
 * Everything is kept as a string so the inputs stay controlled and the user
 * can correct anything the model got wrong.
 */
export function toExtraction(data) {
  const customers = data?.customers ?? [];
  const orders = data?.orders ?? [];
  const payments = data?.payments ?? [];
  const tasks = data?.tasks ?? [];

  let intent = "unknown";

  if (orders.length && payments.length) intent = "record_sale";
  else if (orders.length) intent = "add_order";
  else if (payments.length) intent = "record_payment";
  else if (customers.length) intent = "add_customer";
  else if (tasks.length) intent = "set_reminder";

  const customer = joinUnique([
    ...customers.map((entry) => entry?.name),
    ...orders.map((order) => order?.customer),
    ...payments.map((payment) => payment?.customer),
  ]);

  const product = joinUnique(orders.map((order) => order?.item));

  const quantity = sumAmounts(orders.map((order) => order?.quantity));

  // Money actually received wins; otherwise fall back to what was ordered.
  const amount =
    sumAmounts(payments.map((payment) => payment?.amount)) ??
    sumAmounts(orders.map(orderValue));

  const date = joinUnique(
    orders.map((order) => order?.delivery_date),
    1,
  );

  // Money changing hands is the more meaningful status; fall back to the order.
  const status =
    joinUnique(
      payments.length
        ? payments.map((payment) => payment?.status)
        : orders.map((order) => order?.status),
      1,
    ) ?? "";

  const fields = {
    intent,
    customer: customer ?? "",
    product: product ?? "",
    quantity: quantity === null ? "" : String(quantity),
    amount: amount === null ? "" : String(amount),
    date: date ?? "",
  };

  return {
    ...fields,
    // Status is excluded from the confidence maths — the model defaults it, so
    // it's almost always present and would just inflate the number.
    status,
    confidence: deriveConfidence(fields),
    summary: data?.summary || "",
    tasks,
    insights: data?.insights ?? [],
  };
}

/** The card list is defined once so display and editing can never drift apart. */
export const RESULT_FIELDS = [
  { key: "intent", label: "Intent", format: formatIntent },
  { key: "customer", label: "Customer" },
  { key: "product", label: "Product" },
  { key: "quantity", label: "Quantity" },
  { key: "amount", label: "Amount", format: formatAmount, inputMode: "decimal" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

/**
 * Mirrors what the earlier page-level flow persisted, so history written by
 * the voice flow stays readable by anything already looking at these keys.
 */
export function saveEntry(entry) {
  try {
    localStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify(entry));

    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    const next = [entry, ...(Array.isArray(history) ? history : [])].slice(
      0,
      MAX_HISTORY,
    );

    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (storageError) {
    // Private mode or a full quota shouldn't break the flow.
    console.warn("Could not save analysis locally:", storageError);
  }
}
