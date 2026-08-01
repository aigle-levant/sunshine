// src/components/dashboard/Panel.jsx
//
// The card shell the four content sections share — eyebrow, title, optional
// trailing action, body. Defined once so RecentOrders, AIInsights,
// MarketingPreview and CustomerPreview stay visually identical.

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import useTheme from "../../hooks/useTheme";

function Panel({
  eyebrow = null,
  title,
  count = null,
  actionLabel = null,
  /** A route to link to. Takes precedence over `onAction`. */
  actionTo = null,
  onAction = null,
  children,
  delay = 0,
  className = "",
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[2rem] border p-6 transition-colors duration-500 sm:p-7 ${
        isLight
          ? "border-[#223843]/10 bg-[#DBD3D8]/45"
          : "border-white/10 bg-white/5"
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
              {eyebrow}
            </p>
          )}

          <h3 className="mt-2 flex items-center gap-3 text-xl font-medium tracking-[-0.035em]">
            {title}

            {count !== null && count > 0 && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isLight
                    ? "bg-[#223843]/8 text-[#223843]/60"
                    : "bg-white/10 text-[#EFF1F3]/60"
                }`}
              >
                {count}
              </span>
            )}
          </h3>
        </div>

        {actionLabel &&
          (actionTo || onAction) &&
          (() => {
            const content = (
              <>
                {actionLabel}
                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            );

            const styles =
              "group flex shrink-0 items-center gap-2 text-sm font-semibold text-[#D77A61] transition-colors duration-300 hover:text-[#C96B53]";

            return actionTo ? (
              <Link to={actionTo} className={styles}>
                {content}
              </Link>
            ) : (
              <button type="button" onClick={onAction} className={styles}>
                {content}
              </button>
            );
          })()}
      </div>

      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

export default Panel;
