// src/components/dashboard/studio/RecentGenerations.jsx
//
// Saved and previously generated content. Reuses the dashboard's relative-date
// formatter so "2 hours ago" reads the same here as it does on Orders.

import { motion } from "framer-motion";
import { Eye, FileText, Trash2 } from "lucide-react";

import useTheme from "../../../hooks/useTheme";
import Panel from "../Panel";
import { formatRelativeDate } from "../dashboardData";

/** "2 Aug, 6:30 pm" — the date helper alone loses the time, which matters here. */
function timestamp(iso) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "";

  const relative = formatRelativeDate(iso);

  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  return relative ? `${relative} · ${time}` : time;
}

function RecentGenerations({ history, onOpen, onDelete, delay = 0 }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const muted = isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55";

  return (
    <Panel
      eyebrow="History"
      title="Recent generations"
      count={history.length}
      delay={delay}
    >
      {history.length ? (
        <ul className="flex flex-col gap-3">
          {history.map((entry, index) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 * index, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 transition-colors duration-300 ${
                isLight
                  ? "border-[#223843]/10 bg-[#EFF1F3]/60"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {entry.thumbnail ? (
                <img
                  src={entry.thumbnail}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    isLight ? "bg-[#D77A61]/12" : "bg-[#D77A61]/20"
                  } text-[#D77A61]`}
                >
                  <FileText size={18} strokeWidth={1.9} />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold">{entry.title}</p>

                <p className={`mt-1 truncate text-[12.5px] ${muted}`}>
                  {entry.contentType} · {timestamp(entry.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpen(entry)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-300 ${
                    isLight
                      ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
                      : "border-white/15 hover:bg-white/10"
                  }`}
                >
                  <Eye size={14} strokeWidth={2} />
                  Open
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(entry.id)}
                  aria-label={`Delete ${entry.title}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[#C96B53] transition-colors duration-300 ${
                    isLight ? "hover:bg-[#223843]/8" : "hover:bg-white/10"
                  }`}
                >
                  <Trash2 size={15} strokeWidth={1.9} />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className={`text-[13.5px] leading-6 ${muted}`}>
          Nothing saved yet. Generated content you save will be listed here.
        </p>
      )}
    </Panel>
  );
}

export default RecentGenerations;
