// src/components/planner/WeekSwitcher.jsx
//
// Which week the table is showing. Each week is stored separately, so moving
// between them loads that week's own rows rather than re-dating these ones.

import { ChevronLeft, ChevronRight } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { formatWeekRange } from "./plannerModel";

function WeekSwitcher({ weekStart, onPrevious, onNext, onThisWeek, isThisWeek }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const button = `flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors duration-300 ${
    isLight
      ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
      : "border-white/15 hover:bg-white/10"
  }`;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous week"
        className={button}
      >
        <ChevronLeft size={15} strokeWidth={2} />
        <span className="hidden sm:inline">Previous Week</span>
      </button>

      <button
        type="button"
        onClick={onThisWeek}
        disabled={isThisWeek}
        // Not a link when you're already here, but still the label for where
        // "here" is — so it reads as the current range either way.
        className={`min-w-[13rem] text-center text-[14.5px] font-medium tracking-[-0.02em] transition-opacity duration-300 ${
          isThisWeek ? "cursor-default" : "hover:text-[#D77A61]"
        }`}
      >
        {formatWeekRange(weekStart)}
      </button>

      <button type="button" onClick={onNext} aria-label="Next week" className={button}>
        <span className="hidden sm:inline">Next Week</span>
        <ChevronRight size={15} strokeWidth={2} />
      </button>
    </div>
  );
}

export default WeekSwitcher;
