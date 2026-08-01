// src/components/marketing/contentPlan.js
//
// The content plan itself: its shape, where it's kept, and the starter month it
// opens with. There's no marketing API yet, so localStorage is the whole store
// — same arrangement as `voicekart:entries`, and the routes above don't change
// when a real one arrives.
//
// The starter plan is a *suggestion*, not a record. It never claims a sale
// happened: when it names a product, that product really appears in the recorded
// orders, and it falls back to neutral wording when nothing has been recorded.

import { toKey } from "./calendarMonth";
import { DEFAULT_PLATFORM, DEFAULT_TOOL } from "./contentOptions";
import { DEFAULT_TYPE } from "./contentTypes";

const STORAGE_KEY = "voicekart:content-plan";

/** Bump when the item shape changes, so an old plan is reseeded not misread. */
const VERSION = 1;

function newId() {
  // Available on localhost and https; the fallback keeps file:// previews alive.
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

export function createItem({ date, type = DEFAULT_TYPE, ...rest } = {}) {
  return {
    id: newId(),
    date: date ?? toKey(new Date()),
    type,
    title: "",
    caption: "",
    platform: DEFAULT_PLATFORM,
    tool: DEFAULT_TOOL,
    status: "planned",
    ...rest,
  };
}

/** Guards the stored payload — anything unrecognised is treated as absent. */
export function readPlan() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");

    if (!parsed || parsed.version !== VERSION || !Array.isArray(parsed.items)) {
      return { seeded: false, items: [] };
    }

    return {
      seeded: Boolean(parsed.seeded),
      items: parsed.items.filter((item) => item && item.id && item.date),
    };
  } catch {
    // Private mode, or something else wrote to the key.
    return { seeded: false, items: [] };
  }
}

export function writePlan({ items, seeded = true }) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: VERSION, seeded, items }),
    );
  } catch {
    // Quota or private mode — the session still works, it just won't persist.
  }
}

export function sortByDate(items) {
  return [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

/** Items grouped by day key, so a cell looks up its own list in O(1). */
export function groupByDate(items) {
  const byDate = new Map();

  for (const item of sortByDate(items)) {
    const list = byDate.get(item.date);

    if (list) list.push(item);
    else byDate.set(item.date, [item]);
  }

  return byDate;
}

/** The item that appears in the most orders, if there's a clear favourite. */
function topProduct(orders) {
  const counts = new Map();

  for (const order of orders) {
    const item = String(order?.item ?? "").trim();

    if (!item) continue;

    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  return best?.[0] ?? null;
}

// Each type cycles through its own list, so a month of content doesn't repeat
// itself. `{product}` is filled from the recorded orders; the ideas that use it
// carry a `generic` wording for the case where nothing has been recorded yet —
// substituting a placeholder noun into the same sentence reads as broken.
const IDEAS = {
  post: [
    {
      title: "Show today's {product}",
      caption: "Fresh {product} ready today. Message me to reserve yours. 🌿",
      generic: {
        title: "What's ready today",
        caption: "Fresh stock ready today. Message me to reserve yours. 🌿",
      },
      platform: "WhatsApp Status",
    },
    {
      title: "Work in progress",
      caption:
        "Half done and already my favourite. Made to order — ask for your size and colour.",
      platform: "Instagram",
    },
    {
      title: "This week's prices",
      caption:
        "This week's rates. Same quality, same hands. இந்த வாரத்து விலை பட்டியல்.",
      platform: "WhatsApp Group",
    },
    {
      title: "Customer thank-you",
      caption:
        "Thank you for trusting my work. Your orders keep this going. 🙏",
      platform: "Facebook",
    },
  ],
  story: [
    {
      title: "Morning setup",
      caption: "6 a.m. and the day has started. Come see what's ready.",
      platform: "WhatsApp Status",
    },
    {
      title: "Two left",
      caption: "Only two left from today's batch. First message gets them.",
      platform: "WhatsApp Status",
    },
    {
      title: "Ask me anything",
      caption: "Poll: which colour should I make next?",
      platform: "Instagram",
    },
    {
      title: "Packing an order",
      caption: "Going out this evening. Delivery updates on the way.",
      platform: "Instagram",
    },
  ],
  blog: [
    {
      title: "How {product} is made",
      caption:
        "The full process, start to finish — the materials I choose and why it takes the time it takes.",
      generic: { title: "How my work is made" },
      platform: "Website / Blog",
    },
    {
      title: "Care & washing",
      caption:
        "Keep it looking new: what to do, what to avoid, and how to store it between seasons.",
      platform: "Website / Blog",
    },
  ],
  vlog: [
    {
      title: "Workshop day",
      caption:
        "One minute, start to finish. Turn the sound on — this is what the work sounds like.",
      platform: "YouTube Shorts",
    },
    {
      title: "Fresh batch",
      caption: "Straight off the loom. Which one would you pick?",
      platform: "YouTube Shorts",
    },
  ],
};

/**
 * The idea's wording for the data we actually have: its own copy when a product
 * is known, its `generic` fallback for whichever fields define one.
 */
function wordingFor(idea, product) {
  if (product) {
    return {
      title: idea.title.replaceAll("{product}", product),
      caption: idea.caption.replaceAll("{product}", product),
    };
  }

  return {
    title: idea.generic?.title ?? idea.title,
    caption: idea.generic?.caption ?? idea.caption,
  };
}

/**
 * A month of suggested content, laid out on a weekly rhythm: a post every
 * Monday, a story every Wednesday, a blog on alternate Fridays and one vlog in
 * the second week. Deterministic — the same month always seeds the same plan,
 * so a reload never shuffles the calendar.
 *
 * `month` is any date inside the month to lay out; only its year and month are
 * read. It's a parameter rather than always "now" so restoring suggestions
 * works on whichever month is being looked at.
 */
export function seedPlan({ orders = [], month: monthDate = new Date() } = {}) {
  const product = topProduct(orders);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const used = { post: 0, story: 0, blog: 0, vlog: 0 };

  let fridays = 0;

  const items = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);

    const weekday = date.getDay();

    let type = null;

    if (weekday === 1) type = "post";
    else if (weekday === 3) type = "story";
    else if (weekday === 5 && fridays++ % 2 === 0) type = "blog";
    else if (weekday === 6 && day > 7 && day <= 14) type = "vlog";

    if (!type) continue;

    const ideas = IDEAS[type];
    const idea = ideas[used[type] % ideas.length];

    used[type] += 1;

    const key = toKey(date);

    items.push({
      // Deterministic, so reseeding the same month can't duplicate a day.
      id: `seed-${type}-${key}`,
      date: key,
      type,
      ...wordingFor(idea, product),
      platform: idea.platform,
      tool: type === "vlog" ? "CapCut — trim and subtitle the video" : DEFAULT_TOOL,
      status: "planned",
    });
  }

  return items;
}
