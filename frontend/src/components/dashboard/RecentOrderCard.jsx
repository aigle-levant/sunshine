// src/components/dashboard/RecentOrderCard.jsx
//
// A single order row. Fields the model couldn't extract come back null, so
// every line here is written to degrade to nothing rather than to "null".

import { motion } from "framer-motion";
import { CalendarClock, Package } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { formatCurrency, formatRelativeDate } from "./dashboardData";

/** Tone by status — muted amber for open work, green once it's done. */
function statusTone(status) {
  const value = String(status ?? "pending").toLowerCase();

  if (value === "completed" || value === "delivered") {
    return "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400";
  }

  if (value === "cancelled") {
    return "bg-red-500/12 text-red-600 dark:text-red-400";
  }

  return "bg-[#D77A61]/14 text-[#C96B53] dark:text-[#E29883]";
}

function RecentOrderCard({ order, index = 0 }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const mutedText = isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55";

  const quantity = order?.quantity;

  const item = [quantity ? `${quantity}×` : null, order?.item || "Item"]
    .filter(Boolean)
    .join(" ");

  const when = formatRelativeDate(order?.savedAt);

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.04 * index, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors duration-300 ${
        isLight ? "hover:bg-[#EFF1F3]/70" : "hover:bg-white/5"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          isLight ? "bg-[#223843]/6" : "bg-white/8"
        } ${mutedText}`}
      >
        <Package size={18} strokeWidth={1.8} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium">{item}</p>

        <p className={`mt-0.5 flex flex-wrap items-center gap-x-2.5 text-[13px] ${mutedText}`}>
          <span className="truncate">{order?.customer || "Unknown customer"}</span>

          {order?.delivery_date && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock size={12} strokeWidth={2} />
                {order.delivery_date}
              </span>
            </>
          )}

          {when && (
            <>
              <span aria-hidden="true">·</span>
              <span>{when}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {order?.value > 0 && (
          <span className="text-[15px] font-semibold">
            {formatCurrency(order.value)}
          </span>
        )}

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone(
            order?.status,
          )}`}
        >
          {order?.status || "Pending"}
        </span>
      </div>
    </motion.li>
  );
}

export default RecentOrderCard;
