// src/components/dashboard/StatCard.jsx
//
// Shared presentation for the four stat tiles. The named cards
// (RevenueCard, OrdersCard, …) each own their icon, label and formatting and
// delegate the shell here, so the grid can never drift out of alignment.

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

import useTheme from "../../hooks/useTheme";

function StatCard({
  label,
  value,
  caption = null,
  icon: Icon,
  trend = null,
  /** Pending money going up is bad news — flip which direction reads green. */
  invertTrend = false,
  index = 0,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const hasTrend = typeof trend === "number" && Number.isFinite(trend);

  const isGood = hasTrend && (invertTrend ? trend <= 0 : trend >= 0);

  const TrendIcon = hasTrend && trend >= 0 ? TrendingUp : TrendingDown;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.05 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`rounded-[1.75rem] border p-6 transition-colors duration-500 ${
        isLight
          ? "border-[#223843]/10 bg-[#DBD3D8]/45"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            isLight ? "bg-[#D77A61]/12" : "bg-[#D77A61]/20"
          } text-[#D77A61]`}
        >
          <Icon size={19} strokeWidth={1.9} />
        </span>

        {hasTrend && (
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              isGood
                ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                : "bg-[#D77A61]/14 text-[#C96B53] dark:text-[#E29883]"
            }`}
          >
            <TrendIcon size={13} strokeWidth={2.2} />
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>

      <p
        className={`mt-6 text-sm font-medium ${
          isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"
        }`}
      >
        {label}
      </p>

      <p className="mt-1.5 text-[clamp(1.7rem,2.6vw,2.3rem)] font-medium leading-tight tracking-[-0.04em]">
        {value}
      </p>

      {caption && (
        <p
          className={`mt-2 text-[13px] leading-6 ${
            isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
          }`}
        >
          {caption}
        </p>
      )}
    </motion.article>
  );
}

export default StatCard;
