// src/components/planner/PlannerTable.jsx
//
// The planner as a single spreadsheet-style grid: one scroll container, a
// header that stays put, and the Day column pinned to the left so a row is
// still identifiable when the table is scrolled sideways on a narrow screen.
//
// The table keeps its structure at every width — it scrolls horizontally rather
// than collapsing into cards, which is the whole point of a planning grid.

import { motion } from "framer-motion";

import useTheme from "../../hooks/useTheme";
import GenerateWeekButton from "../dashboard/GenerateWeekButton";
import PlannerRow from "./PlannerRow";

// Widths are minimums, so the table fills a wide screen and starts scrolling on
// a narrow one instead of squeezing the caption into a column of single words.
// Each is sized for its *editor* rather than its text — a column wide enough for
// "Wednesday" as a label still clips it inside a select.
const COLUMNS = [
  { key: "day", label: "Day", width: "min-w-[8rem]" },
  { key: "date", label: "Date", width: "min-w-[5rem]" },
  { key: "platform", label: "Platform", width: "min-w-[7rem]" },
  // Wide enough for "Promotional Message" as a selected value: a select can't
  // scroll its own text the way a text input can, so a short column truncates it.
  { key: "contentType", label: "Content Type", width: "min-w-[10.5rem]" },
  { key: "title", label: "Topic / Title", width: "min-w-[9rem]" },
  // The most compressible column: it's clamped to two lines here and gets a
  // full textarea in the editor, so it yields width to the fixed-size cells.
  { key: "caption", label: "Caption", width: "min-w-[10.5rem]" },
  { key: "media", label: "Media", width: "min-w-[8.5rem]" },
  { key: "time", label: "Time", width: "min-w-[6.5rem]" },
  { key: "status", label: "Status", width: "min-w-[7.5rem]" },
  { key: "actions", label: "Actions", width: "min-w-[6rem]" },
];

/** Same opaque surface the pinned Day cells use — see PlannerRow. */
const HEADER_SURFACE = "bg-[#E6E4E7] dark:bg-[#2D424C]";

function PlannerTable({
  rows,
  weekStart,
  editingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onGenerate,
  isGenerating,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const shell = `overflow-hidden rounded-[2rem] border transition-colors duration-500 ${
    isLight ? "border-[#223843]/10 bg-[#DBD3D8]/45" : "border-white/10 bg-white/5"
  }`;

  if (!rows.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={shell}
      >
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <p className="text-base font-semibold">📅 No content planned yet</p>

          <p
            className={`max-w-md text-sm leading-6 ${
              isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"
            }`}
          >
            Generate a personalised week using your business details and Instagram
            brand analysis — then edit any row directly in the table.
          </p>

          <GenerateWeekButton
            onGenerate={onGenerate}
            isLoading={isGenerating}
            isLight={isLight}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={shell}
    >
      {/* One scroll container: sideways on narrow screens, and vertically once
          editing has grown the rows past the viewport. */}
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {COLUMNS.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`sticky top-0 whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                    column.width
                  } ${HEADER_SURFACE} ${
                    // The Day header is pinned in both directions, so it has to
                    // sit above the row headers that scroll under it.
                    index === 0 ? "left-0 z-30" : "z-20"
                  } ${isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <PlannerRow
                key={row.id}
                row={row}
                weekStart={weekStart}
                isEditing={editingId === row.id}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default PlannerTable;
