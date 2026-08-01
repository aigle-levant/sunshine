// src/components/dashboard/InsightCard.jsx
//
// One observation from the model. Insights arrive as plain strings, so there's
// nothing to parse — the icon rotates by position purely for visual rhythm.

import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Users } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { formatRelativeDate } from "./dashboardData";

const ICONS = [Lightbulb, TrendingUp, Users];

function InsightCard({ insight, index = 0 }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const Icon = ICONS[index % ICONS.length];

  const when = formatRelativeDate(insight?.savedAt);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-4 rounded-2xl border p-4 transition-colors duration-300 ${
        isLight
          ? "border-[#223843]/10 bg-[#EFF1F3]/60"
          : "border-white/10 bg-white/5"
      }`}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D77A61]/15 text-[#D77A61]">
        <Icon size={16} strokeWidth={1.9} />
      </span>

      <div className="min-w-0">
        <p className="text-[15px] leading-7">{insight?.text}</p>

        {when && (
          <p
            className={`mt-1 text-xs ${
              isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
            }`}
          >
            {when}
          </p>
        )}
      </div>
    </motion.li>
  );
}

export default InsightCard;
