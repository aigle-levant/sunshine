// src/components/planner/StatusBadge.jsx
//
// Draft stays neutral, Scheduled takes the terracotta accent, Published uses
// the same muted green the dashboard's stat trends already use — so the accent
// still means "needs your attention" rather than "done".

import useTheme from "../../hooks/useTheme";

function StatusBadge({ status = "Draft" }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const tone =
    status === "Scheduled"
      ? "bg-[#D77A61]/15 text-[#C96B53] dark:text-[#E29883]"
      : status === "Published"
        ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
        : isLight
          ? "bg-[#223843]/8 text-[#223843]/65"
          : "bg-white/10 text-[#EFF1F3]/65";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tone}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
