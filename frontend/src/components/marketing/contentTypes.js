// src/components/marketing/contentTypes.js
//
// The four kinds of content the calendar plans, and the single place their
// colours live. Chips tint themselves from these hexes through `style` rather
// than through Tailwind classes: Tailwind only emits classes it can see in the
// source, so a colour chosen from data has to arrive as a value, not a name.

import { Camera, Image as ImageIcon, PenLine, Video } from "lucide-react";

export const CONTENT_TYPES = {
  post: {
    id: "post",
    label: "Post",
    // Muted rather than saturated, so four colour-coded types can sit next to
    // the terracotta accent without any of them shouting.
    color: "#D98BA5",
    icon: ImageIcon,
    hint: "One photo or a carousel",
  },
  story: {
    id: "story",
    label: "Story",
    color: "#A78BC8",
    icon: Camera,
    hint: "A 24-hour update",
  },
  blog: {
    id: "blog",
    label: "Blog",
    color: "#6E9E7E",
    icon: PenLine,
    hint: "A longer written piece",
  },
  vlog: {
    id: "vlog",
    label: "Vlog",
    color: "#D9A94E",
    icon: Video,
    hint: "A short video or reel",
  },
};

export const CONTENT_TYPE_LIST = Object.values(CONTENT_TYPES);

export const DEFAULT_TYPE = CONTENT_TYPES.post.id;

export function getContentType(id) {
  return CONTENT_TYPES[id] ?? CONTENT_TYPES[DEFAULT_TYPE];
}

/**
 * #RRGGBB → rgba(), for the translucent chip fills, rings and dots. Both
 * themes read the same hue this way; only the alpha changes.
 */
export function tint(hex, alpha = 1) {
  const clean = String(hex ?? "").replace("#", "");

  const full = clean.length === 3 ? clean.replace(/(.)/g, "$1$1") : clean;

  if (full.length !== 6) return `rgba(215, 122, 97, ${alpha})`;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
