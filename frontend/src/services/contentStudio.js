// src/services/contentStudio.js
//
// The AI Content Studio's service layer. Same shape as services/planner.js and
// services/api.js — the page never fetches directly, so wiring the real backend
// means editing this file only.
//
// Nothing here calls a model yet. Each function is a placeholder that returns
// the shape the UI expects; every TODO marks exactly where the request goes.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * The routes each placeholder below will call, in one place — so wiring the
 * backend starts here rather than by hunting for string literals.
 */
export const ENDPOINTS = {
  generate: `${API_URL}/api/studio/generate`,
  drafts: `${API_URL}/api/studio/drafts`,
  history: `${API_URL}/api/studio/history`,
};

const HISTORY_KEY = "voicekart:studio-history";

/** Matches the delay of a real round trip closely enough to exercise the UI. */
const FAKE_LATENCY = 900;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();

  return `gen-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

// Sample copy per content type. Written as templates so the preview visibly
// reflects the tone, audience and product the user actually chose — it is not
// pretending to be model output.
const SAMPLES = {
  "Instagram Post": {
    title: "{subject}, made for {audience}",
    caption:
      "Every piece starts on the loom before sunrise. {subject} — finished by hand, ready to ship today. Tap to see the full collection.",
    hashtags: ["handmade", "shoplocal", "smallbusiness", "madeinindia", "artisan"],
    cta: "Message us to reserve yours",
  },
  "Facebook Post": {
    title: "New this week: {subject}",
    caption:
      "We've just finished a fresh batch of {subject}. Made in small numbers, priced fairly, and delivered across the district. Comment below and we'll send you the details.",
    hashtags: ["localbusiness", "handmade", "supportsmall"],
    cta: "Comment or message to order",
  },
  "Product Description": {
    title: "{subject}",
    caption:
      "Handwoven {subject}, finished with a soft edge and colour-fast dye. Made to order in small batches, so no two are identical. Care: cold wash, dry in shade.",
    hashtags: [],
    cta: "Add to cart",
  },
  "Promotional Offer": {
    title: "This week only: {subject}",
    caption:
      "Our {subject} is 15% off until Sunday — the same quality, the same hands, a better price. Limited stock for {audience}.",
    hashtags: ["offer", "sale", "limitedstock"],
    cta: "Order before Sunday",
  },
  "WhatsApp Marketing": {
    title: "{subject} — available now",
    caption:
      "Vanakkam! Our {subject} is ready this week. Reply with the quantity you'd like and we'll confirm delivery. Thank you for supporting our work.",
    hashtags: [],
    cta: "Reply to confirm your order",
  },
  Email: {
    title: "Your {subject} is ready",
    caption:
      "Hello,\n\nThis week's {subject} has just come off the loom. We keep each batch small so the quality stays consistent, and we'd love for you to see it first.\n\nReply to this email and we'll hold one for you.",
    hashtags: [],
    cta: "Reply to reserve yours",
  },
  Blog: {
    title: "How our {subject} is made, start to finish",
    caption:
      "The process behind {subject} hasn't changed in three generations. This post walks through choosing the yarn, setting the loom, and why a single piece takes two days rather than two hours — and what that means for {audience} buying it.",
    hashtags: ["craft", "process", "handloom"],
    cta: "Read the full story",
  },
  "Advertisement Copy": {
    title: "{subject}. Handmade, not mass-made.",
    caption:
      "Built for {audience} who notice the difference. {subject}, made in small batches and delivered to your door.",
    hashtags: ["handmade", "shoplocal"],
    cta: "Shop now",
  },
};

/** The first clause of the prompt, used as the subject of the sample copy. */
function subjectFrom(prompt) {
  const first = String(prompt ?? "")
    .split(/[.\n,]/)[0]
    .trim();

  if (!first) return "our latest product";

  return first.length > 60 ? `${first.slice(0, 57)}…` : first.toLowerCase();
}

function fill(text, { subject, audience }) {
  return String(text)
    .replaceAll("{subject}", subject)
    .replaceAll("{audience}", audience || "your customers");
}

/**
 * Generate marketing copy for the studio form.
 *
 * TODO(backend): POST ENDPOINTS.generate with
 * { contentType, prompt, tone, language, targetAudience, image } — the image as
 * multipart/form-data or a base64 data URL, depending on what the route takes —
 * and return the parsed { title, caption, hashtags, cta } from the response.
 * Follow the error handling in services/planner.js: throw a friendly Error on a
 * failed fetch, and payload.error on a non-2xx.
 */
export async function generateContent({
  contentType = "Instagram Post",
  prompt = "",
  tone = "Friendly",
  language = "English",
  targetAudience = "",
  image = null,
} = {}) {
  await wait(FAKE_LATENCY);

  const sample = SAMPLES[contentType] ?? SAMPLES["Instagram Post"];

  const subject = subjectFrom(prompt);

  return {
    id: newId(),
    contentType,
    tone,
    language,
    targetAudience,
    title: fill(sample.title, { subject, audience: targetAudience }),
    caption: fill(sample.caption, { subject, audience: targetAudience }),
    hashtags: sample.hashtags,
    cta: sample.cta,
    hasImage: Boolean(image),
    createdAt: new Date().toISOString(),
    // Flagged so the result card can say so rather than passing sample copy off
    // as generated. Remove once the route above is live.
    isPreview: true,
  };
}

// ---------------------------------------------------------------------------
// History
//
// Kept in localStorage for now, seeded once with the sample entries below so
// the section isn't empty on a first visit. Same arrangement as
// `voicekart:entries` — the routes above don't change when an API arrives.
// ---------------------------------------------------------------------------

const SEED_HISTORY = [
  {
    id: "seed-1",
    title: "Fresh cotton sarees, made for weekend markets",
    contentType: "Instagram Post",
    thumbnail: null,
    createdAt: new Date(Date.now() - 2 * 3600e3).toISOString(),
  },
  {
    id: "seed-2",
    title: "This week only: murukku gift boxes",
    contentType: "Promotional Offer",
    thumbnail: null,
    createdAt: new Date(Date.now() - 26 * 3600e3).toISOString(),
  },
  {
    id: "seed-3",
    title: "How our handloom towels are made, start to finish",
    contentType: "Blog",
    thumbnail: null,
    createdAt: new Date(Date.now() - 3 * 24 * 3600e3).toISOString(),
  },
];

function readHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "null");

    if (!Array.isArray(parsed)) return null;

    return parsed.filter((entry) => entry && entry.id);
  } catch {
    // Private mode, or something else wrote to the key.
    return null;
  }
}

function writeHistory(entries) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // Quota (thumbnails) or private mode — the session still works.
  }
}

/**
 * TODO(backend): GET ENDPOINTS.history and return payload.items.
 */
export async function getHistory() {
  await wait(300);

  const stored = readHistory();

  if (stored) return stored;

  writeHistory(SEED_HISTORY);

  return SEED_HISTORY;
}

/**
 * TODO(backend): POST ENDPOINTS.drafts with the generated content
 * and the image reference, and return the saved row.
 */
export async function saveDraft(content, { thumbnail = null } = {}) {
  await wait(400);

  const entry = {
    id: content?.id ?? newId(),
    title: content?.title ?? "Untitled draft",
    contentType: content?.contentType ?? "Instagram Post",
    caption: content?.caption ?? "",
    hashtags: content?.hashtags ?? [],
    cta: content?.cta ?? "",
    thumbnail,
    createdAt: new Date().toISOString(),
  };

  const existing = readHistory() ?? SEED_HISTORY;

  // Saving the same generation twice updates it rather than duplicating it.
  writeHistory([entry, ...existing.filter((item) => item.id !== entry.id)]);

  return entry;
}

/**
 * TODO(backend): DELETE `${ENDPOINTS.history}/${id}`.
 */
export async function deleteHistory(id) {
  await wait(200);

  const existing = readHistory() ?? SEED_HISTORY;

  writeHistory(existing.filter((entry) => entry.id !== id));

  return { id };
}
