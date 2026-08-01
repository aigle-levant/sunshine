// src/components/dashboard/CustomerRow.jsx
//
// One customer, merged across every entry that mentioned them. Names arrive
// romanised from the backend, so the initial is always a Latin letter.

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { formatCurrency, formatRelativeDate } from "./dashboardData";

function CustomerRow({ customer, index = 0, onSelect }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const mutedText = isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55";

  const initial = String(customer?.name ?? "?").trim().charAt(0).toUpperCase();

  const lastSeen = formatRelativeDate(customer?.lastSeen);

  const owes = customer?.outstanding > 0;

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.04 * index, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={() => onSelect?.(customer)}
        className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors duration-300 ${
          isLight ? "hover:bg-[#EFF1F3]/70" : "hover:bg-white/5"
        }`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D77A61]/15 text-[15px] font-semibold text-[#D77A61]">
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium">{customer?.name}</p>

          <p className={`mt-0.5 flex flex-wrap items-center gap-x-2.5 text-[13px] ${mutedText}`}>
            <span>
              {customer?.orders ?? 0}{" "}
              {customer?.orders === 1 ? "order" : "orders"}
            </span>

            {customer?.phone && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={12} strokeWidth={2} />
                  {customer.phone}
                </span>
              </>
            )}

            {lastSeen && (
              <>
                <span aria-hidden="true">·</span>
                <span>{lastSeen}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[15px] font-semibold">
            {formatCurrency(customer?.spent ?? 0)}
          </span>

          {owes && (
            <span className="rounded-full bg-[#D77A61]/14 px-2.5 py-1 text-[11px] font-semibold text-[#C96B53] dark:text-[#E29883]">
              {formatCurrency(customer.outstanding)} due
            </span>
          )}
        </div>
      </button>
    </motion.li>
  );
}

export default CustomerRow;
