// src/components/marketing/ContentChip.jsx
//
// One planned piece of content, as it appears inside a day. The type's colour
// arrives as a style rather than a class — see contentTypes.js for why — and
// carries the fill, the border and the icon so the four types stay readable
// side by side in both themes.

import { Check } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { scriptFontStyle } from "../voice/language";
import { getContentType, tint } from "./contentTypes";

function ContentChip({ item, onOpen, detailed = false }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const type = getContentType(item?.type);

  const Icon = type.icon;

  const isPosted = item?.status === "posted";

  const title = item?.title?.trim() || type.label;

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      aria-label={`${type.label} on ${item?.date}: ${title}. Open to edit.`}
      // A month cell gives a chip ~80px; the tooltip is where the full title
      // and platform stay reachable without opening the editor.
      title={`${title} — ${type.label} · ${item?.platform ?? ""}`}
      style={{
        backgroundColor: tint(type.color, isLight ? 0.16 : 0.22),
        borderColor: tint(type.color, isLight ? 0.4 : 0.45),
      }}
      className={`group flex w-full items-start rounded-lg border text-left transition-transform duration-200 hover:-translate-y-px focus-visible:-translate-y-px ${
        detailed ? "gap-2.5 rounded-xl px-3 py-2.5" : "gap-1 px-1.5 py-1"
      }`}
    >
      {/* Only in the agenda. In the grid the icon costs a third of the readable
          width, and the tint plus the legend already name the type. */}
      {detailed && (
        <Icon
          size={15}
          strokeWidth={2}
          style={{ color: type.color }}
          className="mt-0.5 shrink-0"
        />
      )}

      <span className="min-w-0 flex-1">
        <span
          style={scriptFontStyle(title)}
          // Two lines in the grid rather than one truncated line — a month cell
          // is ~80px wide but has the vertical room, and most days hold one item.
          className={`block font-semibold ${
            detailed
              ? "truncate text-[13.5px] leading-5"
              : "line-clamp-2 text-[11.5px] leading-4"
          } ${isPosted ? "opacity-55" : ""}`}
        >
          {title}
        </span>

        {detailed && item?.platform && (
          <span
            className={`mt-1 block truncate text-[12px] leading-5 ${
              isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"
            }`}
          >
            {type.label} · {item.platform}
          </span>
        )}
      </span>

      {isPosted && (
        <Check
          size={detailed ? 14 : 11}
          strokeWidth={2.6}
          style={{ color: type.color }}
          className={`shrink-0 ${detailed ? "mt-1" : "mt-0.5"}`}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default ContentChip;
