// src/components/marketing/CalendarDayCell.jsx
//
// One day in the month grid. The cell itself isn't clickable — the chips and
// the add button are — so a mis-aimed tap never opens something unexpected.
//
// A busy day makes its whole week taller instead of clipping or hiding items
// behind a "+2 more". A capped, scrollable cell was tried first and read as
// broken: with no room for a scrollbar it just cut the last chip in half.

import { Plus } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { formatDayLabel } from "./calendarMonth";
import ContentChip from "./ContentChip";

/** The muted tone from the palette — enough to find today, not enough to shout. */
const TODAY = "#D8B4A0";

function CalendarDayCell({ cell, items = [], onOpenItem, onAdd }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const surface = cell.inMonth
    ? isLight
      ? "border-[#223843]/10 bg-[#EFF1F3]/70"
      : "border-white/10 bg-white/5"
    : isLight
      ? "border-[#223843]/5 bg-transparent"
      : "border-white/5 bg-transparent";

  return (
    <div
      className={`group relative flex min-h-[6.25rem] flex-col rounded-xl border p-1.5 transition-colors duration-300 sm:p-2 ${surface}`}
      style={
        cell.isToday
          ? { borderColor: TODAY, boxShadow: `inset 0 0 0 1px ${TODAY}` }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-1">
        {cell.isToday ? (
          <span
            style={{ backgroundColor: TODAY }}
            className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-semibold text-[#223843]"
          >
            {cell.day}
          </span>
        ) : (
          <span
            className={`px-1 text-[12px] font-semibold ${
              cell.inMonth
                ? isLight
                  ? "text-[#223843]/60"
                  : "text-[#EFF1F3]/60"
                : isLight
                  ? "text-[#223843]/25"
                  : "text-[#EFF1F3]/25"
            }`}
          >
            {cell.day}
          </span>
        )}

        <button
          type="button"
          onClick={() => onAdd?.(cell.key)}
          aria-label={`Add content on ${formatDayLabel(cell.key)}`}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full opacity-45 transition-all duration-200 group-hover:opacity-100 ${
            isLight
              ? "bg-[#223843]/8 hover:bg-[#D77A61] hover:text-[#EFF1F3]"
              : "bg-white/10 hover:bg-[#D77A61] hover:text-[#EFF1F3]"
          }`}
        >
          <Plus size={13} strokeWidth={2.4} />
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-1.5 flex flex-col gap-1.5">
          {items.map((item) => (
            <ContentChip key={item.id} item={item} onOpen={onOpenItem} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarDayCell;
