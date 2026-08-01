// src/components/marketing/ContentCalendar.jsx
//
// The month view. Two renderings of the same data: a seven-column grid from
// `md` up, and an agenda list below it — a 7×5 grid on a 360px phone gives each
// day about 45px, which is too narrow to read a chip in.
//
// The month being viewed is state here rather than in the page, so nothing above
// re-renders while paging through months.

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import Panel from "../dashboard/Panel";
import CalendarDayCell from "./CalendarDayCell";
import ContentChip from "./ContentChip";
import ContentTypeLegend from "./ContentTypeLegend";
import {
  addMonths,
  buildMonthCells,
  formatDayLabel,
  isSameMonth,
  monthLabel,
  startOfMonth,
  toKey,
  todayKey,
  WEEKDAY_LABELS,
} from "./calendarMonth";

function ContentCalendar({ byDate, onOpenItem, onAdd, onReseed, delay = 0 }) {
  const { theme } = useTheme();

  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()));

  const isLight = theme === "light";

  const cells = useMemo(() => buildMonthCells(monthDate), [monthDate]);

  const itemsFor = (key) => byDate.get(key) ?? [];

  // Only what falls inside the month being viewed — the padding cells belong to
  // the neighbouring months and shouldn't be counted here.
  const monthItems = cells.filter((cell) => cell.inMonth).flatMap((cell) => itemsFor(cell.key));

  const agendaDays = cells.filter(
    (cell) => cell.inMonth && itemsFor(cell.key).length > 0,
  );

  const isCurrentMonth = isSameMonth(monthDate, new Date());

  // "Add content" has to land on a day you can see. On the current month that's
  // today; on any other month it's the 1st, not today in a month you left.
  const addTarget = isCurrentMonth ? todayKey() : toKey(monthDate);

  const navButton = `flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
    isLight
      ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
      : "border-white/15 hover:bg-white/10"
  }`;

  const pillButton = `flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-300 ${
    isLight
      ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
      : "border-white/15 hover:bg-white/10"
  }`;

  return (
    <Panel
      eyebrow="Content calendar"
      title={monthLabel(monthDate)}
      count={monthItems.length}
      delay={delay}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMonthDate((current) => addMonths(current, -1))}
            aria-label="Previous month"
            className={navButton}
          >
            <ChevronLeft size={17} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => setMonthDate(startOfMonth(new Date()))}
            disabled={isCurrentMonth}
            className={`${pillButton} disabled:cursor-default disabled:opacity-40`}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => setMonthDate((current) => addMonths(current, 1))}
            aria-label="Next month"
            className={navButton}
          >
            <ChevronRight size={17} strokeWidth={2} />
          </button>
        </div>

        <ContentTypeLegend />
      </div>

      {monthItems.length === 0 ? (
        // Not the shared EmptyState: that one always offers the mic, and the
        // way out of an empty month is either adding a day or restoring the
        // suggested plan.
        <div
          className={`mt-6 flex flex-col items-center gap-4 rounded-[1.5rem] border border-dashed px-6 py-12 text-center ${
            isLight ? "border-[#223843]/15" : "border-white/15"
          }`}
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              isLight
                ? "bg-[#223843]/6 text-[#223843]/45"
                : "bg-white/8 text-[#EFF1F3]/45"
            }`}
          >
            <CalendarDays size={23} strokeWidth={1.7} />
          </span>

          <div>
            <p className="text-base font-semibold">
              Nothing planned in {monthLabel(monthDate)}
            </p>

            <p
              className={`mx-auto mt-1.5 max-w-xs text-sm leading-6 ${
                isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"
              }`}
            >
              Plan a post, story, blog or vlog — or fill this month with
              suggestions to start from.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => onAdd?.(addTarget)}
              className="flex items-center gap-2 rounded-full bg-[#D77A61] px-5 py-2.5 text-[13px] font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#C96B53]"
            >
              <Plus size={15} strokeWidth={2.2} />
              Add content
            </button>

            <button
              type="button"
              onClick={() => onReseed?.(monthDate)}
              className={pillButton}
            >
              <Sparkles size={15} strokeWidth={2} />
              Suggest a month
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Grid — md and up */}
          <div className="mt-6 hidden md:block">
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAY_LABELS.map((label) => (
                <p
                  key={label}
                  className={`pb-1 text-center text-[11px] font-semibold uppercase tracking-[0.16em] ${
                    isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
                  }`}
                >
                  {label}
                </p>
              ))}

              {cells.map((cell) => (
                <CalendarDayCell
                  key={cell.key}
                  cell={cell}
                  items={itemsFor(cell.key)}
                  onOpenItem={onOpenItem}
                  onAdd={onAdd}
                />
              ))}
            </div>
          </div>

          {/* Agenda — below md */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {agendaDays.map((cell) => (
              <div key={cell.key}>
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`text-[13px] font-semibold ${
                      cell.isToday
                        ? "text-[#D77A61]"
                        : isLight
                          ? "text-[#223843]/60"
                          : "text-[#EFF1F3]/60"
                    }`}
                  >
                    {formatDayLabel(cell.key)}
                    {cell.isToday && " · Today"}
                  </p>

                  <button
                    type="button"
                    onClick={() => onAdd?.(cell.key)}
                    aria-label={`Add content on ${formatDayLabel(cell.key)}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      isLight ? "bg-[#223843]/8" : "bg-white/10"
                    }`}
                  >
                    <Plus size={14} strokeWidth={2.2} />
                  </button>
                </div>

                <div className="mt-2.5 flex flex-col gap-2">
                  {itemsFor(cell.key).map((item) => (
                    <ContentChip
                      key={item.id}
                      item={item}
                      onOpen={onOpenItem}
                      detailed
                    />
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onAdd?.(addTarget)}
              className={`${pillButton} justify-center`}
            >
              <Plus size={15} strokeWidth={2.2} />
              Add content
            </button>
          </div>
        </>
      )}
    </Panel>
  );
}

export default ContentCalendar;
