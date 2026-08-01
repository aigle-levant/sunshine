// src/components/marketing/AISuggestionPanel.jsx
//
// Today's suggestion, with the three things the user actually needs to act on
// it: what to say, what to draft it with, and where to put it.
//
// "Generate" walks the locally drafted ideas rather than calling anything —
// there's no marketing endpoint yet — and "Post" schedules the idea on today
// instead of publishing on someone's behalf. Both are labelled as such: a
// button that claims to publish and doesn't is worse than one that says so.

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Pencil, Send, Sparkles } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import Panel from "../dashboard/Panel";
import { scriptFontStyle } from "../voice/language";
import { buildSuggestions } from "./aiSuggestions";
import { formatDayLabel, todayKey } from "./calendarMonth";
import { createItem } from "./contentPlan";
import { getContentType, tint } from "./contentTypes";

function AISuggestionPanel({ orders = [], customers = [], onEdit, onPost, delay = 0 }) {
  const { theme } = useTheme();

  const suggestions = useMemo(
    () => buildSuggestions({ orders, customers }),
    [orders, customers],
  );

  const [index, setIndex] = useState(0);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const draftTimer = useRef(null);
  const postedTimer = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(draftTimer.current);
      clearTimeout(postedTimer.current);
    },
    [],
  );

  const isLight = theme === "light";

  const suggestion = suggestions[index % suggestions.length];

  const type = getContentType(suggestion.type);

  const TypeIcon = type.icon;

  /** The suggestion as a plan item, scheduled for today. */
  const toItem = (overrides = {}) =>
    createItem({
      date: todayKey(),
      type: suggestion.type,
      title: suggestion.title,
      caption: suggestion.caption,
      platform: suggestion.platform,
      tool: suggestion.tool,
      ...overrides,
    });

  const handleGenerate = () => {
    setIsPosted(false);
    setIsDrafting(true);

    // Long enough to read as a fresh draft, short enough not to feel like a wait.
    draftTimer.current = setTimeout(() => {
      setIndex((current) => current + 1);
      setIsDrafting(false);
    }, 450);
  };

  const handlePost = () => {
    onPost?.(toItem({ status: "posted" }));

    setIsPosted(true);

    postedTimer.current = setTimeout(() => setIsPosted(false), 2600);
  };

  // Stacked, not two columns: the tool names are long enough that a label/value
  // row wraps into each other at this panel's width.
  const detailRow = "py-3.5";

  const detailLabel = `text-[11px] font-semibold uppercase tracking-[0.18em] ${
    isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
  }`;

  return (
    <Panel eyebrow="Today" title="AI content suggestion" delay={delay}>
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          style={{
            backgroundColor: tint(type.color, isLight ? 0.16 : 0.22),
            borderColor: tint(type.color, isLight ? 0.4 : 0.45),
          }}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
        >
          <TypeIcon size={12} strokeWidth={2.2} style={{ color: type.color }} />
          {type.label}
        </span>

        <span
          className={`text-[12.5px] font-semibold ${
            isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
          }`}
        >
          {formatDayLabel(todayKey())}
        </span>
      </div>

      <p
        className="mt-4 text-[17px] font-medium leading-7 tracking-[-0.02em]"
        style={scriptFontStyle(suggestion.title)}
      >
        {suggestion.title}
      </p>

      <p
        className={`mt-2 text-[13px] leading-6 ${
          isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"
        }`}
      >
        {suggestion.reason}
      </p>

      <div className="mt-5">
        <p className={detailLabel}>Caption</p>

        <p
          className={`mt-2 rounded-xl px-4 py-3.5 text-[14.5px] leading-7 transition-opacity duration-300 ${
            isLight ? "bg-[#223843]/5" : "bg-black/20"
          } ${isDrafting ? "opacity-40" : "opacity-100"}`}
          style={scriptFontStyle(suggestion.caption)}
        >
          “{suggestion.caption}”
        </p>
      </div>

      <dl
        className={`mt-5 divide-y ${
          isLight ? "divide-[#223843]/10" : "divide-white/10"
        }`}
      >
        <div className={detailRow}>
          <dt className={detailLabel}>Suggested AI tool</dt>

          <dd className="mt-1.5 text-[13.5px] font-semibold leading-6">
            {suggestion.tool}
          </dd>
        </div>

        <div className={detailRow}>
          <dt className={detailLabel}>Recommended platform</dt>

          <dd className="mt-1.5 text-[13.5px] font-semibold leading-6">
            {suggestion.platform}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-full bg-[#D77A61] px-5 py-2.5 text-[13px] font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#C96B53]"
        >
          <Sparkles size={14} strokeWidth={2} />
          {isDrafting ? "Drafting…" : "Generate"}
        </button>

        <button
          type="button"
          onClick={() => onEdit?.(toItem())}
          className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
            isLight
              ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
              : "border-white/15 hover:bg-white/10"
          }`}
        >
          <Pencil size={14} strokeWidth={2} />
          Edit
        </button>

        <button
          type="button"
          onClick={handlePost}
          className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
            isPosted
              ? "border-[#D77A61] text-[#D77A61]"
              : isLight
                ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
                : "border-white/15 hover:bg-white/10"
          }`}
        >
          {isPosted ? (
            <Check size={14} strokeWidth={2.4} />
          ) : (
            <Send size={14} strokeWidth={2} />
          )}
          {isPosted ? "On today" : "Post"}
        </button>
      </div>

      <p
        className={`mt-4 text-[12px] leading-6 ${
          isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
        }`}
      >
        {isPosted
          ? "Saved to today’s calendar as posted."
          : "Drafted from your own records on this device. Post marks it on today’s calendar — nothing is published for you."}
      </p>
    </Panel>
  );
}

export default AISuggestionPanel;
