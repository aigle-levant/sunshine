// src/components/planner/plannerModel.js
//
// The shape of a planner row, the options each cell offers, and the week-date
// arithmetic the table is laid out on. Pure — no React, no storage — so the
// table, the row editor and the AI import all agree on one definition.
//
// Dates are local "YYYY-MM-DD" keys rather than Date objects. `toISOString()`
// is avoided deliberately: it converts to UTC first, which in IST (+5:30)
// reports the previous day for anything before 05:30.

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const PLATFORMS = ["Instagram", "WhatsApp"];

export const CONTENT_TYPES = {
  Instagram: ["Post", "Reel", "Story", "Carousel"],
  WhatsApp: ["Promotional Message", "Customer Update", "Offer", "Reminder"],
};

// Data only — the icons for these live with the cells that draw them, so this
// module stays free of JSX concerns.
export const MEDIA_TYPES = [
  { id: "none", label: "No media" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
];

export const STATUSES = ["Draft", "Scheduled", "Published"];

export function mediaType(id) {
  return MEDIA_TYPES.find((entry) => entry.id === id) ?? MEDIA_TYPES[0];
}

/** Content types depend on the platform, so a platform change may invalidate one. */
export function typesFor(platform) {
  return CONTENT_TYPES[platform] ?? CONTENT_TYPES.Instagram;
}

export function coerceContentType(platform, contentType) {
  const options = typesFor(platform);

  return options.includes(contentType) ? contentType : options[0];
}

// ---------------------------------------------------------------------------
// Week dates
// ---------------------------------------------------------------------------

export function toKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function fromKey(key) {
  const [year, month, day] = String(key ?? "").split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

/** The Monday of whatever week `date` falls in. */
export function startOfWeek(date) {
  const day = date.getDay();

  const offset = (day + 6) % 7;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - offset);
}

export function addWeeks(weekStart, delta) {
  return new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate() + delta * 7,
  );
}

/** One entry per day of the week: `{ day, date, label }`. */
export function weekDays(weekStart) {
  return DAYS.map((day, index) => {
    const date = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + index,
    );

    return { day, date: toKey(date), label: shortDate(date) };
  });
}

export function shortDate(date) {
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function shortDateFor(key) {
  const date = fromKey(key);

  return date ? shortDate(date) : "";
}

/** "August 3 – August 9, 2026" */
export function formatWeekRange(weekStart) {
  const end = new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate() + 6,
  );

  const month = (date) => date.toLocaleDateString("en-IN", { month: "long" });

  return `${month(weekStart)} ${weekStart.getDate()} – ${month(end)} ${end.getDate()}, ${end.getFullYear()}`;
}

export function dateForDay(weekStart, day) {
  const index = Math.max(0, DAYS.indexOf(day));

  return weekDays(weekStart)[index].date;
}

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

/**
 * `<input type="time">` needs "HH:MM". The generator writes best-posting-time
 * as prose ("7:30 PM", "19:30", "Evening around 7pm"), so anything unreadable
 * falls back to a sane slot rather than an empty input.
 */
export function parseTime(value, fallback = "09:00") {
  const text = String(value ?? "").trim();

  if (!text) return fallback;

  const withMinutes = text.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  const hourOnly = text.match(/(\d{1,2})\s*(am|pm)/i);

  const match = withMinutes ?? hourOnly;

  if (!match) return fallback;

  let hours = Number(match[1]);

  const minutes = withMinutes ? Number(match[2]) : 0;

  const meridiem = (withMinutes ? match[3] : match[2])?.toLowerCase();

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  if (!Number.isFinite(hours) || hours > 23 || minutes > 59) return fallback;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** "19:30" → "7:30 PM" for the read-only cell. */
export function timeLabel(value) {
  const [hours, minutes] = String(value ?? "").split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "—";

  const meridiem = hours >= 12 ? "PM" : "AM";

  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

// ---------------------------------------------------------------------------
// Rows
// ---------------------------------------------------------------------------

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();

  return `row-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

export function createRow(overrides = {}) {
  return {
    id: newId(),
    day: "Monday",
    date: "",
    platform: "Instagram",
    contentType: "Post",
    title: "",
    caption: "",
    mediaType: "none",
    mediaUrl: "",
    scheduledTime: "09:00",
    status: "Draft",
    ...overrides,
  };
}

/** Monday first. Stable, so two rows on the same day keep their order. */
export function sortRows(rows) {
  return [...rows].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
}

/** Anything off a stored or generated payload, forced into the row shape. */
export function normaliseRow(row, weekStart) {
  const day = DAYS.includes(row?.day) ? row.day : DAYS[0];

  const platform = normalisePlatform(row?.platform);

  return createRow({
    ...row,
    id: row?.id || newId(),
    day,
    date: row?.date || dateForDay(weekStart, day),
    platform,
    contentType: coerceContentType(platform, row?.contentType),
    title: String(row?.title ?? ""),
    caption: String(row?.caption ?? ""),
    mediaType: mediaType(row?.mediaType).id,
    mediaUrl: String(row?.mediaUrl ?? ""),
    scheduledTime: parseTime(row?.scheduledTime),
    status: STATUSES.includes(row?.status) ? row.status : "Draft",
  });
}

function normalisePlatform(value) {
  return /whats\s*app/i.test(String(value ?? "")) ? "WhatsApp" : "Instagram";
}

// The generator returns one post per day without a content type, so the week
// alternates through the formats instead of showing seven identical ones.
const INSTAGRAM_ROTATION = ["Reel", "Carousel", "Post", "Story"];
const WHATSAPP_ROTATION = ["Promotional Message", "Offer", "Customer Update", "Reminder"];

function inferContentType(platform, index) {
  const rotation = platform === "WhatsApp" ? WHATSAPP_ROTATION : INSTAGRAM_ROTATION;

  return rotation[index % rotation.length];
}

/**
 * The backend's weekly plan, mapped onto table rows.
 *
 * `/api/planner/generate` answers with the richer campaign shape it already
 * had — objective, whatsappMessage, hashtags, imagePrompt, bestTime — so this
 * is the one place that translates. Nothing generated is thrown away: hashtags
 * ride along in the caption, and an image prompt becomes an image media slot.
 */
export function rowsFromGeneratedWeek(week, weekStart) {
  const days = weekDays(weekStart);

  return sortRows(
    (Array.isArray(week) ? week : []).slice(0, 7).map((entry, index) => {
      const platform = normalisePlatform(entry?.platform);

      const day = DAYS.includes(entry?.day) ? entry.day : DAYS[index];

      const slot = days.find((candidate) => candidate.day === day) ?? days[index];

      return createRow({
        day,
        date: slot.date,
        platform,
        contentType: inferContentType(platform, index),
        title: String(entry?.title ?? "").trim(),
        caption: captionFrom(entry, platform),
        mediaType: entry?.imagePrompt ? "image" : "none",
        mediaUrl: "",
        scheduledTime: parseTime(entry?.bestTime),
        status: "Draft",
      });
    }),
  );
}

function captionFrom(entry, platform) {
  const base =
    platform === "WhatsApp"
      ? entry?.whatsappMessage || entry?.caption
      : entry?.caption || entry?.whatsappMessage;

  const caption = String(base ?? "").trim();

  const hashtags = Array.isArray(entry?.hashtags)
    ? entry.hashtags
        .map((tag) => String(tag).trim())
        .filter(Boolean)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    : [];

  // Hashtags belong to Instagram copy; on WhatsApp they'd read as noise.
  if (platform === "WhatsApp" || !hashtags.length) return caption;

  return caption ? `${caption}\n\n${hashtags.join(" ")}` : hashtags.join(" ");
}
