// src/components/marketing/aiSuggestions.js
//
// The ideas behind "Today's AI content suggestion". Drafted here on the device
// rather than fetched — there's no marketing API yet — and grounded the same
// way MarketingPreview is: when a suggestion names a product, a customer or an
// amount, that value came out of the recorded entries. When there's nothing
// recorded yet the wording stays neutral instead of inventing a business.

import { formatCurrency } from "../dashboard/dashboardData";
import { CONTENT_TYPES } from "./contentTypes";

/** The item appearing in the most orders, with its count, if there's one. */
function topProduct(orders) {
  const counts = new Map();

  for (const order of orders) {
    const item = String(order?.item ?? "").trim();

    if (!item) continue;

    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  return best ? { item: best[0], count: best[1] } : null;
}

/**
 * Ordered by how much the data supports them: a suggestion that can name a
 * real product leads, and the evergreen ones fill in behind it. "Generate"
 * walks this list, so the first idea shown is always the best-grounded one.
 */
export function buildSuggestions({ orders = [], customers = [] } = {}) {
  const suggestions = [];

  const popular = topProduct(orders);

  if (popular) {
    suggestions.push({
      id: "top-product",
      type: CONTENT_TYPES.post.id,
      title: `Show today's ${popular.item}`,
      caption: `Fresh ${popular.item} ready today — made to order. Message me to reserve yours. 🌿`,
      platform: "WhatsApp Status",
      tool: "VoiceKart AI — caption from your voice note",
      reason: `${popular.item} appears in ${popular.count} ${
        popular.count === 1 ? "order" : "orders"
      } — your strongest seller.`,
    });

    suggestions.push({
      id: "top-product-vlog",
      type: CONTENT_TYPES.vlog.id,
      title: `How ${popular.item} is made`,
      caption: `One minute, start to finish. Turn the sound on — this is what ${popular.item} sounds like being made.`,
      platform: "YouTube Shorts",
      tool: "CapCut — trim and subtitle the video",
      reason: "Process videos travel further than product photos.",
    });
  }

  const repeat = customers.filter((customer) => customer.orders > 1);

  if (repeat.length) {
    suggestions.push({
      id: "repeat-customers",
      type: CONTENT_TYPES.post.id,
      title: `Thank ${repeat.length} repeat ${repeat.length === 1 ? "customer" : "customers"}`,
      caption:
        "Thank you to everyone who ordered again this month. Your trust keeps this work going. 🙏 மீண்டும் ஆர்டர் செய்த அனைவருக்கும் நன்றி.",
      platform: "WhatsApp Status",
      tool: "Canva — layout and text on the photo",
      reason: `${repeat.length} ${
        repeat.length === 1 ? "customer has" : "customers have"
      } ordered more than once.`,
    });
  }

  const owing = customers.filter((customer) => customer.outstanding > 0);

  if (owing.length) {
    const total = owing.reduce(
      (sum, customer) => sum + customer.outstanding,
      0,
    );

    suggestions.push({
      id: "gentle-nudge",
      type: CONTENT_TYPES.story.id,
      title: "This week's delivery schedule",
      caption:
        "Deliveries going out this week. If your order is on the list, I'll message you the day before.",
      platform: "WhatsApp Group",
      tool: "VoiceKart AI — caption from your voice note",
      // A public post, not a demand: the collection nudge stays a private
      // WhatsApp message on the Payments side.
      reason: `${formatCurrency(total)} is still to be collected — a schedule post reminds without naming anyone.`,
    });
  }

  // Evergreen ideas. These never name a product or a customer, so they're safe
  // to show on day one with nothing recorded.
  suggestions.push(
    {
      id: "behind-the-scenes",
      type: CONTENT_TYPES.story.id,
      title: "Morning setup",
      caption:
        "6 a.m. and the day has started. Come see what's ready today.",
      platform: "WhatsApp Status",
      tool: "VoiceKart AI — caption from your voice note",
      reason: "Behind-the-scenes stories get the most replies of any format.",
    },
    {
      id: "price-list",
      type: CONTENT_TYPES.post.id,
      title: "Price list for the week",
      caption:
        "This week's rates — same quality, same hands. இந்த வாரத்து விலை பட்டியல்.",
      platform: "WhatsApp Group",
      tool: "Canva — layout and text on the photo",
      reason: "A clear price list cuts down the back-and-forth on every order.",
    },
    {
      id: "care-guide",
      type: CONTENT_TYPES.blog.id,
      title: "Care and washing guide",
      caption:
        "Keep it looking new: what to do, what to avoid, and how to store it between seasons.",
      platform: "Website / Blog",
      tool: "Claude — caption in Tamil + English",
      reason: "Written guides keep bringing people back long after posting.",
    },
  );

  return suggestions;
}
