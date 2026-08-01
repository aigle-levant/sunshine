// src/components/marketing/contentOptions.js
//
// The choices the editor and the suggestion panel offer. Kept as data so the
// modal's selects and the seeded plan can never drift apart, and so adding a
// platform is a one-line change.

/** Where a piece of content goes. WhatsApp leads because it always reaches. */
export const PLATFORMS = [
  "WhatsApp Status",
  "WhatsApp Group",
  "Instagram",
  "Facebook",
  "YouTube Shorts",
  "Website / Blog",
];

/**
 * What to draft it with. These are recommendations shown to the user — nothing
 * here is called by the app, so the list can name tools we don't integrate.
 */
export const AI_TOOLS = [
  "VoiceKart AI — caption from your voice note",
  "Claude — caption in Tamil + English",
  "Canva — layout and text on the photo",
  "CapCut — trim and subtitle the video",
  "ChatGPT — rewrite for a longer post",
];

export const DEFAULT_PLATFORM = PLATFORMS[0];

export const DEFAULT_TOOL = AI_TOOLS[0];

export const STATUSES = [
  { id: "planned", label: "Planned" },
  { id: "posted", label: "Posted" },
];
